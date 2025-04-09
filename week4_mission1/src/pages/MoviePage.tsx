import { useState } from "react";
import { MovieResponse } from "../types/movie";
import MovieCard from "../components/MovieCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useParams } from "react-router-dom";
import useCustomFetch from "../hooks/useCustomFetch";

const API_KEY = import.meta.env.VITE_TMDB_KEY;

export default function MoviePage () {

   const [page, setPage] = useState(1);
   const { category } = useParams<{
      category: string;
   }>();
   
   const url = `https://api.themoviedb.org/3/movie/${category}?api_key=${API_KEY}&language=en-US&page=${page}`

   const {data:movies, isPending, isError} = useCustomFetch<MovieResponse[]>(url);


   if (isError) {
      return (
         <div>
            <span className='text-red-500 text-2xl'>에러가 발생했습니다.</span>
         </div>
      );
   }

   return (
      <>
         <div className='flex items-center justify-center gap-6 mt-5'>
            <button
               className={`px-6 py-3 rounded-lg shadow-md transition-all duration-200 
               ${page === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-[#dda5e3] hover:bg-[#b2dab1] text-white"}`}
               disabled={page === 1}
               onClick={() => setPage((prev) => prev - 1)}
            >{`<`}</button>
            
            <span>{page} 페이지</span>
            <button
               className='bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md
               hover:bg-[#b2dab1] transition-all duration-200 cursor-pointer'
               onClick={() => setPage((prev) : number => prev + 1)}
            >{`>`}</button>
         </div>

         {isPending && (
            <div className='flex items-center justify-center h-dvh'>
               <LoadingSpinner />
            </div>
         )}

         {!isPending && (
            <div className='p-10 grid gap-4 grid-cols-2 sm:grid-cols-3
            md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
               {movies?.results.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
               ))}
            </div>
         )}
      </>
   );
}