import { useMemo, useState } from 'react';



import type { CartItem, StoreProduct } from '../types/store';

import { sendWhatsAppOrder as sendOrder } from '../utils/whatsapp';



export function useCart() {

  const [cart, setCart] = useState<CartItem[]>([]);

  const [cartModalVisible, setCartModalVisible] = useState(false);



  const total = useMemo(() => cart.reduce((acc, item) => acc + item.precio * item.quantity, 0), [cart]);

  const cartItemsCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);



  const addToCart = (product: StoreProduct) => {

    setCart((prev) => {

      const found = prev.find((item) => item.id === product.id);

      if (!found) return [...prev, { ...product, quantity: 1 }];

      return prev.map((item) =>

        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item

      );

    });

    setCartModalVisible(true);

  };



  const removeFromCart = (productId: number) => {

    setCart((prev) =>

      prev

        .map((item) => (item.id === productId ? { ...item, quantity: item.quantity - 1 } : item))

        .filter((item) => item.quantity > 0)

    );

  };



  const setCartQuantity = (productId: number, quantity: number) => {

    if (quantity < 1) {

      setCart((prev) => prev.filter((item) => item.id !== productId));

      return;

    }

    setCart((prev) => prev.map((item) => (item.id === productId ? { ...item, quantity } : item)));

  };



  const removeCartLine = (productId: number) => {

    setCart((prev) => prev.filter((item) => item.id !== productId));

  };



  const sendWhatsAppOrder = () => {

    void sendOrder(cart, total);

  };



  return {

    cart,

    cartModalVisible,

    setCartModalVisible,

    total,

    cartItemsCount,

    addToCart,

    removeFromCart,

    setCartQuantity,

    removeCartLine,

    sendWhatsAppOrder,

  };

}

