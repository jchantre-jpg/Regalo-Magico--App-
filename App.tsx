import { StatusBar } from 'expo-status-bar';

import { useState } from 'react';

import { ScrollView, StyleSheet, View } from 'react-native';

import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';



import { AdminModal } from './components/admin/AdminModal';

import { CategoryGrid } from './components/catalog/CategoryGrid';

import { ProductCatalogSection } from './components/catalog/ProductCatalogSection';

import { CartModal } from './components/cart/CartModal';

import { CatalogLoadingScreen } from './components/common/CatalogLoadingScreen';

import { ContactSection } from './components/home/ContactSection';

import { HeroSection } from './components/home/HeroSection';

import { HowToBuySection } from './components/home/HowToBuySection';

import { NavMenu } from './components/layout/NavMenu';

import { TopNav } from './components/layout/TopNav';

import { WhatsAppFab } from './components/layout/WhatsAppFab';

import { ProductDetailModal } from './components/product/ProductDetailModal';

import { useCart } from './hooks/useCart';

import { useCatalog } from './hooks/useCatalog';

import { useResponsiveLayout } from './hooks/useResponsiveLayout';

import { useSectionScroll } from './hooks/useSectionScroll';

import { useWhatsApp } from './hooks/useWhatsApp';

import type { Product } from './types/store';



export default function App() {

  const insets = useSafeAreaInsets();

  const { scale, styles } = useResponsiveLayout();

  const { scrollRef, saveOffset, scrollToSection } = useSectionScroll();

  const { openWhatsAppContact, whatsappNumber } = useWhatsApp();

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



  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  const [adminVisible, setAdminVisible] = useState(false);

  const [menuVisible, setMenuVisible] = useState(false);



  const handleMenuAction = (action: string) => {

    setMenuVisible(false);

    if (action === 'inicio') {

      setCategoriaActiva('todos');

      scrollToSection('inicio');

      return;

    }

    if (action === 'categorias') {

      scrollToSection('categorias');

      return;

    }

    if (action === 'productos') {

      scrollToSection('productos');

      return;

    }

    if (action === 'como') {

      scrollToSection('como');

      return;

    }

    if (action === 'contacto') {

      scrollToSection('contacto');

      return;

    }

    if (action === 'admin') {

      setAdminVisible(true);

    }

  };



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

        contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.round(96 * scale) + insets.bottom }]}

        showsVerticalScrollIndicator={false}

      >

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

          <ContactSection styles={styles} onWhatsApp={openWhatsAppContact} onOpenAdmin={() => setAdminVisible(true)} />

        </View>

      </ScrollView>



      <WhatsAppFab styles={styles} scale={scale} bottomInset={insets.bottom} onPress={openWhatsAppContact} />



      <ProductDetailModal

        styles={styles}

        product={detailProduct}

        onClose={() => setDetailProduct(null)}

        onAddToCart={addToCart}

      />



      <CartModal

        styles={styles}

        scale={scale}

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

const appRoot = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#060606' },
});

