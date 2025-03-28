import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Select from 'react-select'


function App() {
  const [searchTerm, setSearchTerm] = useState('')
  
  const handleSubmit = async (e) => {
    e.preventDefault()  
  }

  return (
    <>
     <h1>Movie Recommendation System</h1>
     <form onSubmit={handleSubmit}>
      <select>

      </select>
     </form>
    </>
  )
}

export default App
