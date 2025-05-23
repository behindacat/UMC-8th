import { useEffect, useRef, useState } from "react";
import ThrottlePage from "../../pages/ThrottlePage";

function useThrottle<T>(value: T, delay = 500):T {
   const [throttledValue, setThrottleValue] = useState<T>(value);
   const lastExecuted = useRef<number>(Date.now());

   useEffect(() => {
      if (Date.now() >= lastExecuted.current + delay) {
         lastExecuted.current = Date.now();
         setThrottleValue(value);
      } else {
         const timerId = setTimeout(() => {
            lastExecuted.current = Date.now();
            setThrottleValue(value);
         }, delay);

         return() => clearTimeout(timerId);
      }
   }, [value, delay]);

   return throttledValue
}

export default useThrottle;