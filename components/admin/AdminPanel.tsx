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
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { ADMIN_PASSWORD, ADMIN_USERNAME } from '../../lib/admin-config';
import {
  catalogProductHasPhoto,
  getImageUrisForForm,
  nextProductId,
  type StoreProduct,
} from '../../lib/admin-merge';
import type { AdminPersisted, CustomProductRecord, ProductOverride } from '../../lib/admin-storage';
import { saveAdminData } from '../../lib/admin-storage';
import type { CatalogProduct } from '../../lib/catalog.generated';
import { ProductImage } from '../common/ProductImage';
import { AdminProductForm, type CategoryOption, type ProductFormPayload } from './AdminProductForm';

type Phase = 'login' | 'list' | 'form';

type FormTarget =
  | { kind: 'create' }
  | { kind: 'edit'; product: StoreProduct; isCustom: boolean };

type Props = {
  visible: boolean;
  scale: number;
  onClose: () => void;
  whatsappNumber: string;
  formatPrice: (value: number) => string;
  baseCatalog: CatalogProduct[];
  products: StoreProduct[];
  persist: AdminPersisted;
  onPersistChange: (next: AdminPersisted) => void;
};

const FORM_CATEGORIES: CategoryOption[] = [
  { id: 'desayunos', label: 'Desayunos' },
  { id: 'flores', label: 'Flores' },
  { id: 'chocolates', label: 'Chocolates' },
  { id: 'peluches', label: 'Peluches' },
  { id: 'globos', label: 'Globos' },
  { id: 'personalizados', label: 'Personalizados' },
];

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
  const [phase, setPhase] = useState<Phase>('login');
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [query, setQuery] = useState('');
  const [formTarget, setFormTarget] = useState<FormTarget | null>(null);

  const styles = useMemo(() => createStyles(scale), [scale]);

  useEffect(() => {
    if (visible) {
      setPhase('login');
      setUser('');
      setPass('');
      setQuery('');
      setFormTarget(null);
    }
  }, [visible]);

  const applyPersist = useCallback(
    async (next: AdminPersisted) => {
      await saveAdminData(next);
      onPersistChange(next);
    },
    [onPersistChange]
  );

  const tryLogin = () => {
    if (user.trim() === ADMIN_USERNAME && pass === ADMIN_PASSWORD) {
      setPhase('list');
      setPass('');
      return;
    }
    Alert.alert('No se pudo iniciar sesion', 'Usuario o contraseña incorrectos. Revisa admin-config.ts.');
  };

  const logout = () => {
    setPhase('login');
    setUser('');
    setPass('');
  };

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

  const openCreate = () => {
    setFormTarget({ kind: 'create' });
    setPhase('form');
  };

  const openEdit = (product: StoreProduct) => {
    setFormTarget({ kind: 'edit', product, isCustom: !!product.fromCustom });
    setPhase('form');
  };

  const cancelForm = () => {
    setFormTarget(null);
    setPhase('list');
  };

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

  const formKey = formTarget
    ? formTarget.kind === 'create'
      ? 'new'
      : `edit-${formTarget.product.id}`
    : 'none';

  const keyboardOffset = Platform.OS === 'ios' ? 64 : 0;

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
          categories={FORM_CATEGORIES}
          initial={initialFormPayload(formTarget)}
          requirePhotos={requirePhotos}
          onSave={(p) => void saveForm(p)}
          onCancel={cancelForm}
        />
      </KeyboardAvoidingView>
    );
  }

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

