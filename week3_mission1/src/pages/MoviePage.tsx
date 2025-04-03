import { useEffect, useState } from "react";
import axios from 'axios';
import { Movie, MovieResponse } from "../types/movie";
import MovieCard from "../components/MovieCard";

const API_KEY = import.meta.env.VITE_TMDB_KEY;

export default function MoviePage () : Element {
   const [movies, setMovies] = useState<Movie[]>([]);

   useEffect(() : void => {
      const fetchMovies = async () : Promise<void> => {
         try {
            const { data } = await axios.get<MovieResponse>(
               `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
            );            
            setMovies(data.results);
         } catch (error) {
            console.error("영화 데이터를 불러오는 중 오류 발생:", error);
         }
         setMovies(DataTransfer.results);
      };

      fetchMovies();
   }, []);

   return (
      <div className='p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
         {movies.map((movie) : Element => (
            <MovieCard key={movie.id} movie={movie} />
         ))}
      </div>
   );
}