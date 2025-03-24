import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from nltk.stem.porter import PorterStemmer
from sklearn.metrics.pairwise import cosine_similarity
import ast #this is module to convert str to list
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

credit = pd.read_csv('./datasets/tmdb_5000_credits.csv')
movie = pd.read_csv('./datasets/tmdb_5000_movies.csv')

movie = movie.merge(credit,on='title') #merge two datasets into one

movie = movie[['id', 'title', 'genres', 'keywords', 'overview', 'cast', 'crew']]

movie.dropna(inplace=True) #remove null valued collumn


def extract(d):
    ans = []
    for i in ast.literal_eval(d):
        ans.append(i['name'])
    return ans

movie['genres'] = movie['genres'].apply(extract)

movie['keywords'] = movie['keywords'].apply(extract)

def extract2(d):
    ans = []
    cnt = 0
    # we take top 3 character of the movie
    
    for i in ast.literal_eval(d):
        if cnt != 3:
            ans.append(i['name'])
        cnt+=1
    return ans

movie['cast'] = movie['cast'].apply(extract2)
movie['cast'] = movie['cast'].apply(lambda x:x[0:3])

def extract3(d):
    ans = []
    for i in ast.literal_eval(d):
        if i['job'] == 'Director':
            ans.append(i['name'])
    return ans

movie['crew'] = movie['crew'].apply(extract3)

# removing space from the name avoiding duplicate name
def RemoveSpace(d):
    ans = []
    for i in d:
        ans.append(i.replace(" ",""))
    return ans  

movie['cast'] = movie['cast'].apply(RemoveSpace)
movie['crew'] = movie['crew'].apply(RemoveSpace)
movie['genres'] = movie['genres'].apply(RemoveSpace)
movie['keywords'] = movie['keywords'].apply(RemoveSpace)

movie['overview'] = movie['overview'].apply(lambda x: x.split())

movie['tags'] = movie['overview'] + movie['genres'] + movie['keywords'] + movie['cast'] + movie['crew']

new = movie.drop(columns=['overview','genres','keywords','cast','crew'])

new['tags'] = new['tags'].apply(lambda x: " ".join(x))

new['tags'] = new['tags'].apply(lambda x: x.lower())

ps = PorterStemmer()

#this function remove same words like lover loving loved and convert to love
def stem(d):
    ans = []
    for i in d.split():
        ans.append(ps.stem(i))
        
    return ' '.join(ans)

new['tags'] = new['tags'].apply(stem)

cv = CountVectorizer(max_features=5000, stop_words='english')
vector = cv.fit_transform(new['tags']).toarray()
#vectorize the tags collumn and remove the stop words of english like 'and', 'is', 'the' etc

sim = cosine_similarity(vector)
#here i calculated the distance between every movies 
# here i used cos distance method to find nearest movies 

def recommend(movie):
    idx = new[new['title'] == movie].index[0]
    dist = sorted(list(enumerate(sim[idx])),reverse=True, key=lambda x:x[1])[1:11]
    ans = []
    for i in dist:
        print(new.iloc[i[0]].title)
        ans.append(new.iloc[i[0]].title)
        
    return new.iloc[i[0]].title
        
@app.route('/recommend', methods=['POST'])
def process():
    data = request.get_json()
    search = data.get('search_term')
    
    if not search:
        return jsonify({"error":"not exists"}), 400
    
    result = recommend(search)
    
    return jsonify({'result':result})

if __name__ == '__main__':
    app.run(debug=True)