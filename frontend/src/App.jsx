import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import Header from './components/Header'
import { useEffect } from 'react'
import CardList from './components/CardList'

function App() {
  const [array,setArray]=useState([])
  useEffect(()=>{
     async function handleFetch() {
      const res=await fetch("http://localhost:5000/api/tickets")
      const ans=await res.json()
      setArray(ans)
    }
    handleFetch()
  },[])
 
    
    
  

  return(
    <div>
      <Header/>
      <CardList ticketArray={array}/>

    </div>
  )
}

export default App;
