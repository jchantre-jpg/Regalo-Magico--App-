/**
 * Detalle del producto: fotos, descripción y agregar al carrito.
 */
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { ProductImage } from '../common/ProductImage';
import type { Product } from '../../../backend/types/store';
import { formatPriceCOP } from '../../../backend/utils/formatPrice';
import type { AppStyles } from '../../styles/types';

type Props = {
  styles: AppStyles;
  /** null = modal cerrado (no se renderiza contenido). */
  product: Product | null;
  onClose: () => void;
  /** Cierra el modal y agrega al carrito. */
  onAddToCart: (product: Product) => void;
};

/** Galería: URIs del admin, require() empaquetado o imagen única. */
function productImages(product: Product): ImageSourcePropType[] {
  if (product.imageUris?.length) {
    return product.imageUris.map((uri) => ({ uri }));
  }
  if (typeof product.image === 'number') {
    return [product.image];
  }
  return [product.image];
}

/** Modal con galería, precio y botón agregar (product null = cerrado). */
export function ProductDetailModal({ styles, product, onClose, onAddToCart }: Props) {
  // product === null → modal cerrado (App no monta contenido)
  if (!product) return null;
  const images = productImages(product);
  const imageCellStyle = images.length > 1 ? styles.detailImageCell : styles.detailImageCellFull;
  return (
    <Modal visible animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.detailModalSheet}>
          <Pressable style={styles.detailModalCloseBtn} onPress={onClose}>
            <Text style={styles.detailModalCloseText}>✕</Text>
          </Pressable>
          <ScrollView>
            <View style={styles.detailImagesGrid}>
              {images.map((source, index) => (
                <View key={`${product.id}-img-${index}`} style={imageCellStyle}>
                  <ProductImage
                    source={source}
                    style={styles.detailModalImageThumb}
                    containerStyle={styles.detailModalImageThumb}
                  />
                </View>
              ))}
            </View>
            <View style={styles.detailModalBody}>
              <Text style={styles.detailModalTitle}>{product.nombre}</Text>
              <Text style={styles.detailModalPrice}>{formatPriceCOP(product.precio)}</Text>
              <Text style={styles.detailModalDesc}>{product.descripcion}</Text>
              {product.descripcionAdicional ? (
                <Text style={styles.detailModalDesc}>{product.descripcionAdicional}</Text>
              ) : null}
              {/* Agrega al carrito y cierra el detalle (useCart abre el modal del carrito) */}
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
