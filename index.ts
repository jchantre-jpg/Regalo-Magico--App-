/**
 * Punto de entrada Expo.
 * Envuelve la app en SafeAreaProvider para respetar notch y barras del sistema.
 */
import { registerRootComponent } from 'expo';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import App from './frontend/App';

/** Componente raíz registrado por Expo (provider + App). */
function Root() {
  return React.createElement(SafeAreaProvider, null, React.createElement(App, null));
}

// Expo monta Root en lugar de App directamente (necesita SafeAreaProvider)
registerRootComponent(Root);
