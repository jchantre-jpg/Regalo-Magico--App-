/**
 * Contenedor a pantalla completa del admin (overlay sobre la tienda).
 * En Android ajusta la barra de navegación al abrir/cerrar.
 */
import { useEffect } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import type { AdminPersisted } from '../../../database/admin-storage';
import type { CatalogProduct } from '../../../database/catalog.generated';
import type { StoreProduct } from '../../../backend/types/store';
import { formatPriceCOP } from '../../../backend/utils/formatPrice';
import type { AppStyles } from '../../styles/types';
import { AdminPanel } from './AdminPanel';

/** Colores de la barra de navegación Android al abrir/cerrar admin. */
const ADMIN_BG = '#0a0908';
const STORE_BG = '#060606';

/** Props recibidas desde App.tsx (estado del catálogo y admin). */
type Props = {
  styles: AppStyles;
  visible: boolean;
  scale: number;
  whatsappNumber: string;
  baseCatalog: CatalogProduct[];
  products: StoreProduct[];
  persist: AdminPersisted;
  onPersistChange: (next: AdminPersisted) => void;
  onClose: () => void;
};

/** Overlay fullscreen; delega la lógica en AdminPanel. */
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

  // Sincroniza barra de navegación del sistema en Android con el tema admin/tienda
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
  // Overlay solo cuando App abre admin; evita pintar AdminPanel en segundo plano
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
