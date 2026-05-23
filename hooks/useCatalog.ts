import { useEffect, useMemo, useState } from 'react';

import { mergeCatalog } from '../lib/admin-merge';
import { emptyAdminPersist, loadAdminData, type AdminPersisted } from '../lib/admin-storage';
import { resolveCatalogMode } from '../lib/api-config';
import { fetchCatalogProducts } from '../lib/catalog-api';
import { PRODUCTOS, type CatalogProduct } from '../lib/catalog.generated';
import { mergeRemoteWithLocalCatalog, resolveCatalogImages, resolveProductImage } from '../lib/product-images';

const remoteCatalogConfig = resolveCatalogMode();
const PAGE_SIZE = 60;

export function useCatalog() {
  const [adminPersist, setAdminPersist] = useState<AdminPersisted>(() => emptyAdminPersist());
  const [catalogBase, setCatalogBase] = useState<CatalogProduct[]>(() => PRODUCTOS);
  const [catalogLoading, setCatalogLoading] = useState(() => remoteCatalogConfig.useRemote);

  const [categoriaActiva, setCategoriaActiva] = useState('todos');
  const [visibleProductCount, setVisibleProductCount] = useState(PAGE_SIZE);

  useEffect(() => {
    let mounted = true;
    loadAdminData().then((d) => {
      if (mounted) setAdminPersist(d);
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!remoteCatalogConfig.useRemote) return;

    let alive = true;
    fetchCatalogProducts(remoteCatalogConfig.apiBase, remoteCatalogConfig.imageBase)
      .then((rows) => {
        if (alive && rows.length > 0) {
          setCatalogBase(mergeRemoteWithLocalCatalog(rows));
        }
      })
      .catch(() => {})
      .finally(() => {
        if (alive) setCatalogLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    setVisibleProductCount(PAGE_SIZE);
  }, [categoriaActiva]);

  const productosCatalogo = useMemo(() => {
    const base = resolveCatalogImages(catalogBase);
    return mergeCatalog(base, adminPersist).map((p) => resolveProductImage(p));
  }, [catalogBase, adminPersist]);

  const productosFiltrados = useMemo(() => {
    if (categoriaActiva === 'todos') return productosCatalogo;
    return productosCatalogo.filter((p) => p.categoria === categoriaActiva);
  }, [categoriaActiva, productosCatalogo]);

  const productosVisibles = useMemo(
    () => productosFiltrados.slice(0, visibleProductCount),
    [productosFiltrados, visibleProductCount]
  );

  const restantesCatalogo = productosFiltrados.length - productosVisibles.length;

  const loadMoreProducts = () => {
    setVisibleProductCount((n) => Math.min(n + PAGE_SIZE, productosFiltrados.length));
  };

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
