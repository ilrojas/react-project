import { useEffect, useState } from "react"


export const useSearch = () => {
    const [errorSearch, setErrorSearch] = useState(null)
    const [search, setSearch] = useState('')

    useEffect(()=>{
        if(search === "")
            {
                setErrorSearch('Empty search is not valid')
                return
            }
       if(search.length<5)
            {
                setErrorSearch('Min lenght is 5')
                return
            }
        
        setErrorSearch(null)
    },[search])
  return {errorSearch,setSearch,search}
}
