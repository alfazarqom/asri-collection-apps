import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";
import { Product } from "../data/defaultCatalog.ts";

export interface CartItem {
  id: string; // generated unique key: `${productId}-${size}-${color}`
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface ToastNotification {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, size?: string, color?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, newQuantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  totalItems: number;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  totalAmount: number;
  appliedCoupon: string | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  toasts: ToastNotification[];
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  removeToast: (id: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "asri_collection_cart";
const FREE_SHIPPING_THRESHOLD = 350000;
const STANDARD_SHIPPING_FEE = 25000;

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Sync cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cart));
    } catch (err) {
      console.error("Failed to save cart to localStorage:", err);
    }
  }, [cart]);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToCart = (
    product: Product,
    quantity = 1,
    size?: string,
    color?: string
  ) => {
    if (product.stock === null || product.stock <= 0) {
      showToast("Stok produk belum tersedia atau habis.", "info");
      return;
    }
    const chosenSize = size || product.sizes?.[0] || "";
    const chosenColor = color || product.colors?.[0] || "";
    const itemId = `${product.id}-${chosenSize}-${chosenColor}`;

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === itemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: Math.min(newQty, product.stock ?? 0),
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            id: itemId,
            product,
            quantity: Math.min(quantity, product.stock ?? 0),
            selectedSize: chosenSize,
            selectedColor: chosenColor,
          },
        ];
      }
    });

    showToast(`"${product.title}" berhasil ditambahkan ke tas belanja.`);
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
    showToast("Produk dihapus dari tas belanja.", "info");
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const maxStock = item.product.stock ?? 0;
          return { ...item, quantity: Math.min(newQuantity, maxStock) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const totalItems = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    const code = appliedCoupon.toUpperCase();
    if (code === "ASRI10") {
      return Math.round(subtotal * 0.1);
    }
    if (code === "ASRI20") {
      return Math.round(subtotal * 0.2);
    }
    if (code === "ONGKIRFREE") {
      return STANDARD_SHIPPING_FEE;
    }
    return 0;
  }, [appliedCoupon, subtotal]);

  const shippingFee = useMemo(() => {
    if (subtotal === 0) return 0;
    if (appliedCoupon?.toUpperCase() === "ONGKIRFREE") return 0;
    return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  }, [subtotal, appliedCoupon]);

  const totalAmount = useMemo(() => {
    const rawTotal = subtotal - discountAmount + shippingFee;
    return Math.max(0, rawTotal);
  }, [subtotal, discountAmount, shippingFee]);

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === "ASRI10") {
      setAppliedCoupon("ASRI10");
      showToast("Voucher ASRI10 berhasil dipakai! Diskon 10% diterapkan.");
      return { success: true, message: "Kupon diskon 10% berhasil diterapkan!" };
    }
    if (clean === "ASRI20") {
      setAppliedCoupon("ASRI20");
      showToast("Voucher ASRI20 berhasil dipakai! Diskon VIP 20% diterapkan.");
      return { success: true, message: "Kupon diskon VIP 20% berhasil diterapkan!" };
    }
    if (clean === "ONGKIRFREE") {
      setAppliedCoupon("ONGKIRFREE");
      showToast("Voucher Gratis Ongkir diterapkan!");
      return { success: true, message: "Gratis ongkos kirim seluruh Indonesia!" };
    }
    showToast("Kode voucher tidak valid atau sudah kedaluwarsa.", "error");
    return { success: false, message: "Kode voucher tidak valid." };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast("Voucher diskon dihapus.", "info");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        totalItems,
        subtotal,
        discountAmount,
        shippingFee,
        totalAmount,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCartContext(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
}
