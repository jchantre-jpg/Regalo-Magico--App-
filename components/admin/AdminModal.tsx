import { Modal, Pressable, Text, View } from 'react-native';

import type { AdminPersisted } from '../../lib/admin-storage';
import type { CatalogProduct } from '../../lib/catalog.generated';
import type { StoreProduct } from '../../lib/admin-merge';
import { formatPriceCOP } from '../../utils/formatPrice';
import { AdminPanel } from './AdminPanel';

type Props = {
  styles: Record<string, object>;
  visible: boolean;
  scale: number;
  whatsappNumber: string;
  baseCatalog: CatalogProduct[];
  products: StoreProduct[];
  persist: AdminPersisted;
  onPersistChange: (next: AdminPersisted) => void;
  onClose: () => void;
};

export function AdminModal({
  styles,
  visible,
  scale,
  whatsappNumber,
  baseCatalog,
  products,
  persist,
  onPersistChange,
  onClose,
}: Props) {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.adminModalSheet}>
        <View style={styles.adminModalHeader}>
          <Text style={styles.adminModalTitle}>Administracion</Text>
          <Pressable onPress={onClose} hitSlop={12}>
            <Text style={styles.adminModalClose}>Cerrar</Text>
          </Pressable>
        </View>
        <AdminPanel
          visible={visible}
          scale={scale}
          onClose={onClose}
          whatsappNumber={whatsappNumber}
          formatPrice={formatPriceCOP}
          baseCatalog={baseCatalog}
          products={products}
          persist={persist}
          onPersistChange={onPersistChange}
        />
      </View>
    </Modal>
  );
}
