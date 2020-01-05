import React from 'react'
import './App.css'
import MineSweeper from './containers/MineSweeper'

const App: React.FC = () => {
  return (
    <div className='app'>
      <MineSweeper />
    </div>
  )
}

export default App
