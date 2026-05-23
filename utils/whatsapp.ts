import { Linking } from 'react-native';

import { WHATSAPP_BASE_MESSAGE, WHATSAPP_NUMBER } from '../constants/contact';
import type { CartItem } from '../types/store';
import { formatPriceCOP } from './formatPrice';

export async function openWhatsAppContact(): Promise<void> {
  await Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER}`);
}

export async function sendWhatsAppOrder(cart: CartItem[], total: number): Promise<void> {
  const lines = cart.map(
    (item) => `- ${item.nombre} x${item.quantity} (${formatPriceCOP(item.precio * item.quantity)})`
  );
  const message = `${WHATSAPP_BASE_MESSAGE}\n\n${lines.join('\n')}\n\nTotal: ${formatPriceCOP(total)}`;
  await Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`);
}
