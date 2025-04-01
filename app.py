from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv
load_dotenv()
import pickle
import gdown
import sys

movies = None
sim = None

def load_models():
    global movies, sim
    try:
        movie_file = os.getenv('MOVIE_LINK')
        sim_file = os.getenv('SIM_LINK')
        
        if not movie_file or not sim_file:
            raise ValueError("links missing")

        print("Downloading movie file...")
        if not gdown.download(movie_file, 'movie_list.pkl', quiet=False, fuzzy=True):
            raise Exception("Failed movie file")
            
        print("Downloading similarity file...")
        if not gdown.download(sim_file, 'similarity.pkl', quiet=False, fuzzy=True):
            raise Exception("Failed similarity file")

        with open('movie_list.pkl', 'rb') as f:
            movies = pickle.load(f)
            
        with open('similarity.pkl', 'rb') as f:
            sim = pickle.load(f)
            
        print("Models loaded successfully")
        return True

    except Exception as e:
        print(f"Error: {str(e)}")
        sys.exit(1)
    
load_models()

app = Flask(__name__)
CORS(app)

def generate_posters(movie_id):
    try:
        url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={os.getenv('API_KEY')}&language=en-US"
        data = requests.get(url).json()
        
        if data['poster_path'] == None:
            return None
        
        poster = data['poster_path']
        final_path = f"https://image.tmdb.org/t/p/w500{poster}"
        
        return final_path
        
    except Exception as e:
        print("Error:", e)
        return None

def recommend(movie):
    idx = movies[movies['title'] == movie].index[0]
    dist = sorted(list(enumerate(sim[idx])),reverse=True, key=lambda x:x[1])[1:11]
    ans = []
    for i in dist:
        # print(movies.iloc[i[0]].title)
        # ans.append(movies.iloc[i[0]].title)
        movie_data = {
            'title': movies.iloc[i[0]].title,
            'id': int(movies.iloc[i[0]].id),
            'poster_path': generate_posters(int(movies.iloc[i[0]].id)),
        }
        ans.append(movie_data)
    return ans
        
@app.route('/recommend', methods=['POST'])
def process():
    data = request.get_json()
    search = data.get('search_term')
    
    if not search:
        return jsonify({"error":"not exists"}), 400
    
    results = recommend(search)
    
    return jsonify({'results':results}), 200

#this is route for get moviest for suggestions in search bar
@app.route('/movies', methods=['GET'])
def getMovies():
    movies_list = movies['title'].tolist()
    return jsonify({'movies': movies_list}), 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))  
    app.run(debug=True, host='0.0.0.0', port=port)
