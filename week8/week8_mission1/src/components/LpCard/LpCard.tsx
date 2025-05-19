import { Lp } from "../../types/Lp";
import React from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from 'date-fns';

interface LpCardProps {
   lp: Lp;
}

const LpCard = ({ lp }: LpCardProps) => {
   const uploadedAgo = formatDistanceToNow(new Date(lp.createdAt), { addSuffix: true });

   return (
      <Link to={`/lp/${lp.id}`} className="block">
         <div className="relative overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 hover:scale-105 hover:bg-opacity-50 hover:bg-black">
            {/* 카드 이미지 */}
            <img
               src={lp.thumbnail}
               alt={lp.title}
               className="object-cover w-full h-65 transition-all duration-300"
            />
            {/* 카드 내용 */}
            <div className="absolute inset-0 bottom-0 left-0 right-0 bg-black bg-opacity-75 p-4 opacity-0 hover:opacity-80 transition-opacity duration-300 z-10 flex flex-col justify-end">
               <h3 className="text-white text-lg font-semibold">{lp.title}</h3>
               <div className="flex justify-between items-center mt-2">
                  <p className="text-gray-300 text-xs">{uploadedAgo}</p>
                  <p className="text-yellow-400 text-sm">
                     👍 {Array.isArray(lp.likes) ? lp.likes.length : lp.likes} Likes
                  </p>
               </div>
            </div>
         </div>
      </Link>
   );
};

export default LpCard;
