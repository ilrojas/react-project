import { useEffect, useState } from "react"


export const useSearch = (data) => {
    const [errorSearch, setErrorSearch] = useState(null)
    const [search, setSearch] = useState("")
    const[firstTime, setFirstTime] = useState(true)
    useEffect(()=>{

        if(search === "")
            {
                if(firstTime){
                    setFirstTime(false)
                    return
                }
                setErrorSearch('Empty search is not valid')
                return
            }
       else if(search.length<5)
            {
                setErrorSearch('Min lenght is 5')
                return
            }
        
        setErrorSearch(null)
    },[search])
  return {errorSearch,setSearch}
}
