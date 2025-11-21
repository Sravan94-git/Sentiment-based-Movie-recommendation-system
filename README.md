# 🎬 Sentiment-based-Movie-recommendation-system

> **"Tell us how a film made you feel, and we shall find your next masterpiece."**

Sentiment-based-Movie-recommendation-system is a full-stack AI movie recommendation system that analyzes the emotional sentiment of your movie review and recommends films matching your mood—going beyond traditional genre-based recommendations.


## 🧠 Machine Learning Pipeline

### **1.Data Collection**
- Source: IMDB movie reviews
- Method: Web scraping using BeautifulSoup
- Dataset stored in `backend/train.csv`

### **2.Preprocessing**
- Lowercasing, punctuation removal, regex cleanup
- Stopword removal using NLTK

### **3.Feature Engineering**
- TF-IDF Vectorization → 5000 max features
- SMOTE applied for balancing sentiment classes

### **4.Model Training**
| Metric | Selected Model |
|--------|---------------|
| **Algorithm** | Linear SVC |
| **Labels** | Negative → Positive (5-scale) |
| **Library** | Scikit-learn |
| **Reason** | High accuracy + fast inference |

---

## 🛠 Tech Stack

### **Frontend (Client)**
- React 18 (Vite) - Fast, modern UI library.
- Tailwind CSS - For a bespoke, responsive "Cinematic" design.
- Framer Motion - Smooth, high-performance animations.
- Lucide React (icons) - Beautiful, consistent iconography.

### **Backend (Server)**
- FastAPI - High-performance, async Python framework.
- Uvicorn - Lightning-fast ASGI server.
- Joblib - For loading the serialized ML models (.pkl files) efficiently.
- TMDB API - Used to fetch rich movie metadata (posters, ratings, backdrops) for recommendations.

### **Deployment**
- Docker + Docker Compose - Containerization for consistent environments.
- Nginx - Production-grade reverse proxy to handle routing between Frontend and Backend.

---

## 📂 Project Structure

```
CineSense/
├── backend/
│ ├── app.py # API Endpoints
│ ├── sentiment_model.pkl # Trained ML Model
│ ├── vectorizer.pkl # TF-IDF Vectorizer
│ ├── train.csv # Dataset
│ └── Dockerfile
├── frontend/
│ ├── src/ # UI Code
│ ├── nginx.conf
│ └── Dockerfile
├── docker-compose.yml
└── README.md
```

## 🐳 Setup & Installation (Docker)

You can run the entire application locally with a single command.

### **📌 Prerequisites**
- Docker Desktop installed and running
- Git installed

### 1. **Clone the Repository**
```bash
git clone https://github.com/YOUR_USERNAME/CineSense.git
cd CineSense
```
### 2. **Run with Docker Compose**

This command builds both the Frontend (React) and Backend (FastAPI) containers and links them together.

```bash
docker-compose up --build
```
### 3. **Access the App**

Open your browser and go to: http://localhost:3000

The Frontend will automatically communicate with the Backend via the internal Docker network.

### **🔮 Future Improvements**

User Accounts: Save favorite recommendations and review history.

Advanced filtering: Filter recommendations by streaming service (Netflix, Prime, etc.).

Deep Learning: Experiment with LSTM or BERT models for potentially higher sentiment accuracy.

### **📜 License**

This project is licensed under the MIT License - see the LICENSE file for details.

