
import React, { useRef, useState} from 'react';
import type { Movie } from "../types"
import {PiWarningCircleDuotone} from 'react-icons/pi' 
import { useMovies } from '../hooks/useMovies';
import { useGender } from '../hooks/useGender';

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

/*
otra API : http://www.omdbapi.com/?apikey=[yourkey]& */
interface MoviesProps{
    iconLeft:React.ElementType;
    iconRight:React.ElementType;
}

export const Movies:React.FC<MoviesProps> = ({iconLeft:IconLeft,iconRight:IconRight}) => {

    
    
    const POSTER_SIZE = 'w185'
    const URL_POSTER = 'https://image.tmdb.org/t/p'
    const [page, setPage] = useState(1);
    /* const [genres, setGenres] = useState<Genres[]>([]); */
    //const genres = useRef([])
   // const [data,setData] = useState<Movie[]>([])
    //const [error, setError] = useState(null)
    //const [loading, setLoading] = useState(true)
    
    const handleNextPage = () => {
        setPage(prev=>prev+1)
    }

    const handlePrevPage = () => {
        setPage(prev=>prev-1)
    }

    function handleSubmit(event){
        event.preventDefault()
        const data = Object.fromEntries(new window.FormData(event.target))
        console.log(data)
    }

    /* function getRandomColor() {
        return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
      } */

      const  {data,loading, error}= useMovies(page)
      const {genRes} = useGender()
      console.log(genRes)
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
                <form onSubmit={handleSubmit}>
                    <input name='inputName' type='text' onChange={()=>{}} placeholder="Filter by name..."></input>
                    <button>Buscar</button>
                </form>
                {/* <div className='inputForm'>
                    <input id="filter_by_name" name="filter_by_name"  type="text" onChange={()=>{}}   placeholder=" "></input>
                    <label className="form_label" htmlFor="filter_by_name">Filter by name</label>
                </div> */}    
			</div>
            <div className='gridMovies'>
                <div className='gendersContainer'>
                    
                 {genRes && genRes.map((gender) => {
                        
                        return(
                            <span  key={gender.id} className='badgeGender'>{gender.name}</span>
                        )
                    })
                        
                    }
                </div>
                <div className='moviesSection'>
                    <div className='headerT'>
                        <button onClick={handlePrevPage} disabled={page === 1 ? true : false}><IconLeft/></button>
                        <button onClick={handleNextPage}><IconRight/></button>
                    </div>
                    <div className="headerB">
                        <span>Page: </span><span className='badge badgeMovie'>{page}</span> 
                    </div>
                    <section className="moviesContainer">
                        {data && data.map((movie) => {
                            return (<>
                                <div className='cardMovie' key={movie.id}>
                                    <img src={`${URL_POSTER}/${POSTER_SIZE}/${movie.poster}`} alt={movie.title} key={movie.id} />
                                    <h2 className='movieTitle'>{movie.title}</h2>
                                    <span className='movieYear'>{movie.release_date.split('-')[0]}</span>
                                    {/* {genRes && genRes.length>0 && (
                                        <div className='genderContainer'>
                                            {
                                                movie.genre_ids.map((idValue) => {
                                                    // Buscar el género en genRes usando el idValue
                                                    const genre = genRes.find((e) => e.id === idValue);
                                                    // Si se encuentra el género, lo mostramos
                                                    return genre ? (
                                                        <span className='badgeGenre' key={genre.id} >{genre.name}</span>
                                                    ) : null;
                                                })
                                                
                                            }
                                        </div>
                                    )} */}
                                </div>
                                
                                </>
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
