import React from 'react'
import './App.css'
import Minesweeper from './containers/Minesweeper'

const App: React.FC = () => {
  return (
    <div className='app'>
      <Minesweeper />
    </div>
  )
}

export default App
