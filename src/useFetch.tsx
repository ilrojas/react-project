import { useEffect, useState, useRef} from "react"
import {APIResults,User} from './types'

export const useFetch = (url:string) => {

    const [data,setData] = useState<APIResults[]>([])
	 const [error, setError] = useState(null)
	 const [loading, setLoading] = useState(true)
	 const original = useRef<User[]>([])

     useEffect(() => {  
		const abortController = new AbortController();
		setLoading(true) 	  
		fetch(url, { signal: abortController.signal }) // Pasar la señal al fetch		
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
    return {data, error, loading, original}
}