function createStyles(scale: number) {
  const r = (n: number) => Math.round(n * scale);
  return StyleSheet.create({
    flex1: { flex: 1 },
    loginScreen: { flex: 1, backgroundColor: '#0a0908' },
    loginScroll: { flexGrow: 1, justifyContent: 'center', paddingVertical: r(24), paddingHorizontal: r(12) },
    loginCard: {
      backgroundColor: '#141210',
      borderRadius: r(18),
      borderWidth: 1,
      borderColor: '#3d3427',
      padding: r(20),
    },
    loginBrandRow: { flexDirection: 'row', alignItems: 'center', gap: r(12) },
    loginEmoji: { fontSize: r(36) },
    loginBrand: { color: '#fff', fontSize: r(24), fontWeight: '800' },
    loginSub: { color: '#fff', fontSize: r(17), fontWeight: '700', marginTop: r(2) },
    loginLead: { color: '#9c8f7b', fontSize: r(14), marginTop: r(14), lineHeight: r(20) },
    fieldLabel: { color: '#f4ead8', fontSize: r(14), fontWeight: '700', marginTop: r(16) },
    fieldInput: {
      marginTop: r(8),
      borderWidth: 1,
      borderColor: '#5c4d32',
      borderRadius: r(12),
      paddingVertical: r(13),
      paddingHorizontal: r(14),
      fontSize: r(16),
      color: '#f4ead8',
      backgroundColor: '#0f0d0a',
    },
    entrarBtn: {
      marginTop: r(22),
      backgroundColor: '#d2b06b',
      borderRadius: r(12),
      paddingVertical: r(14),
      alignItems: 'center',
      alignSelf: 'flex-start',
      paddingHorizontal: r(32),
    },
    entrarBtnText: { color: '#1a150e', fontWeight: '900', fontSize: r(16) },
    volverBtn: { marginTop: r(14), paddingVertical: r(10) },
    volverBtnText: { color: '#baa98f', fontSize: r(15), fontWeight: '600' },
    listRoot: { flex: 1, paddingHorizontal: r(12), backgroundColor: '#0a0908' },
    listToolbar: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: r(8), marginTop: r(4) },
    toolbarLink: { color: '#d2b06b', fontSize: r(14), fontWeight: '700' },
    listHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: r(8) },
    listCount: { color: '#e8dcc8', fontSize: r(16), fontWeight: '700' },
    addBtn: {
      backgroundColor: '#2a2418',
      borderWidth: 1,
      borderColor: '#d2b06b',
      borderRadius: r(10),
      paddingVertical: r(8),
      paddingHorizontal: r(14),
    },
    addBtnText: { color: '#d2b06b', fontWeight: '800', fontSize: r(14) },
    search: {
      borderWidth: 1,
      borderColor: '#3d3427',
      borderRadius: r(12),
      paddingVertical: r(11),
      paddingHorizontal: r(12),
      fontSize: r(15),
      color: '#f4ead8',
      backgroundColor: '#151515',
    },
    searchMeta: { color: '#6a6054', fontSize: r(11), marginTop: r(6), marginBottom: r(6) },
    list: { flex: 1 },
    card: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: '#12100c',
      borderRadius: r(12),
      borderWidth: 1,
      borderColor: '#2a2217',
      marginBottom: r(10),
      padding: r(10),
      gap: r(10),
    },
    cardImg: { width: r(52), height: r(52), borderRadius: r(8), backgroundColor: '#1a1814' },
    cardMid: { flex: 1, minWidth: 0 },
    cardName: { color: '#f4ead8', fontSize: r(14), fontWeight: '700' },
    cardMeta: { color: '#7a6f5f', fontSize: r(11), marginTop: r(4) },
    cardPrice: { color: '#d9b778', fontSize: r(14), fontWeight: '800', marginTop: r(4) },
    cardActions: { justifyContent: 'center', gap: r(6) },
    miniBtn: {
      borderWidth: 1,
      borderColor: '#d2b06b',
      borderRadius: r(8),
      paddingVertical: r(6),
      paddingHorizontal: r(8),
    },
    miniBtnText: { color: '#d2b06b', fontSize: r(11), fontWeight: '800' },
    miniBtnDanger: { borderWidth: 1, borderColor: '#8b4040', borderRadius: r(8), paddingVertical: r(6), paddingHorizontal: r(8) },
    miniBtnDangerText: { color: '#e07070', fontSize: r(11), fontWeight: '800' },
  });
}
