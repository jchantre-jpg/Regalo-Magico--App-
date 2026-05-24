/** Barra superior: marca, menú y acceso al carrito. */
import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import type { AppStyles } from '../../styles/types';

type Props = {
  scale: number;
  styles: AppStyles;
  /** Total de unidades en el carrito (badge). */
  cartItemsCount: number;
  onOpenCart: () => void;
  onOpenMenu: () => void;
};

/** Barra fija: logo, carrito con badge y botón del menú hamburguesa. */
export function TopNav({ scale, styles, cartItemsCount, onOpenCart, onOpenMenu }: Props) {
  return (
    <View style={styles.topNav}>
      <Text style={styles.logoText}>🎁 RegaloMagico</Text>
      <View style={styles.topNavActions}>
        <Pressable
          style={styles.cartIcon}
          onPress={onOpenCart}
          accessibilityRole="button"
          accessibilityLabel="Abrir carrito"
        >
          <Ionicons name="cart" size={Math.round(22 * scale)} color="#f4d8a3" />
          {/* Badge: suma de cantidades (no líneas distintas) */}
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{cartItemsCount}</Text>
          </View>
        </Pressable>
        <Pressable style={styles.menuButton} onPress={onOpenMenu}>
          <Text style={styles.menuButtonText}>☰</Text>
        </Pressable>
      </View>
    </View>
  );
}
