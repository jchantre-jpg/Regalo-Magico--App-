/**
 * Panel admin: login, listado, crear/editar/eliminar productos.
 * Persiste cambios vía database/admin-storage y actualiza el catálogo en memoria.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Share,
  Text,
  TextInput,
  View,
} from 'react-native';

import { ADMIN_FORM_CATEGORIES } from '../../../backend/constants/admin-form';
import { ADMIN_PASSWORD, ADMIN_USERNAME } from '../../../backend/lib/admin-config';
import { catalogProductHasPhoto, getImageUrisForForm, nextProductId } from '../../../backend/lib/admin-merge';
import type { StoreProduct } from '../../../backend/types/store';
import type { AdminPersisted, CustomProductRecord, ProductOverride } from '../../../database/admin-storage';
import { saveAdminData } from '../../../database/admin-storage';
import type { CatalogProduct } from '../../../database/catalog.generated';
import { ProductImage } from '../common/ProductImage';
import { AdminProductForm, type ProductFormPayload } from './AdminProductForm';
import { createAdminPanelStyles } from './adminPanelStyles';
/** Flujo interno del panel (máquina de estados simple). */
type Phase = 'login' | 'list' | 'form';

/** Producto en edición o modo creación. */
type FormTarget =
  | { kind: 'create' }
  | { kind: 'edit'; product: StoreProduct; isCustom: boolean };

type Props = {
  /** Si el modal padre está abierto (reinicia login al abrir). */
  visible: boolean;
  scale: number;
  onClose: () => void;
  whatsappNumber: string;
  formatPrice: (value: number) => string;
  /** Catálogo empaquetado sin cambios del admin (para calcular nextProductId). */
  baseCatalog: CatalogProduct[];
  /** Lista ya fusionada que ve la tienda. */
  products: StoreProduct[];
  persist: AdminPersisted;
  onPersistChange: (next: AdminPersisted) => void;
};
/** Convierte el formulario en override parcial para productos del catálogo base. */
function payloadToOverride(p: ProductFormPayload): ProductOverride {
  const uris = p.imageUris.filter(Boolean);
  const o: ProductOverride = {
    nombre: p.nombre,
    categoria: p.categoria,
    precio: p.precio,
    emoji: p.emoji,
    descripcion: p.descripcion,
    descripcionAdicional: p.descripcionAdicional,
    stock: p.stock,
  };
  if (uris.length > 0) o.imageUris = uris;
  return o;
}
/** Registro completo para productos creados solo en la app (custom). */
function payloadToCustom(id: number, p: ProductFormPayload): CustomProductRecord {
  return {
    id,
    nombre: p.nombre,
    categoria: p.categoria,
    precio: p.precio,
    emoji: p.emoji,
    descripcion: p.descripcion,
    descripcionAdicional: p.descripcionAdicional,
    stock: p.stock,
    imageUris: p.imageUris.filter(Boolean),
  };
}

