/**
 * Enlaces a WhatsApp: contacto general y pedido con resumen del carrito.
 */
import { Linking } from 'react-native';

import { WHATSAPP_BASE_MESSAGE, WHATSAPP_NUMBER } from '../constants/contact';
import type { CartItem } from '../types/store';
import { formatPriceCOP } from './formatPrice';

/** Abre chat de WhatsApp sin mensaje prefijado. */
export async function openWhatsAppContact(): Promise<void> {
  await Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER}`);
}

/** Abre WhatsApp con lista de ítems y total del carrito. */
export async function sendWhatsAppOrder(cart: CartItem[], total: number): Promise<void> {
  // Mensaje: texto base + una línea por producto + total en COP
  // Una línea por producto; el total va al final del mensaje codificado en la URL
  const lines = cart.map(
    (item) => `- ${item.nombre} x${item.quantity} (${formatPriceCOP(item.precio * item.quantity)})`
  );
  const message = `${WHATSAPP_BASE_MESSAGE}\n\n${lines.join('\n')}\n\nTotal: ${formatPriceCOP(total)}`;
  await Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`);
}
