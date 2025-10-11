import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Deal {
  id: number;
  image: string;
  merchant: string;
  title: string;
  category: string;
  discount: string;
  originalPrice?: number;
  currentPrice?: number;
  offer?: string;
  soldCount: number;
}

interface CartItem extends Deal {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (deal: Deal) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem("vouchify-cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("vouchify-cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (deal: Deal) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === deal.id);
      if (existing) {
        return prev.map((item) =>
          item.id === deal.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...deal, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => {
    if (item.currentPrice) {
      return sum + item.currentPrice * item.quantity;
    }
    return sum;
  }, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};