import { useEffect, useState } from "react";
import useThrottle from "../hooks/queries/useThrottle";

const ThrottlePage = () => {
   const [scollY, setScrollY] = useState<number>(0);

   const handleScroll = useThrottle(() => {
      setScrollY(window.scrollY);
   }, 2000);

   useEffect(() => {
      window.addEventListener("scroll", handleScroll);

      return () => window.removeEventListener("scroll", handleScroll);
   }, [handleScroll]);

   console.log("리렌더링");

   return (
      <div className="h-dvh flex flex-col items-center justify-center">
         <div>
            <h1>쓰로톨링이 무엇일까요?</h1>
            <p>ScollY : {scollY}px</p>
         </div>
      </div>
   );
};

export default ThrottlePage;