/**
 * Escala y estilos según ancho de pantalla (móvil / tablet).
 */
import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

import { createAppStyles } from '../../frontend/styles/appStyles';
import { clamp } from '../utils/clamp';

/** Devuelve escala, flags de pantalla y StyleSheet memoizado para toda la tienda. */
export function useResponsiveLayout() {
  const { width } = useWindowDimensions();
  /** Teléfonos muy estrechos (< 360px): tipografía más compacta en createAppStyles. */
  const isSmallScreen = width < 360;
  const isTablet = width >= 768; // Ajustes de grid en createAppStyles
  /** Escala tipografía y espaciados según ancho (referencia 390px). */
  const scale = clamp(width / 390, 0.78, 1.14);

  // Recrear estilos solo si cambia el ancho o la escala derivada
  const styles = useMemo(
    () => createAppStyles(scale, isSmallScreen, isTablet, width),
    [scale, isSmallScreen, isTablet, width]
  );

  return { width, scale, isSmallScreen, isTablet, styles };
}
