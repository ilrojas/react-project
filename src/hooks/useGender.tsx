
import { useEffect, useState} from 'react';

export function useGender() {
    
     const [error, setError] = useState(null) 
    
    const API_KEY = '9efe3c8f9e067e6b0338cf9a0a4ab8f7'    
    const URL = 'https://api.themoviedb.org/3'
    const [genRes, setGenRes] = useState([])

    useEffect(() => {  
        const abortController = new AbortController();
            
        fetch(`${URL}/genre/movie/list?api_key=${API_KEY}&language=es-ES`, { signal: abortController.signal })
        .then((res) => res.json())
        .then((data)=>{setGenRes(data.genres)})
        .catch ((error)=>setError(error))      
        return () => abortController.abort(); // Abortar la solicitud si el componente se desmonta
    }, []);

    
    /*console.log(mappedGenders)*/
  return {genRes}
}
/* https://api.themoviedb.org/3/genre/movie/list?api_key=9efe3c8f9e067e6b0338cf9a0a4ab8f7&language=es-ES */