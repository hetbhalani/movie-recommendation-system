import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Select from 'react-select'
import axios from 'axios'
import hetflixImage from "./assets/hetflix.png";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchOptions, setSearchOptions] = useState([])
  const [resultMovies, setResultMovies] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchMovies = async () => {
      const res = await axios.get('https://movie-recommendation-system-15mq.onrender.com/movies')
      const opt = res.data.movies.map(movie => ({
        value: movie,
        label: movie
      }))
      setSearchOptions(opt);
    }
    fetchMovies()
  }, [])

  const handleSearchChange = (selected) => {
    setSearchTerm(selected ? selected.value : '')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await axios.post('https://movie-recommendation-system-15mq.onrender.com/recommend',
        {
          'search_term': searchTerm
        }
      )
      setResultMovies(res.data.results)
      console.log(res.data.results)
    }
    catch (error) {
      console.log(error);
      setResultMovies([])
    }
    finally {
      setIsLoading(false)
    }
  }


  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderRadius: '0.5rem',
      border: state.isFocused ? '2px solid #dc2626' : '1px solid #374151',
      backgroundColor: '#292929',
      boxShadow: state.isFocused ? '0 0 0 1px #dc2626' : 'none',
      '&:hover': {
        border: '2px solid #dc2626'
      },
      minHeight: '48px'
    }),
    input: (provided) => ({
      ...provided,
      color: '#ffffff'
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#9ca3af'
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#292929' : state.isFocused ? '#292929' : '#292929',
      color: '#ffffff',
      '&:hover': {
        backgroundColor: state.isSelected ? '#dc2626' : '#e50d1c'
      }
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#292929',
      borderRadius: '0.5rem',
      border: '1px solidrgb(26, 26, 26)',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3)'
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#ffffff'
    })
  };

  return (
    <>
      <img src={hetflixImage} className='mt-6 md:mt-9 w-[200px] md:w-[300px] lg:w-auto place-self-center' />

      <h1 className='text-xl md:text-3xl text-center mt-4 md:mt-7 mb-6 md:mb-10 text-gray-300'>
        Discover your next favorite movie
      </h1>
      
      <form onSubmit={handleSubmit} className="flex justify-center items-center w-full max-w-2xl mx-auto gap-2 md:gap-3 px-4">
        <Select
          className="flex-1"
          options={searchOptions}
          onChange={handleSearchChange}
          placeholder="Enter a movie name"
          isSearchable
          styles={customStyles}
        />
        <button
          type="submit"
          className="cursor-pointer hover:bg-red-700 text-white text-sm md:text-base font-medium py-2 md:py-3 px-2 md:px-3 rounded-lg transition-colors duration-200"
          style={{ 'backgroundColor': '#e50d1c' }}
        >
          Recommend
        </button>
      </form>

      <div className="p-4 md:p-8 mt-3 md:mt-5 ">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
            {[...Array(10)].map((_, idx) => (
              <div key={idx} className="bg-[#292929] rounded-xl overflow-hidden shadow-lg w-full">
                <div className="w-full">
                  <Skeleton 
                    height={window.innerWidth < 768 ? 250 : 400}
                    containerClassName="block w-full"
                    baseColor="#202020" 
                    highlightColor="#444" 
                  />
                </div>
                <div className="p-3 md:p-4">
                  <Skeleton 
                    height={16}
                    containerClassName="block w-4/5" 
                    baseColor="#202020" 
                    highlightColor="#444" 
                  />
                </div>
              </div>
            ))}
          </div>
        ) : resultMovies.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
            {resultMovies.map((movie, idx) => (
              <div key={idx} className="bg-[#292929] rounded-xl overflow-hidden shadow-lg cursor-pointer transform transition-transform duration-300 hover:scale-103"
                onClick={() => window.open(
                  `https://www.imdb.com/title/${encodeURIComponent(movie.imdb_id)}`, "_blank",
                  "noopener,noreferrer")}
              >
                <img
                  className="w-full h-[250px] md:h-[400px] object-cover"
                  src={movie.poster_path}
                  alt="Card Image"
                />
                <div className="p-3 md:p-4">
                  <h2 className="font-bold text-sm md:text-lg text-white truncate">
                    {movie.title}
                  </h2>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-sm md:text-base text-gray-400">No Movies Found</p>
        )}
      </div>
    </>
  )
}

export default App
