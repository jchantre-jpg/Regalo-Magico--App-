import { Pressable, Text, View } from 'react-native';

type Props = {
  styles: Record<string, object>;
  onWhatsApp: () => void;
  onOpenAdmin: () => void;
};

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
