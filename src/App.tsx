import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import './App.css'
import { ListFunctions } from './components/ListFunctions'
import { UserCard } from './components/UserCard'
import { Home } from './components/Home'
import { TodoApp } from './components/TodoApp'
import { Weather } from './components/Weather'
import { Movies } from './components/Movies'
import {PiFilmReelDuotone, PiCloudMoon, PiWarningCircleDuotone, PiAppWindowThin, PiHouseSimpleThin, PiIdentificationBadgeThin, PiListBulletsThin, PiUserCheckDuotone,PiSortDescendingLight, PiArrowRightBold, PiArrowLeftBold } from 'react-icons/pi'
import { MdOutlineDeleteSweep } from "react-icons/md";
import {User} from './types'
import { ItemNav } from './components/ItemNav'


import { useState, useEffect, useRef } from 'react'




function App() {

	 const [data,setData] = useState<User[]>([])
	 const [error, setError] = useState(null)
	 const [loading, setLoading] = useState(true)
	 const original = useRef<User[]>([])

	 useEffect(() => {  
		const abortController = new AbortController();
		setLoading(true) 	  
		fetch('https://randomuser.me/api?results=50', { signal: abortController.signal }) // Pasar la señal al fetch		
		.then((response) => response.json())
		.then((data) => {
			setData(data.results)
			original.current= data.results
		})
		.catch((error) => {
			if (error.name !== 'AbortError') { // Ignorar el error si es causado por el abort
			  setError(error);
			}
		  })
		  .finally(() => setLoading(false));
	  
		return () => abortController.abort(); // Abortar la solicitud si el componente se desmonta
	  }, []);
	  //console.log({data,error,loading})

	  
	  
	
	const [orderedByCountry, setOrderedByCountry] = useState(false)
	
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
	}

	const inputFilter = (e) => {
		const valueInput =e.target.value.toLowerCase();
		if(valueInput){			
			const dataFilter = original.current.filter((user)=>{return user.name.first.toLowerCase().includes(valueInput) || user.name.last.toLowerCase().includes(valueInput)})
			setData(dataFilter)			
		}
		else{
			setData(original.current)
		}
			
		
	}
	return (
		<BrowserRouter>
		<header>  
			<div className='iconMe'>
				<PiUserCheckDuotone/>
			</div>      
			<nav className='nav'>
				<ul>
					<ItemNav title="HOME" path='/' reactIcon={PiHouseSimpleThin}/>
					<ItemNav title="TABLE LIST" path='/table-list' reactIcon={PiListBulletsThin}/>
					<ItemNav title="TODO APP" path='/todo-app' reactIcon={PiAppWindowThin}/>
					<ItemNav title="USER CARD" path='/user-card' reactIcon={PiIdentificationBadgeThin}/>
					<ItemNav title="WEATHER" path='/weather' reactIcon={PiCloudMoon}/>
					<ItemNav title="MOVIES" path='/movies' reactIcon={PiFilmReelDuotone}/>						
				</ul>
			</nav>  
		</header>
		<div className='content'>
			
			<div>
				<Routes>         
					<Route path='/' element={<Home/>}/>
					<Route 
						path='/table-list'
						element={
							<>
								<h1>List of users</h1>
								{loading && <div className='loader'><h2>Loading...</h2></div>}
								{sortedUsers.length == 0 && <h3 className="warnFetch"><PiWarningCircleDuotone /> Upsss, we have a problem fetching the data. Refresh de page please.</h3>}
								{sortedUsers.length > 0 &&
									<>
										<div className='headerT'>
											<div className='filterInput'>
												<span>Filter </span><input type='text' onChange={inputFilter} placeholder="Filter by name..."></input>
											</div>

											

											<div>																
												<button onClick={sortByCountry}>{orderedByCountry?<MdOutlineDeleteSweep />:<PiSortDescendingLight />}</button>
												<button onClick={()=>{}}>Restore Deleted Users</button>        
											</div>        
										</div>
										<div className="headerB">
											<span>Total users: </span><span className='badge'>{sortedUsers.length}</span> 
										</div>
										
										
										{error && <span>{}</span>}
										{!loading && <ListFunctions deletedUsers={deletedUsers} users={sortedUsers}/>}
									</>
								}
								
							</>											
							}
						/>
					<Route path='/todo-app' element={<TodoApp/>}/>
					<Route path='/user-card' element={<UserCard/>}/>
					<Route path='/weather' element={<Weather/>}/>
					<Route path='/movies' element={<Movies iconLeft={PiArrowLeftBold} iconRight={PiArrowRightBold}/>}/>
				</Routes>
			</div>
		
			
			
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
