import { NavLink } from "react-router-dom";

const LINKS = [
   { to: '/', label: '홈' },
   { to: '/movies/popular', label: '인기 영화' },
   { to: '/movies/now_playing', label: '상영 중' },
   { to: '/movies/top_rated', label: '평점 높은' },
   { to: '/movies/upcoming', label: '개봉 예정'},
];

export const Navbar = () => {
   return (
      <div className='flex gap-3 p-4'>
         {LINKS.map(({ to, label }) => (
            <NavLink
               key={to}
               to={to}
               className={({ isActive }) =>
                  `text-black no-underline hover:text-gray-700 font-semibold transition-colors duration-300 ${
                     isActive ? 'text-[#b2dab1] font-bold' : 'text-black'
                  }`
               }
               style={{ textDecoration: "none" }}  // ✅ 브라우저 기본 스타일 제거
            >
               {label}
            </NavLink>
         ))}
      </div>
   );
};
