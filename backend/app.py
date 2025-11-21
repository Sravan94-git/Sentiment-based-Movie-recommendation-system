from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
import uvicorn
from typing import List, Optional, Dict
import os
import math
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

app = FastAPI(title="Movie Sentiment API", version="1.3")

# --- CORS Configuration ---
origins_env = os.getenv("ALLOWED_ORIGINS")
if origins_env:
    origins = [origin.strip() for origin in origins_env.split(",")]
else:
    origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Load Model and Vectorizer ---
try:
    model = joblib.load("sentiment_model.pkl")
    vectorizer = joblib.load("vectorizer.pkl")
    print("✅ Model and vectorizer loaded successfully.")
except Exception as e:
    print(f"❌ Error loading model assets: {e}")
    model = None
    vectorizer = None

# --- Data Models ---

class SentimentRequest(BaseModel):
    movie_name: str
    review_text: str

class MovieRecommendation(BaseModel):
    id: int
    title: str
    overview: str
    poster_path: Optional[str] = None
    release_date: Optional[str] = None
    vote_average: float

class SentimentResponse(BaseModel):
    sentiment: str
    sentiment_score: float
    confidence: float
    original_review_text: str
    reviewed_movie_title: str
    recommendations: List[MovieRecommendation]

# --- TMDB Configuration ---
TMDB_API_KEY = os.getenv("TMDB_API_KEY")
TMDB_BASE_URL = "https://api.themoviedb.org/3"
TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"

# Sentiment mapping
SENTIMENT_MAPPING: Dict[int, str] = {
    0: "Negative",
    1: "Somewhat Negative",
    2: "Neutral",
    3: "Somewhat Positive",
    4: "Positive",
}

# --- TMDB Session Setup ---
session = requests.Session()
retry_strategy = Retry(
    total=3,
    backoff_factor=1,
    status_forcelist=[429, 500, 502, 503, 504],
    allowed_methods=["GET"],
)
adapter = HTTPAdapter(max_retries=retry_strategy)
session.mount("https://", adapter)
session.mount("http://", adapter)

DEFAULT_HEADERS = {
    "User-Agent": "MovieSentimentAPI/1.0"
}

# --- Helper Functions ---

def tmdb_api_call(endpoint: str, params: Optional[dict] = None):
    """Generic TMDB API caller."""
    if params is None:
        params = {}
    if not TMDB_API_KEY:
        return None

    params["api_key"] = TMDB_API_KEY
    if "language" not in params:
        params["language"] = "en-US"
        
    url = f"{TMDB_BASE_URL}{endpoint}"

    try:
        response = session.get(url, params=params, headers=DEFAULT_HEADERS, timeout=10)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"⚠️ TMDB API Error on {endpoint}: {e}")
        return None

def get_movie_metadata(movie_name: str):
    """
    Search for the movie by name to get its ID, Genres, and Language.
    """
    data = tmdb_api_call("/search/movie", {"query": movie_name})
    
    if data and "results" in data and len(data["results"]) > 0:
        top_result = data["results"][0]
        return {
            "id": top_result.get("id"),
            "genre_ids": top_result.get("genre_ids", []),
            "original_language": top_result.get("original_language", "en"),
            "title": top_result.get("title")
        }
    return None

def predict_sentiment(review_text: str):
    """Predicts sentiment label and confidence score."""
    if model is None or vectorizer is None:
        return "Neutral", 0.5

    vectorized = vectorizer.transform([review_text])
    prediction = model.predict(vectorized)[0]
    sentiment_label = SENTIMENT_MAPPING.get(int(prediction), "Neutral")

    confidence = 0.5
    if hasattr(model, "decision_function"):
        decision_scores = model.decision_function(vectorized)[0]
        raw_score = float(max(decision_scores)) if hasattr(decision_scores, "__len__") else float(decision_scores)
        confidence = 1 / (1 + math.exp(-abs(raw_score)))
    elif hasattr(model, "predict_proba"):
        confidence = float(max(model.predict_proba(vectorized)[0]))

    return sentiment_label, min(1.0, max(0.0, confidence))

def format_recommendations(movies: List[dict]) -> List[MovieRecommendation]:
    """Formats raw TMDB data into clean Pydantic models."""
    if not movies:
        return []
    results = []
    for m in movies:
        poster = f"{TMDB_IMAGE_BASE_URL}{m['poster_path']}" if m.get("poster_path") else None
        results.append(MovieRecommendation(
            id=m.get("id", 0),
            title=m.get("title", "Unknown"),
            overview=m.get("overview", ""),
            poster_path=poster,
            release_date=m.get("release_date", ""),
            vote_average=m.get("vote_average", 0.0)
        ))
    return results

