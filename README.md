🎬 CineSense - AI Powered Movie Matchmaker

<!--
⭐⭐⭐ DEMO VIDEO SECTION ⭐⭐⭐
Replace 'YOUR_VIDEO_ID' in the link below with your actual YouTube video ID.
If you are using a direct file upload, replace the entire line with the path to your file.
-->

"Tell us how a film made you feel, and we shall find your next masterpiece."

CineSense is a full-stack AI application that recommends movies based on your emotional response to a film. Unlike standard recommenders that just look at genres, CineSense analyzes the sentiment of your personal review to understand your mood and curate a list of films that match that specific emotional tone.

🧠 The Machine Learning Core

The heart of CineSense is a custom-trained Sentiment Analysis Model. We built this from scratch using a rigorous data science pipeline:

1. Data Collection 🕷️

Source: IMDB Movie Reviews.

Method: Custom web scraping script using BeautifulSoup.

Dataset: The raw data is stored in train.csv within this repository.

2. Preprocessing & NLP 🧹

Before training, the text data undergoes extensive cleaning:

Lowercasing & Normalization: Converting text to standard format.

Noise Removal: Stripping out digits, special characters, and punctuation using RegEx.

Stopword Removal: Using NLTK to remove common non-informative words (e.g., "the", "is", "and").

3. Feature Engineering & Balancing ⚖️

Vectorization: We use TF-IDF (Term Frequency-Inverse Document Frequency) with a max feature limit of 5000 to convert text into numerical vectors.

Class Balancing: The original dataset was imbalanced. We applied SMOTE (Synthetic Minority Over-sampling Technique) to generate synthetic samples, ensuring the model performs equally well across all 5 sentiment classes.

4. Model Training 🚀

We experimented with multiple algorithms (Naive Bayes, Logistic Regression) but selected Linear SVC (Support Vector Classifier) for its superior accuracy and inference speed on high-dimensional text data.

Classes: 5-point scale (Negative, Somewhat Negative, Neutral, Somewhat Positive, Positive).

Framework: Scikit-learn.

🛠️ Tech Stack

Frontend (Client)

React 18 (Vite) - Fast, modern UI library.

Tailwind CSS - For a bespoke, responsive "Cinematic" design.

Framer Motion - Smooth, high-performance animations.

Lucide React - Beautiful, consistent iconography.

Backend (Server)

FastAPI - High-performance, async Python framework.

Uvicorn - Lightning-fast ASGI server.

Joblib - For loading the serialized ML models (.pkl files) efficiently.

TMDB API - Used to fetch rich movie metadata (posters, ratings, backdrops) for recommendations.

DevOps & Deployment

Docker & Docker Compose - Containerization for consistent environments.

Nginx - Production-grade reverse proxy to handle routing between Frontend and Backend.

📂 Project Structure

This project is organized as a monorepo for easy development and deployment.

CineSense/
├── backend/                 # Python FastAPI Application
│   ├── app.py               # API Endpoints & Logic
│   ├── sentiment_model.pkl  # Trained LinearSVC Model
│   ├── vectorizer.pkl       # Trained TF-IDF Vectorizer
│   ├── train.csv            # Raw Dataset (IMDB Scraped)
│   └── Dockerfile           # Backend Container Config
├── frontend/                # React Application
│   ├── src/                 # UI Components & Logic
│   ├── nginx.conf           # Nginx Proxy Config
│   └── Dockerfile           # Frontend Container Config
├── docker-compose.yml       # Orchestration for running both services
└── README.md                # Project Documentation


🐳 Setup & Installation (Docker)

You can run the entire application locally with a single command.

Prerequisites

Docker Desktop installed and running.

Git installed.

Steps

Clone the Repository

git clone [https://github.com/YOUR_USERNAME/CineSense.git](https://github.com/YOUR_USERNAME/CineSense.git)
cd CineSense


Run with Docker Compose
This command builds both the Frontend (React) and Backend (FastAPI) images and networks them together.

docker-compose up --build


Access the App

Open your browser and go to: http://localhost:3000

The Frontend will automatically communicate with the Backend via the internal Docker network.

🔮 Future Improvements

User Accounts: Save favorite recommendations and review history.

Advanced filtering: Filter recommendations by streaming service (Netflix, Prime, etc.).

Deep Learning: Experiment with LSTM or BERT models for potentially higher sentiment accuracy.

📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

<p align="center">
Made with ❤️ and 🍿 by [Your Name]
</p>
