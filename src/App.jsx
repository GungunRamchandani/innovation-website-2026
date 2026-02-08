import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import CollabTree from './components/CollabTree'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <header style={{display:'flex',alignItems:'center',gap:12,justifyContent:'center',flexDirection:'column'}}>
        <div style={{display:'flex',gap:12,alignItems:'center'}}>
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1 style={{margin:6}}>Human + AI — Collaboration Tree</h1>
      </header>

      <main style={{display:'flex',alignItems:'center',justifyContent:'center',padding:18}}>
        <CollabTree width={560} height={420} />
      </main>

      <footer style={{textAlign:'center',padding:18}}>
        <div className="card">
          <button onClick={() => setCount((c) => c + 1)}>
            count is {count}
          </button>
        </div>
      </footer>
    </>
  )
}

export default App