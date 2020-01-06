import React from 'react'
import './App.scss'
import Minesweeper from './containers/minesweeper'

const App: React.FC = () => {
  return (
    <div className='app'>
      <div className='app__content'>
        <Minesweeper />
      </div>
      <div className='app__footer'>
        <a
          href='https://github.com/rickkky/emoji-minesweeper--react'
          rel='noopener noreferrer'
          target='_blank'
        >
          <span role='img' aria-label='nerd'>
            🤓
          </span>
          &nbsp; SOURCE CODE &nbsp;
          <span role='img' aria-label='nerd'>
            🤓
          </span>
        </a>
      </div>
    </div>
  )
}

export default App
