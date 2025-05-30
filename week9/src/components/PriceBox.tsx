import { useDispatch } from "../hooks/useCustomRedux";
import { openModal } from "../slices/modalSlice";
import { useCartInfo } from "../hooks/useCartStore";

const PriceBox = () => {
   const { total } = useCartInfo(); // Zustand에서 cart 정보 가져오기
   const dispatch = useDispatch();  // Redux dispatch는 그대로 모달용

   const handleInitializeCart = () => {
      dispatch(openModal()); // 모달 열기 (Redux 상태)
   };

   return (
      <div className='p-12 flex justify-between'>
         <button
            onClick={handleInitializeCart}
            className='border p-4 rounded-md cursor-pointer'>
               전체 삭제
         </button>
         <div>총 가격: {total}원</div>
      </div>
   );
};

export default PriceBox;
