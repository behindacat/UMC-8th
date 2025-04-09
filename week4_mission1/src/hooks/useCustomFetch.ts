import { useEffect, useState } from "react";
import axios from "axios";

interface ApiResponse<T>{
   data: T|null;
   isPending: boolean;
   isError: boolean;
}

type Language = "ko-KR"|"en-US";

function useCustomFetch<T>(url:string, language:Language): ApiResponse<T>{
   const [data, setData] = useState<T|null>(null);
   const [isPending, setIsPending] = useState(false);
   const [isError, setIsError] = useState(false);

   useEffect(() => {
      const fetchData = async () => {
         setIsPending(true);

         try {
            const { data } = await axios.get<T>(url, {
               params: {
                 api_key: import.meta.env.VITE_TMDB_KEY,
                 language,
               },
             });
            setData(data);
         } catch {
            setIsError(true);
         } finally {
            setIsPending(false);
         }
      };
      fetchData();
   }, [url, language]);

   return {data, isPending, isError};

}

export default useCustomFetch;