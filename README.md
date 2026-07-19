# 🎬 CineSense – Sentiment-Based Movie Recommendation System

> **"Tell us how a movie made you feel, and we'll recommend your next favorite masterpiece."**

**CineSense** is a full-stack AI-powered movie recommendation system that analyzes the sentiment of a user's movie review and recommends similar movies based on emotional context rather than traditional genre-based filtering. By combining Natural Language Processing, Machine Learning, and TMDB metadata, the platform delivers personalized and meaningful movie recommendations through a modern, responsive web application.

---

# 🧠 Machine Learning Pipeline

### 📊 Data Collection
- Source: IMDb Movie Reviews
- Method: Web scraping using **BeautifulSoup**
- Dataset stored in `backend/train.csv`

### 🧹 Data Preprocessing
- Text normalization
- Lowercasing
- Regex cleaning
- Punctuation removal
- Stopword removal using **NLTK**

### ⚙️ Feature Engineering
- TF-IDF Vectorization (5,000 max features)
- SMOTE for balancing sentiment classes

### 🤖 Model Training

| Metric | Selected Model |
|---------|---------------|
| **Algorithm** | Linear SVC |
| **Library** | Scikit-learn |
| **Sentiment Labels** | 5-Class Sentiment Classification |
| **Accuracy** | ~85% |
| **Reason** | High accuracy with fast prediction performance |

---

# 🌐 Full-Stack Application

### Frontend (Client)
- React 18 (Vite)
- Tailwind CSS
- Framer Motion
- Lucide React Icons
- Responsive UI/UX
- Dynamic movie recommendation dashboard

### Backend (Server)
- FastAPI
- Uvicorn
- Joblib
- RESTful APIs
- TMDB API Integration
- Sentiment Prediction Engine

### Recommendation Engine
- Sentiment-based movie recommendations
- Real-time prediction
- Dynamic TMDB movie information
- Movie posters, ratings, genres, and descriptions

---

# 🛠 Tech Stack

## Frontend
- React 18 (Vite)
- Tailwind CSS
- Framer Motion
- Axios
- Lucide React

## Backend
- FastAPI
- Python
- Uvicorn
- Joblib
- BeautifulSoup

## Machine Learning
- Scikit-learn
- Linear SVC
- TF-IDF Vectorizer
- NLTK
- SMOTE
- Pandas
- NumPy

## APIs
- TMDB API

## Deployment
- Docker
- Docker Compose
- Nginx

---

# 📂 Project Structure

```text
CineSense/
├── backend/
│   ├── app.py
│   ├── sentiment_model.pkl
│   ├── vectorizer.pkl
│   ├── train.csv
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── nginx.conf
│   └── Dockerfile
│
├── docker-compose.yml
├── README.md
└── LICENSE
```

---

# 🚀 Features

- 🎭 AI-powered sentiment analysis
- 🎬 Personalized movie recommendations
- 🌐 TMDB API integration
- ⚡ Real-time prediction
- 🎨 Modern responsive UI
- 🔍 Dynamic movie search
- 📱 Mobile-friendly interface
- 🐳 Dockerized deployment

---

# 🐳 Setup & Installation

You can run the complete application locally using Docker.

### 📌 Prerequisites

- Docker Desktop
- Git

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/CineSense.git
cd CineSense
```

### 2️⃣ Build & Run

```bash
docker-compose up --build
```

### 3️⃣ Open the Application

```
http://localhost:3000
```

The React frontend communicates automatically with the FastAPI backend through Docker's internal network.

---

# 🔮 Future Improvements

- User authentication & profiles
- Favorite movies & watchlists
- Review history
- Streaming platform filters
- Hybrid recommendation engine
- Deep Learning (LSTM/BERT)
- Personalized recommendation dashboard
- Cloud deployment using Microsoft Azure

---

# 📜 License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Author

**Sunkara Sravan Kumar Reddy**

AI Engineer | Full-Stack Developer | Machine Learning Enthusiast
