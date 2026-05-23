import { useEffect } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';

import type { AdminPersisted } from '../../lib/admin-storage';
import type { CatalogProduct } from '../../lib/catalog.generated';
import type { StoreProduct } from '../../lib/admin-merge';
import { formatPriceCOP } from '../../utils/formatPrice';
import { AdminPanel } from './AdminPanel';

const ADMIN_BG = '#0a0908';
const STORE_BG = '#060606';

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
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    if (visible) {
      NavigationBar.setPositionAsync('absolute').catch(() => {});
      NavigationBar.setBackgroundColorAsync(ADMIN_BG).catch(() => {});
      NavigationBar.setBorderColorAsync(ADMIN_BG).catch(() => {});
      NavigationBar.setButtonStyleAsync('light').catch(() => {});
      return;
    }
    NavigationBar.setPositionAsync('relative').catch(() => {});
    NavigationBar.setBackgroundColorAsync(STORE_BG).catch(() => {});
    NavigationBar.setBorderColorAsync(STORE_BG).catch(() => {});
    NavigationBar.setButtonStyleAsync('light').catch(() => {});
  }, [visible]);

  if (!visible) return null;

  return (
    <View
      style={[
        StyleSheet.absoluteFillObject,
        styles.adminModalRoot,
        { zIndex: 2000, elevation: 2000 },
      ]}
      accessibilityViewIsModal
    >
      <StatusBar style="light" backgroundColor={ADMIN_BG} />
      <View
        style={[
          styles.adminModalSheet,
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
          },
        ]}
      >
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
    </View>
  );
}
