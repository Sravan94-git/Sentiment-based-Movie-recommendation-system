# 🎬 CineSense — AI Powered Movie Matchmaker

> **"Tell us how a film made you feel, and we shall find your next masterpiece."**

CineSense is a full-stack AI movie recommendation system that analyzes the emotional sentiment of your movie review and recommends films matching your mood—going beyond traditional genre-based recommendations.

---

## 🚀 Features

### Core Functionality
- Sentiment-based movie recommendations
- Personalized mood-driven suggestions
- Fetches posters, ratings, and metadata via TMDB API
- Real-time request processing via FastAPI

### Machine Learning Features
- Custom sentiment classification trained on IMDB data
- SMOTE balancing for 5-class sentiment labels
- TF-IDF vectorization (max_features=5000)
- Model → Linear SVC (best performance after comparison)

### Technical Highlights
- Fully containerized using Docker + Docker Compose
- CI-ready monorepo structure
- Reverse proxy routing with Nginx
- High-performance async backend with Uvicorn

---

## 🧠 Machine Learning Pipeline

### **1️⃣ Data Collection**
- Source: IMDB movie reviews
- Method: Web scraping using BeautifulSoup
- Dataset stored in `backend/train.csv`

### **2️⃣ Preprocessing**
- Lowercasing, punctuation removal, regex cleanup
- Stopword removal using NLTK

### **3️⃣ Feature Engineering**
- TF-IDF Vectorization → 5000 max features
- SMOTE applied for balancing sentiment classes

### **4️⃣ Model Training**
| Metric | Selected Model |
|--------|---------------|
| **Algorithm** | Linear SVC |
| **Labels** | Negative → Positive (5-scale) |
| **Library** | Scikit-learn |
| **Reason** | High accuracy + fast inference |

---

## 🛠 Tech Stack

### **Frontend**
- React 18 (Vite)
- Tailwind CSS
- Framer Motion
- Lucide React (icons)

### **Backend**
- FastAPI
- Uvicorn
- Joblib
- TMDB API

### **Deployment**
- Docker + Docker Compose
- Nginx reverse proxy

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

1. Clone the Repository**
```bash
git clone https://github.com/YOUR_USERNAME/CineSense.git
cd CineSense
```
2. Run with Docker Compose

This command builds both the Frontend (React) and Backend (FastAPI) containers and links them together.

```bash
docker-compose up --build
```
3. Access the App

Open your browser and go to: http://localhost:3000

The Frontend will automatically communicate with the Backend via the internal Docker network.

### **🔮 Future Improvements

User Accounts: Save favorite recommendations and review history.

Advanced filtering: Filter recommendations by streaming service (Netflix, Prime, etc.).

Deep Learning: Experiment with LSTM or BERT models for potentially higher sentiment accuracy.

### **📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

