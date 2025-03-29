from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv
load_dotenv()
import pickle

movies = pickle.load(open('movie_list.pkl','rb'))
sim = pickle.load(open('similarity.pkl','rb'))

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
    app.run(debug=True)
