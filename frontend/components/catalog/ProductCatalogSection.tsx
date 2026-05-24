import { Pressable, Text, View } from 'react-native';

import { ProductImage } from '../common/ProductImage';
import type { Product } from '../../../backend/types/store';
import { formatPriceCOP } from '../../../backend/utils/formatPrice';

type Props = {
  styles: Record<string, object>;
  productos: Product[];
  restantes: number;
  onOpenDetail: (product: Product) => void;
  onAdd: (product: Product) => void;
  onRemove: (productId: number) => void;
  onLoadMore: () => void;
};

export function ProductCatalogSection({
  styles,
  productos,
  restantes,
  onOpenDetail,
  onAdd,
  onRemove,
  onLoadMore,
}: Props) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Catalogo</Text>

      <View style={styles.productGrid}>
        {productos.map((item) => (
          <View key={item.id} style={styles.productCard}>
            <Pressable style={styles.productImageMock} onPress={() => onOpenDetail(item)}>
              <ProductImage
                source={item.image}
                style={styles.productImage}
                containerStyle={[styles.productImageMock, styles.productImageFallback]}
              />
            </Pressable>
            <View style={styles.productCardBody}>
              <Text style={styles.productName} numberOfLines={2}>
                {item.nombre}
              </Text>
              {item.descripcion ? (
                <Text style={styles.productDescription} numberOfLines={2}>
                  {item.descripcion.replace(/\s+/g, ' ').trim()}
                </Text>
              ) : null}
              <Text style={styles.productPrice}>{formatPriceCOP(item.precio)}</Text>
              <View style={styles.productActions}>
                <Pressable style={styles.addBtn} onPress={() => onAdd(item)}>
                  <Text style={styles.btnText}>Agregar</Text>
                </Pressable>
                <Pressable style={styles.removeBtn} onPress={() => onRemove(item.id)}>
                  <Text style={styles.btnText}>Quitar</Text>
                </Pressable>
              </View>
            </View>
          </View>
        ))}
      </View>

      {restantes > 0 && (
        <Pressable style={styles.loadMoreBtn} onPress={onLoadMore}>
          <Text style={styles.loadMoreText}>Cargar mas ({restantes} restantes)</Text>
        </Pressable>
      )}
    </View>
  );
}
