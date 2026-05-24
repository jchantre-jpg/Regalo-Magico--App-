/**
 * Botón flotante de WhatsApp (contacto rápido).
 * La posición inferior respeta el inset del dispositivo.
 */
import { FontAwesome5 } from '@expo/vector-icons';
import { Pressable } from 'react-native';

import type { AppStyles } from '../../styles/types';

type Props = {
  styles: AppStyles;
  scale: number;
  /** Espacio inferior del dispositivo (home indicator). */
  bottomInset: number;
  onPress: () => void;
};

/** Botón flotante verde; bottomInset evita solaparse con el home indicator. */
export function WhatsAppFab({ styles, scale, bottomInset, onPress }: Props) {
  return (
    <Pressable
      style={[styles.whatsFab, { bottom: Math.round(44 * scale) + bottomInset }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Contactar por WhatsApp"
    >
      <FontAwesome5 name="whatsapp" size={Math.round(26 * scale)} color="#fff" />
    </Pressable>
  );
}
