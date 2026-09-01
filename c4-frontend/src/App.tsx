import { useState } from 'react'
import { Column, type Counters } from './components/Column.tsx';
import type { CounterProps } from './components/Counter.tsx';
import './App.css'

function App() {
  const [player, setPlayer] = useState<'o' | 'x'>('o') ;
  const [columns, setColumns] = useState<Counters[]>([
    { 
      counters: [
        {player: null}, {player: null}, {player: null},
        {player: null}, {player: null}, {player: null},
      ]
    },
    { 
      counters: [
        {player: null}, {player: null}, {player: null},
        {player: null}, {player: null}, {player: null},
      ]
    },    
    { 
      counters: [
        {player: null}, {player: null}, {player: null},
        {player: null}, {player: null}, {player: null},
      ]
    },    
    { 
      counters: [
        {player: null}, {player: null}, {player: null},
        {player: null}, {player: null}, {player: null},
      ]
    },
    { 
      counters: [
        {player: null}, {player: null}, {player: null},
        {player: null}, {player: null}, {player: null},
      ]
    },
    { 
      counters: [
        {player: null}, {player: null}, {player: null},
        {player: null}, {player: null}, {player: null},
      ]
    },  
    { 
      counters: [
        {player: null}, {player: null}, {player: null},
        {player: null}, {player: null}, {player: null},
      ]
    },

  ]);

  /**
   * Adds the current player's counter to the specified column
   * @param columnIndex The index of the column that the user is dropping in
   * @returns void
   */
  async function handleDrop(columnIndex: number): Promise<void> {
    if (columnIndex < 0 || columnIndex >= columns.length) {
      return;
    }
    
    const number = columns[columnIndex].counters.findIndex(counter => counter.player === null);
    const newColumns = columns.map((col, idx) => 
      idx === columnIndex 
        ? { counters: col.counters.map((c, i) => i === number ? { ...c, player } : c) as [CounterProps, CounterProps, CounterProps, CounterProps, CounterProps, CounterProps] }
        : col
    );
    setColumns(newColumns);
    setPlayer(player === 'o' ? 'x' : 'o');

    try {
      const response = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ columnIndex, player }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }

      const responseBody = await response.text();
      console.log(responseBody);
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  }

  return (
    <>
      <h1>Welcome to Connect 4</h1>

      <div className="board">
        {
          columns.map((counters, index) => (
            <Column key={index} {...counters} onDrop={() => handleDrop(index)} />
          ))
        }
      </div>
    </>
  );
}

export default App
