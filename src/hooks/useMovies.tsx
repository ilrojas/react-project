
import { useEffect, useState } from "react";
import type { Movie } from "../types"

export function useMovies ({page}) {
    
    const [data,setData] = useState<Movie[]>([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const API_KEY = '9efe3c8f9e067e6b0338cf9a0a4ab8f7'
    
    const URL = 'https://api.themoviedb.org/3'
    
    useEffect(() => {  
        const abortController = new AbortController();
        
        setLoading(true);
            
        fetch(`${URL}/discover/movie?api_key=${API_KEY}&language=es-ES&sort_by=popularity.desc&page=${page}`, { signal: abortController.signal })
        .then((res) => res.json())
        .then((data)=>{setData(data.results)})
        .catch ((error)=>setError(error))
        .finally(()=>{setLoading(false)})       
        return () => abortController.abort(); // Abortar la solicitud si el componente se desmonta
    }, [page]);
    const moviesMapped = data.map(movie =>(
        {
            id:movie.id,
            poster:movie.poster_path,
            title:movie.original_title,
            release_date:movie.release_date,
            genre_ids:movie.genre_ids
        }
    ))

  return {data:moviesMapped,loading, error}
}
