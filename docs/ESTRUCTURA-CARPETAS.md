# Estructura de carpetas — Regalo Mágico App

La app se organiza en **frontend**, **backend** y **database**. En la raíz solo queda lo que **Expo y npm requieren**.

```
regalo-magico-app/
│
├── frontend/                    # Interfaz (UI)
│   ├── App.tsx
│   ├── components/
│   │   ├── admin/
│   │   ├── cart/
│   │   ├── catalog/
│   │   ├── common/
│   │   ├── home/
│   │   ├── layout/
│   │   └── product/
│   └── styles/
│       └── appStyles.ts
│
├── backend/                     # Lógica y servicios
│   ├── hooks/
│   ├── lib/
│   │   ├── admin-config.ts
│   │   ├── admin-merge.ts
│   │   ├── api-config.ts
│   │   ├── catalog-api.ts
│   │   └── product-images.ts
│   ├── constants/
│   ├── types/
│   └── utils/
│
├── database/                    # Datos locales
│   ├── admin-storage.ts
│   ├── catalog.generated.ts
│   └── product-copy-overrides.json
│
├── docs/                        # Documentación (no afecta la app)
│   ├── ESTRUCTURA-CARPETAS.md
│   └── uso-de-material-de-clases.md
│
├── scripts/                     # Herramientas npm
│   ├── generate-catalog.mjs
│   ├── start-expo-lan.mjs
│   └── fix-imports-structure.mjs
│
├── assets/                      # Iconos, splash, fotos catálogo
│   └── catalog/
│
├── index.ts                     # Entrada Expo
├── app.json
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## Qué va en cada capa

| Carpeta | Rol | Contenido |
|---------|-----|-----------|
| **frontend** | Interfaz | Componentes, estilos, `App.tsx` |
| **backend** | Lógica | Hooks, API, merge, utilidades, tipos |
| **database** | Datos | AsyncStorage + catálogo generado + overrides de texto |
| **docs** | Documentación | Guías para clase y evaluación |
| **scripts** | Automatización | Generar catálogo, arrancar Expo en LAN |
| **assets** | Recursos Expo | Imágenes empaquetadas en la app |

## Raíz mínima (obligatorio)

| Archivo | Motivo |
|---------|--------|
| `index.ts` | Punto de entrada (`package.json` → `"main"`) |
| `app.json` | Configuración Expo (icono, splash, permisos) |
| `package.json` | Dependencias y scripts |
| `tsconfig.json` | TypeScript |
| `.env.example` | Variables opcionales (catálogo remoto) |
| `README.md` | Instrucciones rápidas |

## Flujo de datos

1. **database** — Catálogo base y persistencia del admin en el teléfono.
2. **backend** — Combina datos, carrito, API opcional.
3. **frontend** — Pantallas y acciones del usuario.

## Comandos

```bash
npm install
npm run start:lan
npm run generate-catalog
```
