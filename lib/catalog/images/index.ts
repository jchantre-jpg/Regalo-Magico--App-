/** Generado por scripts/generate-catalog.mjs */
import type { ImageSourcePropType } from 'react-native';

import images0 from './chunk-01';
import images1 from './chunk-02';
import images2 from './chunk-03';
import images3 from './chunk-04';
import images4 from './chunk-05';
import images5 from './chunk-06';

const FALLBACK = require("../../../assets/icon.png") as ImageSourcePropType;

const ALL_IMAGES: Record<number, ImageSourcePropType> = {
  ...images0,
  ...images1,
  ...images2,
  ...images3,
  ...images4,
  ...images5,
};

export function getCatalogImage(id: number): ImageSourcePropType {
  return ALL_IMAGES[id] ?? FALLBACK;
}
