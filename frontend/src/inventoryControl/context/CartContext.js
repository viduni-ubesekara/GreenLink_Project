import React, { createContext, useState, useContext } from "react";

// Create Context
const CartContext = createContext();

// Cart Provider
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Add item to cart
  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.itemId === item.itemId);
      if (existingItem) {
        return prevItems.map((i) =>
          i.itemId === item.itemId
            ? { ...i, itemCount: i.itemCount + item.itemCount, totalPrice: (i.itemCount + item.itemCount) * i.itemPrice }
            : i
        );
      } else {
        return [...prevItems, { ...item, totalPrice: item.itemCount * item.itemPrice }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.itemId !== itemId));
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Update item quantity
  const updateItemCount = (itemId, newCount) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.itemId === itemId
          ? { ...item, itemCount: newCount, totalPrice: newCount * item.itemPrice }
          : item
      )
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        updateItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook to use cart
export const useCart = () => useContext(CartContext);
