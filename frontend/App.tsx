/**
 * Pantalla principal: compone secciones, modales y delega estado a hooks (backend/).
 * No contiene lógica de negocio pesada — solo cableado UI + callbacks.
 */
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useCart } from '../backend/hooks/useCart';
import { useCatalog } from '../backend/hooks/useCatalog';
import { useResponsiveLayout } from '../backend/hooks/useResponsiveLayout';
import { useSectionScroll } from '../backend/hooks/useSectionScroll';
import { useWhatsApp } from '../backend/hooks/useWhatsApp';
import type { MenuAction, Product } from '../backend/types/store';
import { handleMenuNavigation } from '../backend/utils/menuNavigation';
import { AdminModal } from './components/admin/AdminModal';
import { CartModal } from './components/cart/CartModal';
import { CategoryGrid } from './components/catalog/CategoryGrid';
import { ProductCatalogSection } from './components/catalog/ProductCatalogSection';
import { CatalogLoadingScreen } from './components/common/CatalogLoadingScreen';
import { ContactSection } from './components/home/ContactSection';
import { HeroSection } from './components/home/HeroSection';
import { HowToBuySection } from './components/home/HowToBuySection';
import { NavMenu } from './components/layout/NavMenu';
import { TopNav } from './components/layout/TopNav';
import { WhatsAppFab } from './components/layout/WhatsAppFab';
import { ProductDetailModal } from './components/product/ProductDetailModal';

/** Pantalla raíz de la tienda (montada desde index.ts dentro de SafeAreaProvider). */
export default function App() {
  const insets = useSafeAreaInsets();

  // —— Layout y navegación ——
  const { scale, styles } = useResponsiveLayout();
  const { scrollRef, saveOffset, scrollToSection } = useSectionScroll();
  const { openWhatsAppContact, whatsappNumber } = useWhatsApp();

  // —— Catálogo y carrito (estado en hooks) ——
  const {
    catalogLoading,
    catalogBase,
    adminPersist,
    setAdminPersist,
    categoriaActiva,
    setCategoriaActiva,
    productosCatalogo,
    productosVisibles,
    restantesCatalogo,
    loadMoreProducts,
  } = useCatalog();
  const {
    cart,
    cartModalVisible,
    setCartModalVisible,
    total,
    cartItemsCount,
    addToCart,
    removeFromCart,
    setCartQuantity,
    removeCartLine,
    sendWhatsAppOrder,
  } = useCart();

  /** Modales y overlays: detalle de producto, menú lateral y panel admin. */
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [adminVisible, setAdminVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  /** Cierra el menú y delega scroll / admin según la acción elegida. */
  const handleMenuAction = useCallback(
    (action: MenuAction) => {
      setMenuVisible(false);
      handleMenuNavigation(action, {
        scrollToSection,
        setCategoriaActiva,
        openAdmin: () => setAdminVisible(true),
      });
    },
    [scrollToSection, setCategoriaActiva]
  );

  // Espera catálogo remoto si EXPO_PUBLIC_USE_REMOTE_CATALOG está activo
  if (catalogLoading) {
    return <CatalogLoadingScreen />;
  }

  return (
    <View style={appRoot.root}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <StatusBar style="light" />

        <TopNav
          styles={styles}
          scale={scale}
          cartItemsCount={cartItemsCount}
          onOpenCart={() => setCartModalVisible(true)}
          onOpenMenu={() => setMenuVisible(true)}
        />

        <ScrollView
          ref={scrollRef}
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            // Espacio inferior para FAB de WhatsApp + home indicator
            { paddingBottom: Math.round(96 * scale) + insets.bottom },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* onLayout: guarda Y de cada bloque para scroll del menú lateral */}
          <View onLayout={(e) => saveOffset('inicio', e.nativeEvent.layout.y)}>
            <HeroSection styles={styles} onExplore={() => scrollToSection('productos')} />
          </View>

          <View onLayout={(e) => saveOffset('categorias', e.nativeEvent.layout.y)}>
            <CategoryGrid
              styles={styles}
              categoriaActiva={categoriaActiva}
              onSelectCategory={(id) => {
                setCategoriaActiva(id);
                scrollToSection('productos');
              }}
            />
          </View>

          <View onLayout={(e) => saveOffset('productos', e.nativeEvent.layout.y)}>
            <ProductCatalogSection
              styles={styles}
              productos={productosVisibles}
              restantes={restantesCatalogo}
              onOpenDetail={setDetailProduct}
              onAdd={addToCart}
              onRemove={removeFromCart}
              onLoadMore={loadMoreProducts}
            />
          </View>

          <View onLayout={(e) => saveOffset('como', e.nativeEvent.layout.y)}>
            <HowToBuySection styles={styles} />
          </View>

          <View onLayout={(e) => saveOffset('contacto', e.nativeEvent.layout.y)}>
            <ContactSection
              styles={styles}
              onWhatsApp={openWhatsAppContact}
              onOpenAdmin={() => setAdminVisible(true)}
            />
          </View>
        </ScrollView>

        <WhatsAppFab
          styles={styles}
          scale={scale}
          bottomInset={insets.bottom}
          onPress={openWhatsAppContact}
        />

        <ProductDetailModal
          styles={styles}
          product={detailProduct}
          onClose={() => setDetailProduct(null)}
          onAddToCart={addToCart}
        />

        <CartModal
          styles={styles}
          visible={cartModalVisible}
          cart={cart}
          total={total}
          onClose={() => setCartModalVisible(false)}
          onSetQuantity={setCartQuantity}
          onRemoveLine={removeCartLine}
          onSendOrder={sendWhatsAppOrder}
        />

        <NavMenu
          styles={styles}
          scale={scale}
          insetTop={insets.top}
          visible={menuVisible}
          onClose={() => setMenuVisible(false)}
          onAction={handleMenuAction}
        />
      </SafeAreaView>

      {/* Admin fuera del SafeArea para overlay a pantalla completa */}
      <AdminModal
        styles={styles}
        visible={adminVisible}
        scale={scale}
        whatsappNumber={whatsappNumber}
        baseCatalog={catalogBase}
        products={productosCatalogo}
        persist={adminPersist}
        onPersistChange={setAdminPersist}
        onClose={() => setAdminVisible(false)}
      />
    </View>
  );
}

/** Fondo raíz detrás del SafeArea (tienda). */
const appRoot = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#060606' },
});
