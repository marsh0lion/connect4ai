import { useState } from 'react'
import { Column, type ColumnProps } from './components/Column.tsx';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  const columns: ColumnProps[] = [
    { 
      counters: [
        {player: 'o'}, {player: 'x'}, {player: 'o'}, {player: 'x'},
        {player: 'o'}, {player: 'x'}, {player: 'o'}, 
      ]
    },
    { 
      counters: [
        {player: 'o'}, {player: 'x'}, {player: 'o'}, {player: 'x'},
        {player: 'o'}, {player: 'x'}, {player: 'o'}, 
      ]
    },    
    { 
      counters: [
        {player: 'o'}, {player: 'x'}, {player: 'o'}, {player: 'x'},
        {player: 'o'}, {player: 'x'}, {player: 'o'}, 
      ]
    },    
    { 
      counters: [
        {player: 'o'}, {player: 'x'}, {player: 'o'}, {player: 'x'},
        {player: 'o'}, {player: 'x'}, {player: 'o'}, 
      ]
    },
    { 
      counters: [
        {player: 'o'}, {player: 'x'}, {player: 'o'}, {player: 'x'},
        {player: 'o'}, {player: 'x'}, {player: 'o'}, 
      ]
    },
    { 
      counters: [
        {player: 'o'}, {player: 'x'}, {player: 'o'}, {player: 'x'},
        {player: 'o'}, {player: 'x'}, {}, 
      ]
    },  

  ]

  return (
    <>
      <h1>Welcome to Connect 4</h1>

      <div className="board">
        {
          columns.map((counters, index) => (
            <Column key={index} {...counters} />
          ))
        }
      </div>
    </>
  )
}

export default App
