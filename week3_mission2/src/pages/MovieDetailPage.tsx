import { useParams } from "react-router-dom"

const MovieDetailPage = () : Element => {
   const params = useParams();

   console.log(params);
   return <div>MovieDetailPage{params.movieid}</div>;
};

export default MovieDetailPage;