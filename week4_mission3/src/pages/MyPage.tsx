import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";

const MyPage = () => {
   const [data, setData] = useState([])


   useEffect(() => {
      const getData = async () => {
         const response = await getMyInfo();
            console.log(response);

            setData(response.data);
         };
         
      getData();
   }, []);
   return <div>{data.data.name} {data.data.email}</div>;
}

export default MyPage;