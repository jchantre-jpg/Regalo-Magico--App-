/**
 * Persistencia local del panel admin (AsyncStorage).
 * Guarda overrides, productos creados en app y IDs eliminados del catálogo empaquetado.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

/** Clave única en AsyncStorage para datos del panel admin. */
export const ADMIN_STORAGE_KEY = '@regalo_magico_admin_v2';

/** Cambios parciales sobre un producto del catálogo original (sin duplicar el objeto entero). */
export type ProductOverride = {
  nombre?: string;
  categoria?: string;
  precio?: number;
  emoji?: string;
  descripcion?: string;
  descripcionAdicional?: string;
  stock?: number;
  imageUris?: string[];
};

/** Producto creado desde cero en el admin (no existe en catalog.generated). */
export type CustomProductRecord = {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  emoji: string;
  descripcion: string;
  descripcionAdicional: string;
  stock: number;
  imageUris: string[];
};

/** Estado completo que se serializa en el dispositivo. */
export type AdminPersisted = {
  overrides: Record<string, ProductOverride>;
  customProducts: CustomProductRecord[];
  deletedIds: number[];
};

/** Estado inicial vacío del admin (sin overrides ni customs). */
export function emptyAdminPersist(): AdminPersisted {
  return { overrides: {}, customProducts: [], deletedIds: [] };
}

/** Limpia arrays vacíos e IDs inválidos antes de guardar o después de leer. */
function sanitize(data: Partial<AdminPersisted>): AdminPersisted {
  return {
    overrides: data.overrides ?? {},
    customProducts: (data.customProducts ?? []).map((c) => ({
      ...c,
      imageUris: Array.isArray(c.imageUris) ? c.imageUris.filter(Boolean) : [],
    })),
    deletedIds: [...new Set((data.deletedIds ?? []).filter((id) => Number.isFinite(id)))],
  };
}

/** Persiste el estado del admin en el dispositivo (JSON en AsyncStorage). */
export async function saveAdminData(data: AdminPersisted): Promise<void> {
  const clean = sanitize(data);
  await AsyncStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(clean));
}

/** Lee y sanitiza datos del admin; devuelve vacío si no hay o hay error. */
export async function loadAdminData(): Promise<AdminPersisted> {
  try {
    const raw = await AsyncStorage.getItem(ADMIN_STORAGE_KEY);
    if (!raw) return emptyAdminPersist();
    const parsed = JSON.parse(raw) as Partial<AdminPersisted>;
    return sanitize(parsed);
  } catch {
    // JSON corrupto o clave antigua: empezar con estado vacío
    return emptyAdminPersist();
  }
}
