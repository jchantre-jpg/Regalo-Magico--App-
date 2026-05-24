import AsyncStorage from '@react-native-async-storage/async-storage';

export const ADMIN_STORAGE_KEY = '@regalo_magico_admin_v2';

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

export type AdminPersisted = {
  overrides: Record<string, ProductOverride>;
  customProducts: CustomProductRecord[];
  deletedIds: number[];
};

export function emptyAdminPersist(): AdminPersisted {
  return { overrides: {}, customProducts: [], deletedIds: [] };
}

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

export async function saveAdminData(data: AdminPersisted): Promise<void> {
  const clean = sanitize(data);
  await AsyncStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(clean));
}

export async function loadAdminData(): Promise<AdminPersisted> {
  try {
    const raw = await AsyncStorage.getItem(ADMIN_STORAGE_KEY);
    if (!raw) return emptyAdminPersist();
    const parsed = JSON.parse(raw) as Partial<AdminPersisted>;
    return sanitize(parsed);
  } catch {
    return emptyAdminPersist();
  }
}
