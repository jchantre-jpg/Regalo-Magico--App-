import { FontAwesome5 } from '@expo/vector-icons';
import { Pressable } from 'react-native';

type Props = {
  styles: Record<string, object>;
  scale: number;
  bottomInset: number;
  onPress: () => void;
};

export function WhatsAppFab({ styles, scale, bottomInset, onPress }: Props) {
  return (
    <Pressable
      style={[styles.whatsFab, { bottom: Math.round(84 * scale) + bottomInset }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Contactar por WhatsApp"
    >
      <FontAwesome5 name="whatsapp" size={Math.round(26 * scale)} color="#fff" />
    </Pressable>
  );
}
