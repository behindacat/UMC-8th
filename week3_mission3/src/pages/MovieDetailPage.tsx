import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_KEY;

export default function MovieDetailPage() {
   const { movieId } = useParams<{ movieId: string }>();
   const [movie, setMovie] = useState(null);
   const [credits, setCredits] = useState(null);
   const [isLoading, setIsLoading] = useState(true);
   const [isError, setIsError] = useState(false);

   useEffect(() => {
      const fetchMovieDetails = async () => {
         try {
            const { data } = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=ko-KR`);
            setMovie(data);

            const { data: creditsData } = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}&language=ko-KR`);
            setCredits(creditsData);
         } catch (error) {
            setIsError(true);
         } finally {
            setIsLoading(false);
         }
      };
      fetchMovieDetails();
   }, [movieId]);

   if (isLoading) return <div className="text-white text-center text-2xl">로딩 중...</div>;
   if (isError) return <div className="text-red-500 text-center text-2xl">에러가 발생했습니다.</div>;

   return (
      <div className="relative w-full h-screen text-white">
         {/* 배경 이미지 */}
         <div className="absolute inset-0 w-full h-full bg-black">
            <img
               src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
               alt={movie.title}
               className="w-full h-full object-cover opacity-50"
            />
         </div>

         {/* 그라데이션 */}
         <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black"></div>

         {/* 상세 정보 */}
         <div className="relative flex items-center justify-center h-full px-10">
            <div className="max-w-5xl w-full bg-black/70 backdrop-blur-lg p-8 rounded-xl shadow-lg">
               <h1 className="text-4xl font-bold">{movie.title}</h1>
               <p className="text-gray-300 mt-4">{movie.overview}</p>

               <div className="mt-6 flex gap-4 text-gray-400">
                  <span>⭐ {movie.vote_average.toFixed(1)}</span>
                  <span>⏳ {movie.runtime}분</span>
                  <span>📅 {movie.release_date}</span>
               </div>

               {/* 감독 및 출연진 */}
               <div className="mt-6">
                  <h3 className="text-xl font-semibold">출연진</h3>
                  <div className="flex gap-4 overflow-x-auto mt-3">
                     {credits?.cast?.slice(0, 9).map((actor) => (
                        <div key={actor.id} className="w-24 text-center">
                           <img
                              src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                              alt={actor.name}
                              className="w-24 h-24 object-cover rounded-full border-1 border-gray-500"
                           />
                           <p className="text-sm mt-2">{actor.name}</p>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
