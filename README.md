# Regalo Mágico — App móvil (Expo Go)

Tienda de regalos para comprar por WhatsApp. Proyecto Expo SDK 54.

**Rama de desarrollo:** `dev-juliana-chantre`

## Ejecutar con Expo Go

```bash
npm install
npm run start:lan
```

Escanea el QR con **Expo Go** (misma red Wi‑Fi que el PC).

## Estructura

```
├── App.tsx                 # Pantalla principal
├── components/             # UI por sección
├── hooks/                  # Carrito, catálogo, layout, scroll
├── lib/                    # API, catálogo, admin
├── constants/
├── types/
├── styles/
└── utils/
```

## Catálogo

```bash
npm run generate-catalog
```

- Copia todas las fotos de `../regalo-magico/public/imagenes` a `assets/catalog/`
- Usa **título, precio, categoría y descripción** de `../regalo-magico/src/data/catalog.ts` (igual que la web)
- Genera `lib/catalog.generated.ts` con imágenes empaquetadas (funciona sin internet)
- Ajustes extra por archivo: `product-copy-overrides.json`

## Variables de entorno (opcional)

Copia `.env.example` a `.env` si usas catálogo remoto.
