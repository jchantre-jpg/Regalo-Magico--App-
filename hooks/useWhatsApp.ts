import { WHATSAPP_NUMBER } from '../constants/contact';
import { openWhatsAppContact } from '../utils/whatsapp';

export function useWhatsApp() {
  return {
    whatsappNumber: WHATSAPP_NUMBER,
    openWhatsAppContact: () => void openWhatsAppContact(),
  };
}