def get_context_aware_recommendations(sentiment: str, metadata: Optional[dict]) -> List[dict]:
    """
    Generates recommendations based on Sentiment + Movie Metadata (Genre/Lang).
    Includes robust fallbacks for new/regional movies.
    """
    # 1. GLOBAL FALLBACK: If no metadata, just show generic top rated
    if not metadata:
        print("⚠️ Movie metadata not found, using generic fallback.")
        if sentiment in ["Positive", "Somewhat Positive"]:
            return tmdb_api_call("/movie/top_rated", {"page": 1})["results"][:8]
        else:
            return tmdb_api_call("/movie/popular", {"page": 1})["results"][:8]

    movie_id = metadata["id"]
    
    # Use pipe '|' (OR) for genres to broaden search results
    genres = "|".join(str(g) for g in metadata["genre_ids"])
    
    lang = metadata["original_language"]
    
    # Adaptive Vote Count: Lower threshold for non-English movies to find regional hits
    vote_threshold = 1000 if lang == "en" else 50

    print(f"🔎 Strategy: Sentiment={sentiment} | Genre IDs={genres} | Lang={lang} | MinVotes={vote_threshold}")

    try:
        # --- STRATEGY A: POSITIVE/NEUTRAL (More like this) ---
        if sentiment in ["Positive", "Somewhat Positive", "Neutral"]:
            # Attempt 1: Direct TMDB Recommendations
            endpoint = f"/movie/{movie_id}/recommendations"
            data = tmdb_api_call(endpoint, {"language": "en-US", "page": 1})
            
            if data and data.get("results"):
                print("   -> ✅ Found direct TMDB recommendations.")
                return data["results"][:8]

            # Attempt 2 (Fallback): TMDB 'Similar' endpoint
            print("   -> ⚠️ Direct recommendations empty. Trying '/similar' endpoint...")
            endpoint = f"/movie/{movie_id}/similar"
            data = tmdb_api_call(endpoint, {"language": "en-US", "page": 1})
            
            if data and data.get("results"):
                return data["results"][:8]

            # Attempt 3 (Final Fallback): Genre Discovery (Popular)
            print("   -> ⚠️ 'Similar' empty. Falling back to Genre Discovery.")
            return tmdb_api_call("/discover/movie", {
                "with_genres": genres,
                "with_original_language": lang,
                "sort_by": "popularity.desc", 
                "vote_count.gte": vote_threshold,
                "page": 1
            }).get("results", [])[:8]

        # --- STRATEGY B: NEGATIVE (Better versions of this) ---
        else:
            # Find Top Rated movies in the same Genre/Language
            print("   -> 📉 Negative Sentiment. Finding Top Rated in same genre.")
            return tmdb_api_call("/discover/movie", {
                "with_genres": genres, 
                "with_original_language": lang,
                "sort_by": "vote_average.desc",
                "vote_count.gte": vote_threshold,
                "page": 1
            }).get("results", [])[:8]

    except Exception as e:
        print(f"❌ Error in recommendation logic: {e}")
        # Safety net: return generic popular movies
        return tmdb_api_call("/movie/popular", {"page": 1}).get("results", [])[:8]


# --- API ENDPOINTS ---

@app.post("/predict_locale", response_model=SentimentResponse)
async def predict_locale(request: SentimentRequest):
    if not request.movie_name or not request.review_text:
        raise HTTPException(status_code=400, detail="Missing inputs")

    try:
        # 1. Identify the movie
        metadata = get_movie_metadata(request.movie_name)
        
        # 2. Predict Sentiment
        sentiment, confidence = predict_sentiment(request.review_text)

        # 3. Get Smart Recommendations
        raw_recs = get_context_aware_recommendations(sentiment, metadata)
        recommendations = format_recommendations(raw_recs)
        
        reviewed_title = metadata["title"] if metadata else request.movie_name

        print(f"✅ Result: {reviewed_title} -> {sentiment}")

        return SentimentResponse(
            sentiment=sentiment,
            sentiment_score=confidence,
            confidence=confidence,
            original_review_text=request.review_text,
            reviewed_movie_title=reviewed_title,
            recommendations=recommendations,
        )

    except Exception as e:
        print(f"❌ Server Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# --- PROXY ENDPOINTS ---

@app.get("/tmdb/trending", response_model=List[MovieRecommendation])
async def get_trending():
    data = tmdb_api_call("/trending/movie/week")
    return format_recommendations(data.get("results", [])[:15] if data else [])

@app.get("/tmdb/discover", response_model=List[MovieRecommendation])
async def get_discover(type: str = "popular"):
    params = {"with_genres": "16", "sort_by": "popularity.desc"} if type == "animated" else {}
    endpoint = "/discover/movie" if type == "animated" else "/movie/popular"
    data = tmdb_api_call(endpoint, params)
    return format_recommendations(data.get("results", [])[:15] if data else [])

@app.get("/tmdb/search", response_model=List[MovieRecommendation])
async def search_proxy(query: str):
    if len(query) < 2: return []
    data = tmdb_api_call("/search/movie", {"query": query})
    return format_recommendations(data.get("results", [])[:8] if data else [])

@app.get("/")
async def home():
    return {"status": "healthy", "model": model is not None}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=7860)