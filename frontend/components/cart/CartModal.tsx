/**
 * Modal del carrito: cantidades, total y envío del pedido por WhatsApp.
 */
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import type { CartItem } from '../../../backend/types/store';
import { formatPriceCOP } from '../../../backend/utils/formatPrice';
import type { AppStyles } from '../../styles/types';

type Props = {
  styles: AppStyles;
  visible: boolean;
  cart: CartItem[];
  /** Total en COP calculado en useCart. */
  total: number;
  onClose: () => void;
  /** Ajusta cantidad (+/−); si llega a 0 quita la línea. */
  onSetQuantity: (productId: number, quantity: number) => void;
  /** Elimina el producto del carrito de un solo toque. */
  onRemoveLine: (productId: number) => void;
  /** Abre WhatsApp con el resumen del pedido. */
  onSendOrder: () => void;
};

/** Sheet inferior: líneas del carrito, cantidades y envío por WhatsApp. */
export function CartModal({
  styles,
  visible,
  cart,
  total,
  onClose,
  onSetQuantity,
  onRemoveLine,
  onSendOrder,
}: Props) {
  return (
    // Modal deslizable desde abajo; transparent para ver la tienda detrás
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalSheet}>
          <View style={styles.cartModalHeader}>
            <Pressable style={styles.cartModalBackBtn} onPress={onClose} hitSlop={12}>
              <Text style={styles.cartModalBack}>← Seguir comprando</Text>
            </Pressable>
            <Text style={styles.cartModalTitle}>Tu carrito</Text>
          </View>
          <ScrollView style={styles.cartModalBody}>
            {cart.length === 0 ? (
              <Text style={styles.cartModalEmpty}>Tu carrito esta vacio</Text>
            ) : (
              cart.map((item) => (
                <View key={item.id} style={styles.cartModalLine}>
                  <View style={styles.cartModalLineInfo}>
                    <Text style={styles.cartModalLineName} numberOfLines={2}>
                      {item.nombre}
                    </Text>
                    <Text style={styles.cartModalLinePrice}>
                      {formatPriceCOP(item.precio * item.quantity)}
                    </Text>
                  </View>
                  <View style={styles.cartModalQtyRow}>
                    <Pressable
                      style={styles.cartModalQtyBtn}
                      onPress={() => onSetQuantity(item.id, item.quantity - 1)}
                    >
                      <Text style={styles.cartModalQtyText}>−</Text>
                    </Pressable>
                    <Text style={styles.cartModalQtyText}>{item.quantity}</Text>
                    <Pressable
                      style={styles.cartModalQtyBtn}
                      onPress={() => onSetQuantity(item.id, item.quantity + 1)}
                    >
                      <Text style={styles.cartModalQtyText}>+</Text>
                    </Pressable>
                    <Pressable onPress={() => onRemoveLine(item.id)} hitSlop={8}>
                      <Text style={[styles.cartModalBack, { fontSize: 12 }]}>Quitar</Text>
                    </Pressable>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
          {/* Pie fijo: total y envío del pedido formateado en whatsapp.ts */}
          {cart.length > 0 && (
            <View style={styles.cartModalFooter}>
              <Text style={styles.cartModalTotal}>Total: {formatPriceCOP(total)}</Text>
              <Pressable style={styles.cartModalSendBtn} onPress={onSendOrder}>
                <Text style={styles.cartModalSendText}>Enviar pedido por WhatsApp</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}
