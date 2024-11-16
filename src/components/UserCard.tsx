import { useFetch } from "../useFetch"

export const UserCard = () => {

   const {data, error, loading, original} = useFetch('https://randomuser.me/api')
   
  return (
    <>
    <h1>UserCard Component</h1>
    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corporis misnima
    <div>
      
    </div>
    </>
    
  )
}
