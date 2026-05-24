import { Ionicons } from '@expo/vector-icons';

import { Pressable, Text, View } from 'react-native';



type Props = {

  scale: number;

  styles: Record<string, object>;

  cartItemsCount: number;

  onOpenCart: () => void;

  onOpenMenu: () => void;

};



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

