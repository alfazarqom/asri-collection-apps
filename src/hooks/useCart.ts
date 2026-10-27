import { useCartContext } from "../context/CartContext.tsx";

export function useCart() {
  return useCartContext();
}

export default useCart;
