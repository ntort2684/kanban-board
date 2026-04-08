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
  const [showForm, setShowForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newStatus, setNewStatus] = useState('todo')

  useEffect(() => {
    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        let currentUser
        if (session?.user) {
          currentUser = session.user
        } else {
          const { data, error } = await supabase.auth.signInAnonymously()
          if (error) throw error
          currentUser = data.user
        }
        //console.log('Logged in as:', currentUser.id)
        setUser(currentUser)

        const { data: tasks, error: fetchError } = await supabase
          .from('tasks')
          .select('*')
          .order('created_at', { ascending: true })

        if (fetchError) throw fetchError
        setTasks(tasks || [])
      } catch (err) {
        console.error('Init error:', err)
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [])

  const createTask = async () => {
    if (!newTitle.trim()) return

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        title: newTitle.trim(),
        status: newStatus,
        user_id: user.id,
      })
      .select()

    if (error) {
      console.error('Create error:', error)
      return
    }

    setTasks([...tasks, ...data])
    setNewTitle('')
    setNewStatus('todo')
    setShowForm(false)
  }

  return (
    <div className="app">
      <div className='app-header'>
        <h1>TaskFlow</h1>
        <button className="new-task-btn" onClick={() => setShowForm(true)}>
          + New Task
        </button>
      </div>

      {showForm && (
        <div className="form-overlay" onClick={() => setShowForm(false)}>
          <div className="form-modal" onClick={(e) => e.stopPropagation()}>
            <h2>New Task</h2>
            <input
              type="text"
              placeholder="Task title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
              {COLUMNS.map(col => (
                <option key={col.id} value={col.id}>{col.label}</option>
              ))}
            </select>
            <div className="form-buttons">
              <button onClick={() => setShowForm(false)}>Cancel</button>
              <button onClick={createTask}>Create</button>
            </div>
          </div>
        </div>
      )}

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
