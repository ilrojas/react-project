import {useState, useEffect, useRef } from 'react'

import type { User } from "../types"
import '../App.css'

import {  PiWarningCircleDuotone, PiSortDescendingLight } from 'react-icons/pi'
import { MdOutlineDeleteSweep } from "react-icons/md";






export const ListFunctions = () => { 

const [orderedByCountry, setOrderedByCountry] = useState(false)
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
			if(data.results.length<=0){
				throw new Error(`Can not find data. Please try again.`)
				setError(`Can not find data. Please try again.`)
			}
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
			
			console.log(dataFilter)	
			console.log(original.current)		
		}
		else{
			setData(original.current)
		}
			
		
	}
  return (
    <>
								<h1>List of users</h1>
								{/* {loading && <div className='loader'><h2>Loading...</h2></div>} */}
							
										{/* {!loading && <ListFunctions deletedUsers={deletedUsers} users={sortedUsers}/>} */}
								{/* {sortedUsers.length == 0 && <><h3 className="warnFetch"><PiWarningCircleDuotone /> Upsss, we have a problem fetching the data. Refresh de page please.</h3><button onClick={() => {
													setError(null)
													inputFilter('')
												}}>Retry</button></>} */}
								
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
										
										<div className="tableContent">
        {loading && 
                <div className='loader'>
					<section>
						<span className="item"></span>
						<span className="item"></span>
						<span className="item"></span>
						<span className="item"></span>
						<span className="item"></span>
					</section>
				</div>
        }

        {sortedUsers.length == 0 && 
            <>
                <h3 className="warnFetch"><PiWarningCircleDuotone />   
                    Upsss, we have a problem fetching the data. Refresh de page please.
                </h3>   
            </>
         }
        <table>
            <thead>
                <tr>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Country</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
            
                
                    
                    {sortedUsers.length>0 && 
                        sortedUsers.map((user,index)=>{
                            return (
                                <tr key={user.login.uuid}>
                                    <td>{index+1}</td>
                                    <td>
                                        <img src={user.picture.thumbnail}></img>
                                    </td>
                                    <td >{user.name.title}</td>
                                    <td>{user.name.first+' '+user.name.last}</td>  
                                    <td>{user.email}</td>
                                    <td>{user.location.country}</td>
                                    <td>
                                        <button onClick={()=>{
                                            deletedUsers(user.login.uuid)
                                        }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width={25} height={25} viewBox="0 0 50 50"><g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><path stroke="currentColor" d="M33.333 14.583v-6.25A2.083 2.083 0 0 0 31.25 6.25h-12.5a2.083 2.083 0 0 0-2.083 2.083v6.25"></path><path stroke="white" d="M8.333 14.583h33.334M37.5 41.667V14.583h-25v27.084a2.083 2.083 0 0 0 2.083 2.083h20.834a2.083 2.083 0 0 0 2.083-2.083"></path></g></svg>
                                        </button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                        
                    
                    
                
            </tbody>
        </table>
    </div>
									</>
								
								
							</>	
    
  )
}
