import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import './App.css'

const COLUMNS = [
  { id: 'todo', label: 'To Do' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'in_review', label: 'In Review' },
  { id: 'done', label: 'Done' },
]

function App() {
  const [tasks, setTasks] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  return (
    <div className="app">
      <h1>TaskFlow</h1>
      <div className="board">
        {COLUMNS.map(column => (
          <div key={column.id} className="column">
            <h2>{column.label}</h2>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
