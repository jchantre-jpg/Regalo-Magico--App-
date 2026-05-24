/**
 * Imagen de producto con fallback a emoji si falla la carga (expo-image).
 */
import { useState } from 'react';
import {
  ActivityIndicator,
  Text,
  View,
  type ImageProps,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Image } from 'expo-image';

type Props = {
  /** require() local o { uri } remota / galería. */
  source: ImageSourcePropType;
  /** Se muestra si la imagen no carga. */
  emoji?: string;
  style?: ImageProps['style'];
  containerStyle?: StyleProp<ViewStyle>;
  resizeMode?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
};

/** Muestra imagen con spinner de carga y fallback a emoji si falla. */
export function ProductImage({
  source,
  emoji = '🎁',
  style,
  containerStyle,
  resizeMode = 'cover',
}: Props) {
  const [failed, setFailed] = useState(false);
  /** Spinner mientras expo-image carga URI o asset local. */
  const [loading, setLoading] = useState(false);

  // Si la URI o el asset fallan, mostramos el emoji del producto
  if (failed) {
    return (
      <View
        style={[
          containerStyle,
          style,
          { backgroundColor: '#2a241c', justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <Text style={{ fontSize: 28 }}>{emoji}</Text>
      </View>
    );
  }
  return (
    <View style={containerStyle}>
      {loading ? (
        <View
          style={[
            style,
            {
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#231f17',
              zIndex: 1,
            },
          ]}
        >
          <ActivityIndicator color="#d2b06b" size="small" />
        </View>
      ) : null}
      <Image
        source={source}
        style={style}
        contentFit={resizeMode}
        transition={120}
        onLoadStart={() => setLoading(true)}
        onLoad={() => {
          setLoading(false);
          setFailed(false);
        }}
        onError={() => {
          setLoading(false);
          setFailed(true);
        }}
      />
    </View>
  );
}
