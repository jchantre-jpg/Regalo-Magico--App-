# Regalo Mágico — App móvil (Expo Go)

Tienda de regalos para comprar por WhatsApp. Proyecto Expo SDK 54.

**Rama de desarrollo:** `dev-juliana-chantre`

## Ejecutar con Expo Go

```bash
npm install
npm run start:lan
```

Escanea el QR con **Expo Go** (misma red Wi‑Fi que el PC).

## Estructura del proyecto

```
regalo-magico-app/
├── frontend/      # UI (componentes, estilos, App.tsx)
├── backend/       # Lógica (hooks, API, utils, types)
├── database/      # Datos locales (AsyncStorage, catálogo)
├── docs/          # Documentación
├── scripts/       # Scripts npm
└── assets/        # Imágenes Expo
```

| Carpeta | Descripción |
|---------|-------------|
| [frontend/](./frontend/) | Pantallas y componentes React Native |
| [backend/](./backend/) | Custom hooks, servicios, utilidades |
| [database/](./database/) | Persistencia y catálogo empaquetado |
| [docs/](./docs/) | Estructura y material de clases |

Más detalle: [docs/ESTRUCTURA-CARPETAS.md](./docs/ESTRUCTURA-CARPETAS.md)

## Catálogo

```bash
npm run generate-catalog
```

- Copia fotos de `../regalo-magico/public/imagenes` → `assets/catalog/`
- Metadatos desde `../regalo-magico/src/data/catalog.ts`
- Genera `database/catalog.generated.ts`
- Ajustes de texto: `database/product-copy-overrides.json`

## Variables de entorno (opcional)

Copia `.env.example` a `.env` si usas catálogo remoto.

## Documentación

- [Estructura de carpetas](./docs/ESTRUCTURA-CARPETAS.md)
- [Uso del material de clases](./docs/uso-de-material-de-clases.md)