/** UI del admin: login → listado → formulario (fases en estado local `phase`). */
export function AdminPanel({
  visible,
  scale,
  onClose,
  whatsappNumber,
  formatPrice,
  baseCatalog,
  products,
  persist,
  onPersistChange,
}: Props) {
  /** Máquina de estados: login → listado → formulario. */
  const [phase, setPhase] = useState<Phase>('login');
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  /** Filtro de búsqueda en el listado de productos. */
  const [query, setQuery] = useState('');
  /** Producto en edición o null fuera del formulario. */
  const [formTarget, setFormTarget] = useState<FormTarget | null>(null);
  const styles = useMemo(() => createAdminPanelStyles(scale), [scale]);
  // Al abrir el panel, reiniciar sesión y formulario
  useEffect(() => {
    if (visible) {
      setPhase('login');
      setUser('');
      setPass('');
      setQuery('');
      setFormTarget(null);
    }
  }, [visible]);
  /** Guarda en AsyncStorage y notifica a App para refrescar el catálogo. */
  const applyPersist = useCallback(
    async (next: AdminPersisted) => {
      await saveAdminData(next);
      onPersistChange(next);
    },
    [onPersistChange]
  );
  /** Valida credenciales locales (admin-config) y pasa a la lista. */
  const tryLogin = () => {
    if (user.trim() === ADMIN_USERNAME && pass === ADMIN_PASSWORD) {
      setPhase('list');
      setPass('');
      return;
    }
    Alert.alert('No se pudo iniciar sesion', 'Usuario o contraseña incorrectos. Revisa admin-config.ts.');
  };
  /** Cierra sesión admin y vuelve a la pantalla de login. */
  const logout = () => {
    setPhase('login');
    setUser('');
    setPass('');
  };
  /** Búsqueda por nombre, id, archivo o categoría. */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.nombre.toLowerCase().includes(q) ||
        p.archivo.toLowerCase().includes(q) ||
        String(p.id).includes(q) ||
        p.categoria.toLowerCase().includes(q)
    );
  }, [products, query]);
  /** Abre formulario vacío para producto nuevo (siempre custom, con fotos). */
  const openCreate = () => {
    setFormTarget({ kind: 'create' });
    setPhase('form');
  };
  /** Abre formulario; isCustom define si se edita el array custom o un override. */
  const openEdit = (product: StoreProduct) => {
    setFormTarget({ kind: 'edit', product, isCustom: !!product.fromCustom });
    setPhase('form');
  };
  /** Vuelve al listado sin guardar cambios pendientes del formulario. */
  const cancelForm = () => {
    setFormTarget(null);
    setPhase('list');
  };
  /** Crea custom, actualiza custom o guarda override según el tipo de producto. */
  const saveForm = async (payload: ProductFormPayload) => {
    if (!formTarget) return;
    const isCreate = formTarget.kind === 'create';
    const name = payload.nombre.trim();
    try {
      if (isCreate) {
        if (payload.imageUris.filter(Boolean).length === 0) {
          Alert.alert('Fotos', 'Agrega al menos una foto del producto nuevo.');
          return;
        }
        const id = nextProductId(baseCatalog, persist);
        const rec = payloadToCustom(id, payload);
        const next: AdminPersisted = {
          ...persist,
          customProducts: [...persist.customProducts, rec],
        };
        await applyPersist(next);
        cancelForm();
        Alert.alert('Guardado', `"${name}" se agrego al catalogo.`);
        return;
      }
      const { product, isCustom } = formTarget;
      if (isCustom) {
        if (payload.imageUris.filter(Boolean).length === 0) {
          Alert.alert('Fotos', 'El producto debe tener al menos una foto.');
          return;
        }
        const next: AdminPersisted = {
          ...persist,
          customProducts: persist.customProducts.map((c) =>
            c.id === product.id ? payloadToCustom(product.id, payload) : c
          ),
        };
        await applyPersist(next);
        cancelForm();
        Alert.alert('Guardado', `Cambios en "${name}" guardados.`);
        return;
      }
      const prev = persist.overrides[String(product.id)];
      const o = payloadToOverride(payload);
      const next: AdminPersisted = {
        ...persist,
        overrides: {
          ...persist.overrides,
          [String(product.id)]: { ...prev, ...o },
        },
      };
      await applyPersist(next);
      cancelForm();
      Alert.alert('Guardado', `Cambios en "${name}" guardados.`);
    } catch {
      Alert.alert('Error al guardar', 'No se pudieron guardar los cambios. Intenta de nuevo.');
    }
  };
  /** Pide confirmación antes de eliminar del catálogo visible. */
  const confirmDelete = (product: StoreProduct) => {
    Alert.alert(
      'Eliminar producto',
      `¿Seguro que quieres eliminar "${product.nombre}" del catalogo de la app?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => void deleteProduct(product),
        },
      ]
    );
  };
  /** Custom: quita del array; catálogo base: marca id en deletedIds. */
  const deleteProduct = async (product: StoreProduct) => {
    let next: AdminPersisted;
    if (product.fromCustom) {
      next = { ...persist, customProducts: persist.customProducts.filter((c) => c.id !== product.id) };
    } else {
      const overrides = { ...persist.overrides };
      delete overrides[String(product.id)];
      next = {
        ...persist,
        deletedIds: [...new Set([...persist.deletedIds, product.id])],
        overrides,
      };
    }
    await applyPersist(next);
  };
  /** Comparte por el sistema un resumen de cantidades por categoría. */
  const shareSummary = async () => {
    const byCat = new Map<string, number>();
    for (const p of products) {
      byCat.set(p.categoria, (byCat.get(p.categoria) ?? 0) + 1);
    }
    const lines = [
      'RegaloMagico — catalogo en app',
      `Total visibles: ${products.length}`,
      '',
      ...[...byCat.entries()].map(([c, n]) => `- ${c}: ${n}`),
    ];
    try {
      await Share.share({ message: lines.join('\n') });
    } catch {
      /* cancel */
    }
  };
  /** Valores iniciales del formulario al crear o editar. */
  const initialFormPayload = (target: FormTarget): ProductFormPayload => {
    if (target.kind === 'create') {
      return {
        nombre: '',
        categoria: 'personalizados',
        precio: 45000,
        stock: 1,
        descripcion: '',
        descripcionAdicional: '',
        emoji: '✨',
        imageUris: [],
      };
    }
    const { product, isCustom } = target;
    const ov = persist.overrides[String(product.id)];
    const uris = getImageUrisForForm(product, isCustom ? undefined : ov);
    const custom = isCustom ? persist.customProducts.find((c) => c.id === product.id) : undefined;
    const imgs = isCustom && custom ? custom.imageUris : uris;
    return {
      nombre: product.nombre,
      categoria: product.categoria,
      precio: product.precio,
      stock: product.stock ?? 0,
      descripcion: product.descripcion,
      descripcionAdicional: product.descripcionAdicional ?? custom?.descripcionAdicional ?? '',
      emoji: product.emoji,
      imageUris: imgs.length ? imgs : getImageUrisForForm(product, ov),
    };
  };
  /** Fuerza remount del formulario al cambiar de producto (estado local limpio). */
  const formKey = formTarget
    ? formTarget.kind === 'create'
      ? 'new'
      : `edit-${formTarget.product.id}`
    : 'none';
  const keyboardOffset = Platform.OS === 'ios' ? 64 : 0;
  // ——— Vista: formulario crear / editar ———
  if (phase === 'form' && formTarget) {
    const requirePhotos =
      formTarget.kind === 'create' ||
      formTarget.isCustom ||
      !catalogProductHasPhoto(formTarget.product);
    return (
      <KeyboardAvoidingView style={styles.flex1} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={keyboardOffset}>
        <AdminProductForm
          key={formKey}
          scale={scale}
          title={formTarget.kind === 'create' ? 'Nuevo producto' : 'Editar producto'}
          categories={ADMIN_FORM_CATEGORIES}
          initial={initialFormPayload(formTarget)}
          requirePhotos={requirePhotos}
          onSave={(p) => void saveForm(p)}
          onCancel={cancelForm}
        />
      </KeyboardAvoidingView>
    );
  }
  // ——— Vista: login ———
  if (phase === 'login') {
    return (
      <ScrollView
        style={styles.loginScreen}
        contentContainerStyle={styles.loginScroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.loginCard}>
          <View style={styles.loginBrandRow}>
            <Text style={styles.loginEmoji}>🎁</Text>
            <View>
              <Text style={styles.loginBrand}>RegaloMagico</Text>
              <Text style={styles.loginSub}>Panel de administracion</Text>
            </View>
          </View>
          <Text style={styles.loginLead}>Inicia sesion para gestionar tus productos</Text>
          <Text style={styles.fieldLabel}>Usuario</Text>
          <TextInput
            style={styles.fieldInput}
            value={user}
            onChangeText={setUser}
            placeholder="Tu usuario"
            placeholderTextColor="#5c5348"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Text style={styles.fieldLabel}>Contraseña</Text>
          <TextInput
            style={styles.fieldInput}
            value={pass}
            onChangeText={setPass}
            placeholder="Tu contraseña"
            placeholderTextColor="#5c5348"
            secureTextEntry
          />
          <Pressable style={styles.entrarBtn} onPress={tryLogin}>
            <Text style={styles.entrarBtnText}>Entrar</Text>
          </Pressable>
          <Pressable style={styles.volverBtn} onPress={onClose}>
            <Text style={styles.volverBtnText}>Volver a la tienda</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }
  // ——— Vista: listado con búsqueda ———
  return (
    <View style={styles.listRoot}>
      <View style={styles.listToolbar}>
        <Pressable onPress={logout} hitSlop={10}>
          <Text style={styles.toolbarLink}>Salir</Text>
        </Pressable>
        <Pressable onPress={shareSummary} hitSlop={10}>
          <Text style={styles.toolbarLink}>Compartir</Text>
        </Pressable>
        <Pressable onPress={() => void Linking.openURL(`https://wa.me/${whatsappNumber}`)} hitSlop={10}>
          <Text style={styles.toolbarLink}>WhatsApp</Text>
        </Pressable>
      </View>
      <View style={styles.listHead}>
        <Text style={styles.listCount}>{products.length} productos</Text>
        <Pressable style={styles.addBtn} onPress={openCreate}>
          <Text style={styles.addBtnText}>+ Nuevo</Text>
        </Pressable>
      </View>
      <TextInput
        style={styles.search}
        value={query}
        onChangeText={setQuery}
        placeholder="Buscar por nombre, id, archivo..."
        placeholderTextColor="#6a6054"
        autoCorrect={false}
        autoCapitalize="none"
      />
      <Text style={styles.searchMeta}>
        Mostrando {filtered.length} de {products.length}
      </Text>
      {/* FlatList virtualizada: muchos productos sin bloquear el hilo UI */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        style={styles.list}
        initialNumToRender={16}
        maxToRenderPerBatch={24}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <View style={styles.card}>
            <ProductImage source={item.image} emoji={item.emoji} style={styles.cardImg} />
            <View style={styles.cardMid}>
              <Text style={styles.cardName} numberOfLines={2}>
                {item.nombre}
              </Text>
              <Text style={styles.cardMeta} numberOfLines={1}>
                {item.categoria} · #{item.id}
                {item.stock != null ? ` · Stock ${item.stock}` : ''}
              </Text>
              <Text style={styles.cardPrice}>{formatPrice(item.precio)}</Text>
            </View>
            <View style={styles.cardActions}>
              <Pressable style={styles.miniBtn} onPress={() => openEdit(item)}>
                <Text style={styles.miniBtnText}>Editar</Text>
              </Pressable>
              <Pressable style={styles.miniBtnDanger} onPress={() => confirmDelete(item)}>
                <Text style={styles.miniBtnDangerText}>Eliminar</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}
