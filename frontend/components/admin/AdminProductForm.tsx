import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export type ProductFormPayload = {
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  descripcion: string;
  descripcionAdicional: string;
  emoji: string;
  imageUris: string[];
};

export type CategoryOption = { id: string; label: string };

type Props = {
  scale: number;
  title: string;
  categories: CategoryOption[];
  initial: ProductFormPayload;
  /** Si false, permite guardar sin fotos nuevas (producto del catalogo con imagen empaquetada). */
  requirePhotos?: boolean;
  onSave: (payload: ProductFormPayload) => void;
  onCancel: () => void;
};

const MAX_PHOTOS = 5;

export function AdminProductForm({
  scale,
  title,
  categories,
  initial,
  requirePhotos = true,
  onSave,
  onCancel,
}: Props) {
  const styles = useMemo(() => createStyles(scale), [scale]);
  const [nombre, setNombre] = useState(initial.nombre);
  const [categoria, setCategoria] = useState(initial.categoria);
  const [precio, setPrecio] = useState(String(initial.precio));
  const [stock, setStock] = useState(String(initial.stock));
  const [descripcion, setDescripcion] = useState(initial.descripcion);
  const [descripcionAdicional, setDescripcionAdicional] = useState(initial.descripcionAdicional);
  const [emoji, setEmoji] = useState(initial.emoji || '✨');
  const [imageUris, setImageUris] = useState<string[]>(initial.imageUris);
  const [catModal, setCatModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permisos', 'Necesitamos acceso a la galeria para las fotos del producto.');
      return;
    }
    const remain = MAX_PHOTOS - imageUris.length;
    if (remain <= 0) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: remain,
      quality: 0.85,
    });
    if (result.canceled || !result.assets?.length) return;
    setImageUris((prev) => [...prev, ...result.assets.map((a) => a.uri)].slice(0, MAX_PHOTOS));
  };

  const removePhoto = (idx: number) => {
    setImageUris((prev) => prev.filter((_, i) => i !== idx));
  };

  const submit = () => {
    if (saving) return;

    const n = nombre.trim();
    if (!n) {
      Alert.alert('Falta el nombre', 'Indica el nombre del producto.');
      return;
    }
    if (!categoria) {
      Alert.alert('Categoria', 'Selecciona una categoria.');
      return;
    }
    const p = parseInt(precio.replace(/\D/g, ''), 10);
    if (!Number.isFinite(p) || p < 0) {
      Alert.alert('Precio', 'Indica un precio valido.');
      return;
    }
    const s = parseInt(stock.replace(/\D/g, ''), 10);
    const stockNum = Number.isFinite(s) && s >= 0 ? s : 0;
    const det = descripcion.trim();
    if (!det) {
      Alert.alert('Contenido del detalle', 'Describe el contenido (items y cantidades).');
      return;
    }
    if (requirePhotos && imageUris.length === 0) {
      Alert.alert('Fotos', 'Agrega al menos una foto del producto.');
      return;
    }

    setSaving(true);
    try {
      onSave({
        nombre: n,
        categoria,
        precio: p,
        stock: stockNum,
        descripcion: det,
        descripcionAdicional: descripcionAdicional.trim(),
        emoji: emoji.trim() || '✨',
        imageUris: [...imageUris],
      });
    } finally {
      setSaving(false);
    }
  };

  const catLabel = categories.find((c) => c.id === categoria)?.label ?? 'Seleccionar...';

  return (
    <View style={styles.wrap}>
      <View style={styles.formHeader}>
        <Text style={styles.formTitle}>{title}</Text>
        <Pressable onPress={onCancel} hitSlop={12} accessibilityRole="button" accessibilityLabel="Cerrar formulario">
          <Text style={styles.formClose}>✕</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.formScroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Nombre del producto *</Text>
        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Ej: Desayuno Sorpresa Premium"
          placeholderTextColor="#5c5348"
        />

        <Text style={styles.label}>Categoria *</Text>
        <Pressable style={styles.selectBtn} onPress={() => setCatModal(true)}>
          <Text style={[styles.selectBtnText, categoria ? styles.selectBtnTextOn : styles.selectBtnTextOff]}>{catLabel}</Text>
          <Text style={styles.selectChev}>▼</Text>
        </Pressable>

        <Text style={styles.label}>Precio ($) *</Text>
        <TextInput
          style={styles.input}
          value={precio}
          onChangeText={setPrecio}
          placeholder="45000"
          placeholderTextColor="#5c5348"
          keyboardType="number-pad"
        />

        <Text style={styles.label}>Stock disponible</Text>
        <TextInput
          style={styles.input}
          value={stock}
          onChangeText={setStock}
          placeholder="1"
          placeholderTextColor="#5c5348"
          keyboardType="number-pad"
        />

        <Text style={styles.label}>Emoji (opcional)</Text>
        <TextInput
          style={styles.input}
          value={emoji}
          onChangeText={setEmoji}
          placeholder="✨"
          placeholderTextColor="#5c5348"
          maxLength={4}
        />

        <Text style={styles.label}>Contenido del detalle (cantidad de cada cosa) *</Text>
        <Text style={styles.hint}>Lista cada item con su cantidad. Usa emojis y formato libre.</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={descripcion}
          onChangeText={setDescripcion}
          placeholder={'🥐 2 Croissants\n🍩 4 Donas glaseadas\n🧃 1 Jugo natural'}
          placeholderTextColor="#5c5348"
          multiline
        />

        <Text style={styles.label}>Descripcion adicional</Text>
        <TextInput
          style={[styles.input, styles.textAreaSm]}
          value={descripcionAdicional}
          onChangeText={setDescripcionAdicional}
          placeholder="Texto para el cliente, presentacion, etc."
          placeholderTextColor="#5c5348"
          multiline
        />

        <Text style={styles.label}>
          Fotos del producto {requirePhotos ? '*' : ''} (max. {MAX_PHOTOS})
        </Text>
        <Text style={styles.hint}>
          {requirePhotos
            ? 'La primera foto es la principal. JPG/PNG desde tu galeria.'
            : 'Este producto ya tiene foto del catalogo. Agrega nuevas solo si quieres cambiarla.'}
        </Text>
        <Pressable style={styles.dropZone} onPress={pickImages}>
          <Text style={styles.dropZoneText}>Toca para elegir imagenes</Text>
          <Text style={styles.dropZoneSub}>Hasta {MAX_PHOTOS} fotos</Text>
        </Pressable>
        {imageUris.length > 0 ? (
          <View style={styles.thumbRow}>
            {imageUris.map((uri, i) => (
              <View key={`${uri}-${i}`} style={styles.thumbWrap}>
                <Image source={{ uri }} style={styles.thumbImg} contentFit="cover" />
                <Pressable onPress={() => removePhoto(i)} style={styles.thumbRemove}>
                  <Text style={styles.thumbRemoveText}>✕</Text>
                </Pressable>
                <Text style={styles.thumbIdx}>{i === 0 ? 'Principal' : `${i + 1}`}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <View style={styles.formActions}>
          <Pressable style={styles.btnOutline} onPress={onCancel}>
            <Text style={styles.btnOutlineText}>Cancelar</Text>
          </Pressable>
          <Pressable style={[styles.btnSolid, saving && styles.btnDisabled]} onPress={submit} disabled={saving}>
            {saving ? (
              <ActivityIndicator color="#1a150e" />
            ) : (
              <Text style={styles.btnSolidText}>Guardar producto</Text>
            )}
          </Pressable>
        </View>
        <View style={{ height: 28 }} />
      </ScrollView>

      <Modal transparent visible={catModal} animationType="fade" onRequestClose={() => setCatModal(false)}>
        <Pressable style={styles.catOverlay} onPress={() => setCatModal(false)}>
          <View style={styles.catSheet}>
            <Text style={styles.catSheetTitle}>Categoria</Text>
            {categories.map((c) => (
              <Pressable
                key={c.id}
                style={styles.catRow}
                onPress={() => {
                  setCategoria(c.id);
                  setCatModal(false);
                }}
              >
                <Text style={styles.catRowText}>{c.label}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

function createStyles(scale: number) {
  const r = (n: number) => Math.round(n * scale);
  return StyleSheet.create({
    wrap: { flex: 1, backgroundColor: '#0a0a0a' },
    formHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: r(4),
      paddingBottom: r(12),
      borderBottomWidth: 1,
      borderBottomColor: '#2a2217',
    },
    formTitle: { color: '#fff', fontSize: r(20), fontWeight: '800', flex: 1 },
    formClose: { color: '#9c8f7b', fontSize: r(22), padding: r(4) },
    formScroll: { flex: 1, paddingTop: r(14) },
    label: { color: '#f4ead8', fontSize: r(15), fontWeight: '700', marginTop: r(14) },
    hint: { color: '#7a6f5f', fontSize: r(12), marginTop: r(4), lineHeight: r(17) },
    input: {
      marginTop: r(8),
      borderWidth: 1,
      borderColor: '#5c4d32',
      borderRadius: r(12),
      paddingVertical: r(12),
      paddingHorizontal: r(14),
      fontSize: r(15),
      color: '#f4ead8',
      backgroundColor: '#141210',
    },
    textArea: { minHeight: r(120), textAlignVertical: 'top' },
    textAreaSm: { minHeight: r(72), textAlignVertical: 'top' },
    selectBtn: {
      marginTop: r(8),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: '#5c4d32',
      borderRadius: r(12),
      paddingVertical: r(14),
      paddingHorizontal: r(14),
      backgroundColor: '#141210',
    },
    selectBtnText: { fontSize: r(15), flex: 1 },
    selectBtnTextOn: { color: '#f4ead8' },
    selectBtnTextOff: { color: '#5c5348' },
    selectChev: { color: '#d2b06b', fontSize: r(12) },
    dropZone: {
      marginTop: r(10),
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: '#5c4d32',
      borderRadius: r(14),
      paddingVertical: r(28),
      paddingHorizontal: r(16),
      alignItems: 'center',
      backgroundColor: '#0f0d0a',
    },
    dropZoneText: { color: '#c9bba8', fontSize: r(15), fontWeight: '600' },
    dropZoneSub: { color: '#6a6054', fontSize: r(12), marginTop: r(6) },
    thumbRow: { flexDirection: 'row', flexWrap: 'wrap', gap: r(8), marginTop: r(10) },
    thumbWrap: {
      width: r(72),
      height: r(72),
      borderRadius: r(10),
      backgroundColor: '#1a1814',
      borderWidth: 1,
      borderColor: '#3d3427',
      overflow: 'hidden',
    },
    thumbImg: { width: '100%', height: '100%' },
    thumbRemove: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.55)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    thumbRemoveText: { color: '#fff', fontSize: r(18), fontWeight: '700' },
    thumbIdx: { color: '#9c8f7b', fontSize: r(10) },
    formActions: { flexDirection: 'row', gap: r(10), marginTop: r(24) },
    btnOutline: {
      flex: 1,
      borderWidth: 1,
      borderColor: '#d2b06b',
      borderRadius: r(12),
      paddingVertical: r(14),
      alignItems: 'center',
    },
    btnOutlineText: { color: '#d2b06b', fontWeight: '800', fontSize: r(15) },
    btnSolid: {
      flex: 1,
      backgroundColor: '#d2b06b',
      borderRadius: r(12),
      paddingVertical: r(14),
      alignItems: 'center',
    },
    btnSolidText: { color: '#1a150e', fontWeight: '800', fontSize: r(15) },
    btnDisabled: { opacity: 0.65 },
    catOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.55)',
      justifyContent: 'flex-end',
      padding: r(16),
    },
    catSheet: {
      backgroundColor: '#171514',
      borderRadius: r(16),
      borderWidth: 1,
      borderColor: '#3d3427',
      paddingVertical: r(8),
      maxHeight: '70%',
    },
    catSheetTitle: {
      color: '#f4ead8',
      fontSize: r(16),
      fontWeight: '700',
      paddingHorizontal: r(16),
      paddingVertical: r(10),
    },
    catRow: { paddingVertical: r(14), paddingHorizontal: r(16), borderTopWidth: 1, borderTopColor: '#2a2217' },
    catRowText: { color: '#e8dcc8', fontSize: r(16) },
  });
}
