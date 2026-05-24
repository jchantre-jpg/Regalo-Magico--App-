/**
 * Hook del catálogo: carga base local/remota, merge con admin y paginación por categoría.
 */
import { useEffect, useMemo, useState } from 'react';

import { mergeCatalog } from '../lib/admin-merge';
import { emptyAdminPersist, loadAdminData, type AdminPersisted } from '../../database/admin-storage';
import { resolveCatalogMode } from '../lib/api-config';
import { fetchCatalogProducts } from '../lib/catalog-api';
import { PRODUCTOS, type CatalogProduct } from '../../database/catalog.generated';
import { mergeRemoteWithLocalCatalog, resolveCatalogImages, resolveProductImage } from '../lib/product-images';

/** Lee .env una vez al cargar el módulo (modo local vs API remoto). */
const remoteCatalogConfig = resolveCatalogMode();

/** Productos mostrados por página en el grid (botón "Cargar más"). */
const PAGE_SIZE = 60;

/** Catálogo visible, filtro por categoría, paginación y persistencia admin. */
export function useCatalog() {
  /** Overrides, customs y eliminados (AsyncStorage). */
  const [adminPersist, setAdminPersist] = useState<AdminPersisted>(() => emptyAdminPersist());
  /** Catálogo base antes del merge admin (local o remoto). */
  const [catalogBase, setCatalogBase] = useState<CatalogProduct[]>(() => PRODUCTOS);
  /** true solo mientras se descarga catálogo remoto (pantalla CatalogLoadingScreen). */
  /** true solo mientras se descarga el catálogo remoto (pantalla CatalogLoadingScreen). */
  const [catalogLoading, setCatalogLoading] = useState(() => remoteCatalogConfig.useRemote);
  /** Filtro activo; "todos" muestra el catálogo completo. */
  const [categoriaActiva, setCategoriaActiva] = useState('todos');
  /** Cuántos productos del filtro actual se muestran (paginación). */
  const [visibleProductCount, setVisibleProductCount] = useState(PAGE_SIZE);

  // Cargar cambios del admin guardados en el dispositivo
  useEffect(() => {
    let mounted = true;
    loadAdminData().then((d) => {
      if (mounted) setAdminPersist(d);
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Opcional: catálogo desde API (EXPO_PUBLIC_USE_REMOTE_CATALOG=true)
  useEffect(() => {
    if (!remoteCatalogConfig.useRemote) return;

    let alive = true;
    fetchCatalogProducts(remoteCatalogConfig.apiBase, remoteCatalogConfig.imageBase)
      .then((rows) => {
        if (alive && rows.length > 0) {
          setCatalogBase(mergeRemoteWithLocalCatalog(rows));
        }
      })
      .catch(() => {}) // Si falla el API, se queda el catálogo empaquetado PRODUCTOS
      .finally(() => {
        if (alive) setCatalogLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  // Al cambiar categoría, volver a mostrar la primera página
  useEffect(() => {
    setVisibleProductCount(PAGE_SIZE);
  }, [categoriaActiva]);

  /** Catálogo final: imágenes resueltas + merge admin. */
  const productosCatalogo = useMemo(() => {
    const base = resolveCatalogImages(catalogBase);
    return mergeCatalog(base, adminPersist).map((p) => resolveProductImage(p));
  }, [catalogBase, adminPersist]);

  /** Subconjunto según categoría activa ("todos" = sin filtrar). */
  const productosFiltrados = useMemo(() => {
    if (categoriaActiva === 'todos') return productosCatalogo;
    return productosCatalogo.filter((p) => p.categoria === categoriaActiva);
  }, [categoriaActiva, productosCatalogo]);

  /** Slice paginado que renderiza ProductCatalogSection. */
  const productosVisibles = useMemo(
    () => productosFiltrados.slice(0, visibleProductCount),
    [productosFiltrados, visibleProductCount]
  );

  /** Cuántos productos quedan por cargar con "Cargar más". */
  const restantesCatalogo = productosFiltrados.length - productosVisibles.length;

  /** Muestra el siguiente bloque de productos (paginación en UI). */
  const loadMoreProducts = () => {
    setVisibleProductCount((n) => Math.min(n + PAGE_SIZE, productosFiltrados.length));
  };

  // API pública del hook (consumida por App.tsx)
  return {
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
  };
}
