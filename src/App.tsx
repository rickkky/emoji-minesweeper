import React from 'react'
import './App.scss'
import Emoji from './components/emoji'
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
          <Emoji size={20}>{'🤓'}</Emoji>
          <span>&nbsp; SOURCE CODE &nbsp;</span>
          <Emoji size={20}>{'🤓'}</Emoji>
        </a>
      </div>
    </div>
  )
}

export default App
