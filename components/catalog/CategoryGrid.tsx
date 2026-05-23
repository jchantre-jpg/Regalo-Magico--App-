import { Pressable, Text, View } from 'react-native';

import { CATEGORIAS } from '../../constants/categories';

type Props = {
  styles: Record<string, object>;
  categoriaActiva: string;
  onSelectCategory: (id: string) => void;
};

export function CategoryGrid({ styles, categoriaActiva, onSelectCategory }: Props) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Categorias</Text>
      <View style={styles.categoryGrid}>
        {CATEGORIAS.filter((c) => c.id !== 'todos').map((categoria) => (
          <Pressable
            key={categoria.id}
            style={[styles.categoryCard, categoriaActiva === categoria.id && styles.categoryCardActive]}
            onPress={() => onSelectCategory(categoria.id)}
          >
            <Text style={styles.categoryCardIcon}>{categoria.icono}</Text>
            <Text style={styles.categoryCardText}>{categoria.nombre}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
