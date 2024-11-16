import type { User } from "../types"

interface Props{
    users:User[]
    deletedUsers:(index:string)=>void
}
export const ListFunctions = ({deletedUsers,users}:Props) => { 
  return (
        
    <>
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
                
                {
                    
                        users.map((user,index)=>{
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
    </>
  )
}
