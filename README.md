# CineSense – Sentiment-Based Movie Recommendation System

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

# Full-Stack Application

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
- 🌐 TMDB API integration
- ⚡ Real-time prediction
- 📱 Mobile-friendly interface
- 🐳 Dockerized deployment

---

# ⚙️ Setup & Installation

CineSense can be run in two ways:

- 🐳 **Option 1: Using Docker** — Recommended
- 💻 **Option 2: Manual Setup** — Run backend and frontend separately

---

## 📌 Prerequisites

### 🐳 For Docker Setup

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Git

### 💻 For Manual Setup

- Git
- Python 3.10+
- Node.js 18+
- npm
- TMDB API Key

---

# 🐳 Option 1: Run Using Docker


### 1️⃣ Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/CineSense.git
cd CineSense
```

### 2️⃣ Build and Start the Application

```bash
docker-compose up --build
```

This starts both:

- **Frontend** — React + Vite
- **Backend** — FastAPI

### 3️⃣ Open the Application

Once the containers are running, open:

```text
http://localhost:3000
```

### 🛑 Stop the Application

```bash
docker-compose down
```

---

# 💻 Option 2: Manual Setup

If you don't want to use Docker, you can run the backend and frontend separately.

## 🔹 Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/CineSense.git
cd CineSense
```

---

## 🔹 Step 2: Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

### Create a Python Virtual Environment

**Windows:**

```bash
python -m venv .venv
```

### Activate the Virtual Environment

```bash
.venv\Scripts\activate
```
```powershell
.venv\Scripts\Activate.ps1
```
```bash
source .venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Configure Environment Variables

Create a `.env` file inside the `backend` directory:

```env
TMDB_API_KEY=your_tmdb_api_key
```

### Start the Backend

```bash
python app.py
```

The FastAPI backend will run on:

```text
http://localhost:8000
```

---

## 🔹 Step 3: Frontend Setup

Open a **new terminal** and navigate to the frontend directory:

```bash
cd CineSense/frontend
```

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```
---

# 📜 License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Author

**Sunkara Sravan Kumar Reddy**

Full-Stack Developer | AI Engineer 
