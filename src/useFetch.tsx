import { useEffect, useState } from "react"

export const useFetch = (url:string) => {

    const [data,setData] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    useEffect(()=>{ 
        const abortController = new AbortController()
        setLoading(true)
        fetch(url)
        .then((response)=>response.json())
        .then((data)=> setData(data.results))
        .catch((error)=> setError(error))
        .finally(()=> setLoading(false))

        return ()=> abortController.abort()
    },[url])
    console.log(data)
    return {data, error, loading}
}
