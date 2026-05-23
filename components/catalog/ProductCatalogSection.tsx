import { Image, Pressable, Text, View } from 'react-native';

import { CATEGORIAS } from '../../constants/categories';
import type { Product } from '../../types/store';
import { formatPriceCOP } from '../../utils/formatPrice';

type Props = {
  styles: Record<string, object>;
  categoriaActiva: string;
  productos: Product[];
  restantes: number;
  onSelectCategory: (id: string) => void;
  onOpenDetail: (product: Product) => void;
  onAdd: (product: Product) => void;
  onRemove: (productId: number) => void;
  onLoadMore: () => void;
};

export function ProductCatalogSection({
  styles,
  categoriaActiva,
  productos,
  restantes,
  onSelectCategory,
  onOpenDetail,
  onAdd,
  onRemove,
  onLoadMore,
}: Props) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Catalogo</Text>
      <View style={styles.filterWrap}>
        {CATEGORIAS.map((categoria) => (
          <Pressable
            key={categoria.id}
            style={[styles.filterChip, categoriaActiva === categoria.id && styles.filterChipActive]}
            onPress={() => onSelectCategory(categoria.id)}
          >
            <Text
              style={[
                styles.filterChipText,
                categoriaActiva === categoria.id && styles.filterChipTextActive,
              ]}
            >
              {categoria.nombre}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.productGrid}>
        {productos.map((item) => (
          <View key={item.id} style={styles.productCard}>
            <Pressable style={styles.productImageMock} onPress={() => onOpenDetail(item)}>
              <Image source={item.image} style={styles.productImage} resizeMode="cover" />
            </Pressable>
            <View style={styles.productCardBody}>
              <Text style={styles.productName} numberOfLines={2}>
                {item.nombre}
              </Text>
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
