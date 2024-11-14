import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import './App.css'
import { ListFunctions } from './components/ListFunctions'
import { UserCard } from './components/UserCard'
import { Home } from './components/Home'


import { useState, useEffect } from 'react'




function App() {
	

	 /* const [data,setData] = useState(null)
	 const [error, setError] = useState(null)
	 const [loading, setLoading] = useState(false)
	 const [orderedByCountry, setOrderedByCountry] = useState(false)

	
	 useEffect(() => {  
		const abortController = new AbortController(); 
	  
		fetch('https://randomuser.me/api?results=50', { signal: abortController.signal }) // Pasar la señal al fetch
		  .then((response) => response.json())
		  .then((data) => setData(data.results))
		  .catch((error) => {
			if (error.name !== 'AbortError') { // Ignorar el error si es causado por el abort
			  setError(error);
			}
		  })
		  .finally(() => setLoading(false));
	  
		return () => abortController.abort(); // Abortar la solicitud si el componente se desmonta
	  }, []);
	  
	
	const sortByCountry=()=>{
		setOrderedByCountry(prevState=> !prevState)
	}

	const sortedUsers = orderedByCountry
	?[...data].sort((a,b)=>{
		return a.location.country.localeCompare(b.location.country)
	})
	: data 

	const deletedUsers = (index:string)=>{
		const filters = data.filter((user)=>user.login.uuid !== index)
		setData(filters)
	} */
  return (
    <BrowserRouter>
      <header>
        <h1>Learning React</h1>
        <nav className='nav'>
			<ul>
				<li>
					<Link to='/'>Home</Link>
				</li>
				<li>
					<Link to='/list-functions'>List Functions</Link>
				</li>
				<li>
					<Link to='/todo-app'>Todo App</Link>
				</li>
				<li>
					<Link to='/user-card'>User card</Link>
				</li>
			</ul>
		</nav>  
      </header>
      <div className='content'>
        <Routes>         
          <Route path='/' element={<Home/>}/>
          <Route 
			path='/list-functions'
			element={
				<>
					<h1>List of users</h1>
					{/* <header className='headerT'>
						<div className='filter'>
							<span>Filter </span><input type='text'></input>
						</div>
						<div>																
							<button onClick={sortByCountry}>{orderedByCountry?'Unsort':'Sort'}</button>
							<button onClick={()=>{}}>Restore Deleted Users</button>          
						</div>        
					</header>
					<div className="headerB">
						 <span>Total users: </span><span className='badge'>{data.length}</span> 
					</div>
					{loading && <div className='loader'><h2>Loading...</h2></div>}
					{error && <span>{}</span>}
					{!loading && <ListFunctions deletedUsers={deletedUsers} users={data}/>} */}
				</>											
				}
			/>
          <Route path='/todo-app'/>
          <Route path='/user-card' element={<UserCard/>}/>
        </Routes>
        
      </div>
						
      <footer>
        <p className="read-the-docs">
          All content is only of learning purpose
        </p>
      </footer>
      
    </BrowserRouter>
  )
}

export default App
