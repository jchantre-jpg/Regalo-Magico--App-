/**
 * Cuadrícula de categorías para filtrar el catálogo.
 */
import { Pressable, Text, View } from 'react-native';
import { CATEGORIAS } from '../../../backend/constants/categories';
import type { AppStyles } from '../../styles/types';

type Props = {
  styles: AppStyles;
  /** id de categoría activa (incluye "todos" en el hook, no en esta UI). */
  categoriaActiva: string;
  /** Al elegir categoría, el padre filtra y hace scroll a productos. */
  onSelectCategory: (id: string) => void;
};

/** Grid de categorías (sin "todos"; esa opción solo existe en el filtro del hook). */
export function CategoryGrid({ styles, categoriaActiva, onSelectCategory }: Props) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Categorias</Text>
      <View style={styles.categoryGrid}>
        {/* "todos" solo se usa en el filtro del hook, no como tarjeta */}
        {CATEGORIAS.filter((c) => c.id !== 'todos').map((categoria) => (
          <Pressable
            key={categoria.id}
            style={[
              styles.categoryCard,
              // Resalta la categoría que filtra useCatalog
              categoriaActiva === categoria.id && styles.categoryCardActive,
            ]}
            onPress={() => onSelectCategory(categoria.id)}
          >
            <Text style={styles.categoryCardIcon}>{categoria.icono}</Text>
            <Text style={styles.categoryCardText} numberOfLines={2}>
              {categoria.nombre}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
