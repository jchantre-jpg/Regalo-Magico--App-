/**
 * Scroll anclado por secciones (inicio, categorías, productos, etc.).
 * Guarda la posición Y de cada bloque al hacer layout y hace scroll suave al menú.
 */
import { useRef, useState } from 'react';
import type { ScrollView } from 'react-native';

import type { SectionKey } from '../types/store';

/** Valores por defecto hasta que onLayout reporte posiciones reales. */
const DEFAULT_OFFSETS: Record<SectionKey, number> = {
  inicio: 0,
  categorias: 280,
  productos: 560,
  como: 980,
  contacto: 1260,
};

/** Expone ref del ScrollView, registro de offsets y scroll por sección del menú. */
export function useSectionScroll() {
  const scrollRef = useRef<ScrollView>(null);
  const [sectionOffsets, setSectionOffsets] = useState<Record<SectionKey, number>>(DEFAULT_OFFSETS);

  /** Registra la posición Y medida por onLayout de cada sección. */
  const saveOffset = (key: SectionKey, y: number) => {
    setSectionOffsets((prev) => ({ ...prev, [key]: y }));
  };

  /** Desplaza el ScrollView dejando margen bajo la barra superior. */
  const scrollToSection = (key: SectionKey) => {
    // 72px ≈ altura de TopNav para no tapar el título de la sección
    scrollRef.current?.scrollTo({ y: Math.max(0, sectionOffsets[key] - 72), animated: true });
  };

  // scrollRef → ScrollView en App; saveOffset en onLayout de cada sección
  return { scrollRef, saveOffset, scrollToSection };
}
// scrollRef → ScrollView en App; saveOffset en onLayout de cada sección
