import { Modal, Pressable, ScrollView, Text, View } from 'react-native';



import type { CartItem } from '../../../backend/types/store';

import { formatPriceCOP } from '../../../backend/utils/formatPrice';



type Props = {

  styles: Record<string, object>;

  scale: number;

  visible: boolean;

  cart: CartItem[];

  total: number;

  onClose: () => void;

  onSetQuantity: (productId: number, quantity: number) => void;

  onRemoveLine: (productId: number) => void;

  onSendOrder: () => void;

};



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

