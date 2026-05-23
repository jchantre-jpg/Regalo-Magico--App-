import { Image, Modal, Pressable, ScrollView, Text, View } from 'react-native';

import type { Product } from '../../types/store';
import { formatPriceCOP } from '../../utils/formatPrice';

type Props = {
  styles: Record<string, object>;
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
};

export function ProductDetailModal({ styles, product, onClose, onAddToCart }: Props) {
  if (!product) return null;

  return (
    <Modal visible animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.detailModalSheet}>
          <Pressable style={styles.detailModalCloseBtn} onPress={onClose}>
            <Text style={styles.detailModalCloseText}>✕</Text>
          </Pressable>
          <ScrollView>
            <Image source={product.image} style={styles.detailModalImage} resizeMode="cover" />
            <View style={styles.detailModalBody}>
              <Text style={styles.detailModalTitle}>{product.nombre}</Text>
              <Text style={styles.detailModalPrice}>{formatPriceCOP(product.precio)}</Text>
              <Text style={styles.detailModalDesc}>{product.descripcion}</Text>
              {product.descripcionAdicional ? (
                <Text style={styles.detailModalDesc}>{product.descripcionAdicional}</Text>
              ) : null}
              <Pressable
                style={styles.detailModalAddBtn}
                onPress={() => {
                  onAddToCart(product);
                  onClose();
                }}
              >
                <Text style={styles.btnText}>Agregar al carrito</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
