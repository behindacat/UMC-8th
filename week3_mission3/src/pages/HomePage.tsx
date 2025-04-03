import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";

const HomePage = () : Element => {
   return (
      <div>
         <Navbar />
         <Outlet />
      </div>
   );
};

export default HomePage;