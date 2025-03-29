import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Select from 'react-select'
import axios from 'axios'
import hetflixImage from "./assets/hetflix.png"; 


function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchOptions, setSearchOptions] = useState([])
  const [resultMovies, setResultMovies] = useState([])

  useEffect(()=>{
    const fetchMovies = async ()=>{
      const res = await axios.get('http://127.0.0.1:5000/movies')
      const opt = res.data.movies.map(movie =>({
        value: movie,
        label: movie
      }))
      setSearchOptions(opt);
    }
    fetchMovies()
  },[])

  const handleSearchChange = (selected)=>{
    setSearchTerm(selected ? selected.value : '')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const res = await axios.post('http://127.0.0.1:5000/recommend',
        {
          'search_term': searchTerm
        }
      )
      setResultMovies(res.data.results)

    }
    catch (error) {
      console.log(error);
      setResultMovies([])
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
    
      <img src={hetflixImage} className='mt-9 place-self-center'/>
      
     <h1 className='text-3xl text-center mt-7 mb-10 text-gray-300'>Discover your next favorite movie</h1>
     <form onSubmit={handleSubmit} className="flex justify-center  items-center w-full max-w-2xl mx-auto gap-3">
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
        className="cursor-pointer hover:bg-red-700 text-white font-medium py-3 px-3 rounded transition-colors duration-200"
        style={{'backgroundColor':'#e50d1c'}}
      >
        
        Recommend
      </button>
      </form>
     <div>
      <h2>Recommended movies</h2>
     </div>
    </>
  )
}

export default App
