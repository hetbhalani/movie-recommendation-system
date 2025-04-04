# 🎬 Movie Recommendation System using Vectorization Techniques 🚀

![Python](https://img.shields.io/badge/Python-3.8%2B-blue)
![Scikit-learn](https://img.shields.io/badge/Scikit--learn-1.0%2B-orange)
![Flask](https://img.shields.io/badge/Flask-2.0%2B-red)

A content-based movie recommendation system that leverages vectorization techniques to suggest similar movies based on their content.🎥

## 🌟 Features

- 🎥 Content-based recommendations using movie metadata
- 📦 Vectorization: Bag of Words (BoW) model
- 📐 Similarity measurement: Cosine Similarity
- 🌐 Simple web interface (Flask)
- 🔍 Find movies similar to your favorites

## 🛠️ Technologies Used

- 🐍 Python 3.8+
- 🔧 Scikit-learn (for vectorization and similarity calculations)
- 🐼 Pandas (for data manipulation)
- 🍵 Flask (for web interface)
- ⚛️ React (for frontend)

## 🖥️ Web Interface Preview

![preview img](https://github.com/hetbhalani/movie-recommendation-system/imgs/preview.png)

## 🧮 How It Works

1. **Data Processing** 📊  
   Combines movie features (genre, cast, director, keywords) into a single text representation

2. **Vectorization** 🔢  
   Uses CountVectorizer to create Bag of Words representation

3. **Similarity Calculation** 📐  
   Computes cosine similarity between movie vectors

4. **Recommendation** 💡  
   Returns movies with highest similarity scores

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- pip package manager

### Installation
```bash
# Clone the repository
git clone https://github.com/hetbhalani/movie-recommendation-system.git

# Install dependencies
pip install -r requirements.txt

# Run the application
python app.py

# Run the Frontend
cd frontend
npm install
npm run dev
```
## 🤝 Contributing
- Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.
