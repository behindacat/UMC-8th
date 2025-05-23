import { useDispatch, useSelector } from "../hooks/useCustomRedux";
import { clearCart } from "../slices/cartSlice";
import { closeModal } from "../slices/modalSlice";

const Modal = () => {
   const { isOpen } = useSelector((state) => state.modal);
   const dispatch = useDispatch();

   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 bg-opacity-20 backdrop-blur-sm flex items-center justify-center">
         <div className="bg-white p-8 rounded shadow-md text-center">
            <p className="mb-4">정말 삭제하시겠습니까?</p>
            <div className="flex justify-center gap-4">
               <button
                  onClick={() => dispatch(closeModal())}
                  className="bg-gray-300 px-4 py-2 rounded"
               >
                  아니요
               </button>
               <button
                  onClick={() => {
                     dispatch(clearCart());
                     dispatch(closeModal());
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded"
               >
                  네
               </button>
            </div>
         </div>
      </div>
   );
};

export default Modal;
