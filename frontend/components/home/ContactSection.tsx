/**
 * Contacto: WhatsApp y enlace al panel admin.
 */
import { Pressable, Text, View } from 'react-native';

import type { AppStyles } from '../../styles/types';

type Props = {
  styles: AppStyles;
  onWhatsApp: () => void;
  /** Abre el overlay del panel admin. */
  onOpenAdmin: () => void;
};

/** Contacto, pie de página y enlace oculto al panel admin. */
export function ContactSection({ styles, onWhatsApp, onOpenAdmin }: Props) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Contacto</Text>
      <Text style={styles.contactLead}>¿Dudas? ¿Productos personalizados?</Text>
      <Text style={styles.contactText}>Escribenos por WhatsApp, estamos para ayudarte.</Text>
      <Pressable style={styles.contactButton} onPress={onWhatsApp}>
        <Text style={styles.contactButtonText}>Chatear por WhatsApp</Text>
      </Pressable>
      <View style={styles.footerBox}>
        <Text style={styles.footerBrand}>🎁 RegaloMagico</Text>
        <Text style={styles.footerText}>Tienda virtual de regalos · Compra por WhatsApp</Text>
        <Text style={styles.footerText}>© 2026 RegaloMagico. Todos los derechos reservados.</Text>
        <Pressable onPress={onOpenAdmin}>
          <Text style={styles.adminLink}>Administracion</Text>
        </Pressable>
      </View>
    </View>
  );
}
