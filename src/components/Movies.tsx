
import React from 'react';
import { useState, useEffect } from "react"
import type { Movie } from "../types"
import type { Genres } from '../types';
import {PiWarningCircleDuotone} from 'react-icons/pi' 


/*
Para obtener los generos
${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=es-ES
https://api.themoviedb.org/3/genre/movie/list?api_key=9efe3c8f9e067e6b0338cf9a0a4ab8f7&language=es-ES


const READ_ACCES_TOKEN ='eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5ZWZlM2M4ZjllMDY3ZTZiMDMzOGNmOWEwYTRhYjhmNyIsIm5iZiI6MTczMTcxNjA0Ny4zMjQ3MTgsInN1YiI6IjY3MzdlMjUyNmEwMmEyNGQ3YjIxNDdhNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.eSbJSBfbnI8tvPzvlLlDRxVACTC_NUb98QOmXDaSNXw'
const API = 'https://api.themoviedb.org/3/movie/157336?api_key=9efe3c8f9e067e6b0338cf9a0a4ab8f7&append_to_response=videos,images'

Algunos endpoints comunes para listar películas son:

Películas populares: /movie/popular?api_key=${API_KEY}&language=es-ES&page=1
Películas más recientes: /movie/now_playing?api_key=${API_KEY}&language=es-ES&page=1
Películas mejor valoradas: /movie/top_rated?api_key=${API_KEY}&language=es-ES&page=1

Películas por género: /discover/movie
https://api.themoviedb.org/3/discover/movie?api_key=TU_API_KEY&language=es-ES&sort_by=popularity.desc&page=1
arámetros útiles:

api_key: Tu clave de API.
language: Idioma de los resultados.
page: Número de página (máximo 500 páginas disponibles).
sort_by: Ordenar los resultados (popularity.desc, release_date.desc, etc.).
release_date.gte y release_date.lte: Filtrar por fechas.

Para obtener los poster :
https://image.tmdb.org/t/p/{tamaño}/{poster_path}
Tamaños para pósters (poster_sizes):
w92: 92 píxeles de ancho (muy pequeño, útil para miniaturas).
w154: 154 píxeles de ancho (pequeño).
w185: 185 píxeles de ancho (mediano, recomendado para tarjetas).
w342: 342 píxeles de ancho (mediano-grande).
w500: 500 píxeles de ancho (grande, ideal para la mayoría de los diseños web).
w780: 780 píxeles de ancho (muy grande, útil para pantallas grandes).
original: Resolución original de la imagen (puede ser muy pesada).


Para obtener la configuracion de la api:
https://api.themoviedb.org/3/configuration?api_key=TU_API_KEY
*/
interface MoviesProps{
    iconLeft:React.ElementType;
    iconRight:React.ElementType;
}

export const Movies:React.FC<MoviesProps> = ({iconLeft:IconLeft,iconRight:IconRight}) => {

    const API_KEY = '9efe3c8f9e067e6b0338cf9a0a4ab8f7'
    const [page,setPage] = useState(1)
    const URL = 'https://api.themoviedb.org/3'
    const POSTER_SIZE = 'w185'
    const URL_POSTER = 'https://image.tmdb.org/t/p'
    
    
    const [genres, setGenres] = useState<Genres[]>([]);
    const [data,setData] = useState<Movie[]>([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    
    const handleNextPage = () => {
        setPage(prevState => prevState+1)
    }

    const handlePrevPage = () => {
        setPage(prevState => prevState-1)
    }

    useEffect(() => {  
        const abortController = new AbortController();
        const fetchData = async () => {
            setLoading(true);
            try {
                // Realizamos ambas solicitudes en paralelo
                const [moviesResponse] = await Promise.all([
                    fetch(`${URL}/discover/movie?api_key=${API_KEY}&language=es-ES&sort_by=popularity.desc&page=${page}`, { signal: abortController.signal })
                        .then((res) => res.json())
                ]);
    
                // Actualizamos el estado con los resultados
                setData(moviesResponse.results || []);
            } catch (error) {
                if (error.name !== 'AbortError') { // Ignorar errores causados por el aborto de la solicitud
                    setError(error.message);
                }
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    
        return () => abortController.abort(); // Abortar la solicitud si el componente se desmonta
    }, [page]);
    useEffect(() => {  
        const abortController = new AbortController();
        const fetchData = async () => {
            setLoading(true);
            try {
                // Realizamos ambas solicitudes en paralelo
                const [genresResponse] = await Promise.all([                    
                    fetch(`${URL}/genre/movie/list?api_key=${API_KEY}&language=es-ES`, { signal: abortController.signal })
                        .then((res) => res.json())
                ]);
    
                // Actualizamos el estado con los resultados
                setGenres(genresResponse.genres || []);
            } catch (error) {
                if (error.name !== 'AbortError') { // Ignorar errores causados por el aborto de la solicitud
                    setError(error.message);
                }
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    
        return () => abortController.abort(); // Abortar la solicitud si el componente se desmonta
    }, []);
    //console.log(data)
    //console.log(genres)

    function getRandomColor() {
        return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
      }
  return (
    <>
        
        {data.length == 0 && <h3 className="warnFetch"><PiWarningCircleDuotone /> Upsss, we have a problem fetching the data. Refresh de page please.</h3>}
        {loading && <div className='loader'><h2>Loading...</h2></div>}
		{error && <span>{}</span>}
        {data.length > 0 && 
            <>
            <div className='headerT headerMovies'>
                <h1>Movies</h1>
				<div className='filterInput'>                    
					<span>Filter </span><input type='text' onChange={()=>{}} placeholder="Filter by name..."></input>
				</div>       
			</div>
            <div className='gridMovies'>
                <div className='gendersContainer'>
                    
                 {genres && genres.map((gender) => {
                        return(
                            <span style={{color:getRandomColor()}} key={gender.id} className='badgeGender'>{gender.name}</span>
                        )
                    })
                        
                    }
                </div>
                <div className='moviesSection'>
                    <div className='headerT'>
                        <button onClick={handlePrevPage}><IconLeft/></button>
                        <button onClick={handleNextPage}><IconRight/></button>
                    </div>
                    <div className="headerB">
                        <span>Page: </span><span className='badge badgeMovie'>{page}</span> 
                    </div>
                    <section className="moviesContainer">
                        {data && data.map((movie) => {
                            return (
                                <div className='cardMovie' key={movie.id}>
                                <img src={`${URL_POSTER}/${POSTER_SIZE}/${movie.poster_path}`} alt={movie.title} key={movie.id} />
                                <h2 className='movieTitle'>{movie.original_title}</h2>
                                <span>{movie.release_date}</span>
                                </div>
                            )
                        })}
                    </section>
                </div>
            </div>
            
            
            </>
        }
        
        
    </>
  )
}
