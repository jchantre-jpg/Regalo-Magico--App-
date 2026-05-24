/**
 * Hook del carrito de compras (estado en memoria durante la sesión).
 */
import { useCallback, useMemo, useState } from 'react';

import type { CartItem, StoreProduct } from '../types/store';
import { sendWhatsAppOrder as sendOrder } from '../utils/whatsapp';

/** Estado del carrito en memoria (no persiste al cerrar la app). */
export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  /** Se abre al agregar el primer producto o desde el icono del carrito. */
  const [cartModalVisible, setCartModalVisible] = useState(false);

  /** Suma precio x cantidad de cada línea del carrito. */
  const total = useMemo(
    () => cart.reduce((acc, item) => acc + item.precio * item.quantity, 0),
    [cart]
  );

  /** Total de unidades (badge del icono carrito en TopNav). */
  const cartItemsCount = useMemo(
    () => cart.reduce((acc, item) => acc + item.quantity, 0),
    [cart]
  );

  /** Agrega o incrementa cantidad y abre el modal del carrito. */
  const addToCart = useCallback((product: StoreProduct) => {
    setCart((prev: CartItem[]) => {
      const found = prev.find((item) => item.id === product.id);
      if (!found) {
        return [...prev, { ...product, quantity: 1 }];
      }
      return prev.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    });
    setCartModalVisible(true);
  }, []);

  /** Resta una unidad desde el catálogo (botón Quitar en tarjeta). */
  const removeFromCart = useCallback((productId: number) => {
    setCart((prev: CartItem[]) =>
      prev
        .map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  /** Cambia cantidad desde el modal (+ / −). */
  const setCartQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity < 1) {
      setCart((prev: CartItem[]) => prev.filter((item) => item.id !== productId));
      return;
    }
    setCart((prev: CartItem[]) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  }, []);

  /** Elimina la línea completa del carrito. */
  const removeCartLine = useCallback((productId: number) => {
    setCart((prev: CartItem[]) => prev.filter((item) => item.id !== productId));
  }, []);

  /** Envía pedido por WhatsApp con el estado actual del carrito. */
  const sendWhatsAppOrder = useCallback(() => {
    void sendOrder(cart, total);
  }, [cart, total]);

  // API pública del hook (consumida por App.tsx)
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
