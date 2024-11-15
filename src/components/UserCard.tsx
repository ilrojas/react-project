import { useFetch } from "../useFetch"

export const UserCard = () => {

   const {data, error, loading, original} = useFetch('https://randomuser.me/api')
   console.log(data[0].picture.large)
  return (
    <>
    <h1>UserCard Component</h1>
    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corporis misnima
    <div>
      {data[0] && <img src={data[0]?.picture.large}/>}
    </div>
    </>
    
  )
}
