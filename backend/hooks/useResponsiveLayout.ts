import { useMemo } from 'react';

import { useWindowDimensions } from 'react-native';



import { createAppStyles } from '../../frontend/styles/appStyles';

import { clamp } from '../utils/clamp';



export function useResponsiveLayout() {

  const { width } = useWindowDimensions();

  const isSmallScreen = width < 360;

  const isTablet = width >= 768;

  const scale = clamp(width / 390, 0.78, 1.14);

  const styles = useMemo(

    () => createAppStyles(scale, isSmallScreen, isTablet, width),

    [scale, isSmallScreen, isTablet, width]

  );



  return { width, scale, isSmallScreen, isTablet, styles };

}

