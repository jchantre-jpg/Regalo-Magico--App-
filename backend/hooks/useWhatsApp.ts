/**
 * Acceso rápido al número de WhatsApp y apertura del chat de contacto.
 */
import { WHATSAPP_NUMBER } from '../constants/contact';
import { openWhatsAppContact } from '../utils/whatsapp';

/** Número y apertura de WhatsApp para contacto y pedidos. */
export function useWhatsApp() {
  // API mínima: número y apertura de chat (ContactSection, WhatsAppFab, AdminPanel)
  return {
    whatsappNumber: WHATSAPP_NUMBER,
    openWhatsAppContact,
  };
}
