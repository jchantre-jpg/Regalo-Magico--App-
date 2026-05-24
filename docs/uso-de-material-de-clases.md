# Uso del material de clases — Regalo Mágico App (móvil)

Relación entre **conceptos de clase** y **código de `regalo-magico-app`**, con **archivo y líneas** para ubicar cada cosa en el editor.

| | |
|---|---|
| **Proyecto** | `regalo-magico-app` |
| **Estructura** | `frontend/` · `backend/` · `database/` · `docs/` — ver `docs/ESTRUCTURA-CARPETAS.md` |
| **Ejecutar en celular** | `npm run start:lan` → ver `package.json` L7 y `scripts/start-expo-lan.mjs` |
| **Admin** | `backend/lib/admin-config.ts` L2–3 (`admin` / `regalo2026`) |

> Las líneas (**L**) pueden variar un poco si editas el archivo; usa Ctrl+G en VS Code para ir directo.

---

## 1. React Hooks (`useState`, `useEffect` y otros)

| Hook / patrón | Para qué se usa en la app | Archivo · líneas |
|---------------|---------------------------|------------------|
| **`useState`** — carrito | Lista de ítems y modal visible | `backend/hooks/useCart.ts` · L13–15 |
| **`useState`** — modales UI | Detalle, menú, admin | `frontend/App.tsx` · L109–113 |
| **`useState`** — catálogo / filtros | Categoría, paginación, persist admin | `backend/hooks/useCatalog.ts` · L14–19 |
| **`useState`** — login / lista admin | Fase, usuario, búsqueda, formulario | `frontend/components/admin/AdminPanel.tsx` · L97–101 |
| **`useState`** — formulario producto | Campos nombre, precio, fotos, etc. | `frontend/components/admin/AdminProductForm.tsx` · L52–61 |
| **`useState`** — carga de imagen | Error y loading de foto | `frontend/components/common/ProductImage.tsx` · L28–29 |
| **`useState`** — offsets de scroll | Posición Y de cada sección | `backend/hooks/useSectionScroll.ts` · L31 |
| **`useEffect`** — cargar admin al iniciar | `loadAdminData` → estado | `backend/hooks/useCatalog.ts` · L21–29 |
| **`useEffect`** — API catálogo remoto | `fetchCatalogProducts` | `backend/hooks/useCatalog.ts` · L31–49 |
| **`useEffect`** — reset “cargar más” | Al cambiar categoría | `backend/hooks/useCatalog.ts` · L51–53 |
| **`useEffect`** — reset panel admin | Volver a login al abrir | `frontend/components/admin/AdminPanel.tsx` · L105–114 |
| **`useEffect`** — barra Android admin | `expo-navigation-bar` | `frontend/components/admin/AdminModal.tsx` · L41–54 |
| **`useMemo`** — total y cantidad carrito | Suma precios e ítems | `backend/hooks/useCart.ts` · L19–21 |
| **`useMemo`** — catálogo fusionado | Merge + imágenes | `backend/hooks/useCatalog.ts` · L55–67 |
| **`useMemo`** — productos filtrados | Por categoría | `backend/hooks/useCatalog.ts` · L60–63 |
| **`useMemo`** — estilos responsive | `createAppStyles(scale)` | `backend/hooks/useResponsiveLayout.ts` · L23–28 |
| **`useMemo`** — búsqueda admin | Filtrar lista productos | `frontend/components/admin/AdminPanel.tsx` · L138–148 |
| **`useMemo`** — estilos form admin | `createStyles(scale)` | `frontend/components/admin/AdminProductForm.tsx` · L51 · `AdminPanel.tsx` · L103 |
| **`useRef`** — `ScrollView` | Saltar a secciones | `backend/hooks/useSectionScroll.ts` · L29, L44–46 |

---

## 2. Custom Hooks

| Custom Hook | Responsabilidad | Definido en | Usado en |
|-------------|-----------------|-------------|----------|
| **`useCatalog`** | Catálogo, filtros, admin, API | `backend/hooks/useCatalog.ts` · L13–87 | `frontend/App.tsx` · L59–81 |
| **`useCart`** | Carrito y pedido WhatsApp | `backend/hooks/useCart.ts` · L11–117 | `frontend/App.tsx` · L83–105 |
| **`useResponsiveLayout`** | Escala y `styles` | `backend/hooks/useResponsiveLayout.ts` · L13–35 | `frontend/App.tsx` · L53 |
| **`useSectionScroll`** | Scroll entre secciones | `backend/hooks/useSectionScroll.ts` · L27–52 | `frontend/App.tsx` · L55 |
| **`useWhatsApp`** | Abrir contacto | `backend/hooks/useWhatsApp.ts` · L7–15 | `frontend/App.tsx` · L57 |

| Patrón | Ejemplo con líneas |
|--------|-------------------|
| Hook retorna estado + acciones | `useCart.ts` · L95–116 (`return { cart, addToCart, ... }`) |
| Desestructuración en `App` | `frontend/App.tsx` · L59–81 (`useCatalog`), L83–105 (`useCart`) |

---

## 3. Props

| Uso de Props | Ejemplo en la app | Archivo · líneas |
|--------------|-------------------|------------------|
| Interface `Props` | Contrato del componente | Ver tabla abajo |
| Pasar productos y callbacks | Catálogo desde `App` | `frontend/App.tsx` · L251–258 |
| Pasar categoría activa | Filtro de grid | `frontend/App.tsx` · L229–243 |
| Pasar carrito al modal | Estado del pedido | `frontend/App.tsx` · L301–319 |
| Pasar persist admin | Guardar cambios | `frontend/App.tsx` · L343–352 |
| Props opcionales `?` | `requirePhotos?` | `frontend/components/admin/AdminProductForm.tsx` · L35 |
| Props opcionales `?` | `emoji?` en imagen | `frontend/components/common/ProductImage.tsx` · L15 |
| Valor por defecto en props | `requirePhotos = true` | `AdminProductForm.tsx` · L47 |
| Desestructuración `({ ... }: Props)` | FAB WhatsApp | `frontend/components/layout/WhatsAppFab.tsx` · L7–17, L21 |
| Desestructuración en carrito | Modal carrito | `frontend/components/cart/CartModal.tsx` · L11–30, L35–53 |

**Interfaces `Props` por componente (línea donde empieza el tipo):**

| Componente | Archivo · línea `Props` |
|------------|-------------------------|
| `WhatsAppFab` | `frontend/components/layout/WhatsAppFab.tsx` · L7 |
| `ProductCatalogSection` | `frontend/components/catalog/ProductCatalogSection.tsx` · L7 |
| `CategoryGrid` | `frontend/components/catalog/CategoryGrid.tsx` · L9 |
| `CartModal` | `frontend/components/cart/CartModal.tsx` · L11 |
| `ProductDetailModal` | `frontend/components/product/ProductDetailModal.tsx` · L8 |
| `AdminPanel` | `frontend/components/admin/AdminPanel.tsx` · L36 |
| `AdminModal` | `frontend/components/admin/AdminModal.tsx` · L16 |
| `AdminProductForm` | `frontend/components/admin/AdminProductForm.tsx` · L29 |
| `HeroSection` | `frontend/components/home/HeroSection.tsx` · L5 |
| `ContactSection` | `frontend/components/home/ContactSection.tsx` · L5 |
| `TopNav` | `frontend/components/layout/TopNav.tsx` · L7 |
| `NavMenu` | `frontend/components/layout/NavMenu.tsx` · L5 |
| `ProductImage` | `frontend/components/common/ProductImage.tsx` · L13 |

---

## 4. Componentes React y JSX (`.tsx`)

| Concepto | Dónde se utiliza | Archivo · líneas |
|----------|------------------|------------------|
| Componente raíz | Pantalla tienda | `frontend/App.tsx` · L49–357 |
| Importar hijos en raíz | Hero, catálogo, modales | `frontend/App.tsx` · L11–33 |
| `export default function App` | Entrada app | `frontend/App.tsx` · L49 |
| Hero | Banner inicio | `frontend/App.tsx` · L221 · `frontend/components/home/HeroSection.tsx` |
| Interpolación `{item.nombre}` | Nombre y precio | `ProductCatalogSection.tsx` · L41–49 |
| Contador en barra carrito | Badge cantidad | `frontend/App.tsx` (barra carrito, buscar `cartItemsCount`) |
| Contenedor `View` | Secciones sin HTML | `frontend/App.tsx` · L207–279 (`ScrollView` interno) |

---

## 5. TypeScript — tipos básicos, listas e interfaces

| Concepto | Dónde se utiliza | Archivo · líneas |
|----------|------------------|------------------|
| `string` / `number` en estado | Precio, stock como texto en form | `AdminProductForm.tsx` · L54–55 |
| `boolean` en estado | Modales, saving, loading imagen | `frontend/App.tsx` · L111–113 · `ProductImage.tsx` · L28–29 |
| Lista `CartItem[]` | Carrito | `backend/hooks/useCart.ts` · L13 |
| Lista `string[]` fotos | URIs en admin | `AdminProductForm.tsx` · L59 · `database/admin-storage.ts` · L13, L25 |
| Lista categorías `Categoria[]` | Constantes | `backend/constants/categories.ts` · L5–21 |
| Acceso `arr[0]` imagen principal | Merge catálogo | `backend/lib/admin-merge.ts` · L46, L66 |
| `CartItem` | Producto + cantidad | `backend/types/store.ts` · L11 |
| `SectionKey` (unión) | Secciones scroll | `backend/types/store.ts` · L15 |
| `ProductOverride` | Edición producto catálogo | `database/admin-storage.ts` · L5–14 |
| `CustomProductRecord` | Producto nuevo admin | `database/admin-storage.ts` · L16–26 |
| `AdminPersisted` | Todo lo guardado local | `database/admin-storage.ts` · L28–32 |
| `CatalogProduct` | Catálogo generado | `database/catalog.generated.ts` (archivo completo) |
| `ProductFormPayload` | Envío formulario | `AdminProductForm.tsx` · L16–25 |

---

## 6. Arrays — `.map()`, `.filter()`, `.join()`

| Método | Para qué | Archivo · líneas |
|--------|----------|------------------|
| **`.map()`** productos en grid | Render tarjetas | `ProductCatalogSection.tsx` · L31–60 |
| **`.map()`** categorías | Tarjetas categoría | `CategoryGrid.tsx` · L31–49 |
| **`.map()`** líneas carrito | Modal pedido | `CartModal.tsx` · L85–140 |
| **`.map()`** fotos formulario | Miniaturas | `AdminProductForm.tsx` · L223–232 |
| **`.map()`** merge catálogo | Base + overrides | `backend/lib/admin-merge.ts` · L26–28 |
| **`.map()`** en carrito (cantidad) | Actualizar ítem | `backend/hooks/useCart.ts` · L33–35, L73 |
| **`.filter()`** sin “todos” | Grid categorías | `CategoryGrid.tsx` · L31 |
| **`.filter()`** eliminados | IDs en `deletedIds` | `backend/lib/admin-merge.ts` · L26 |
| **`.filter()`** carrito qty 0 | Quitar línea | `backend/hooks/useCart.ts` · L55, L67, L81 |
| **`.filter()`** por categoría | Productos visibles | `backend/hooks/useCatalog.ts` · L62 |
| **`.filter()`** búsqueda admin | Lista admin | `AdminPanel.tsx` · L141–147 |
| **`.join()`** mensaje WhatsApp | Texto del pedido | `backend/utils/whatsapp.ts` · L15 |
| **`.join()`** compartir resumen | Admin compartir | `AdminPanel.tsx` · L267 |

---

## 7. Operador ternario y renderizado condicional

| Uso | Dónde | Archivo · líneas |
|-----|-------|------------------|
| Categoría activa (estilo) | `&&` en array de estilos | `CategoryGrid.tsx` · L37 |
| Título Nuevo / Editar | Ternario en título | `AdminPanel.tsx` · L322 (buscar `kind === 'create'`) |
| Descripción si existe | Render condicional | `ProductCatalogSection.tsx` · L44–48 |
| iOS vs Android teclado | `KeyboardAvoidingView` | `AdminPanel.tsx` · L309, L318 |
| Principal vs número foto | Miniatura admin | `AdminProductForm.tsx` · L229 |
| Label fotos obligatorias | `requirePhotos ?` | `AdminProductForm.tsx` · L210 |
| Fallback emoji si falla imagen | `if (failed)` | `ProductImage.tsx` · L31–42 |
| Botón “Cargar más” | `restantes > 0` | `ProductCatalogSection.tsx` · L63–66 |
| Pantalla carga catálogo | `catalogLoading` | `frontend/App.tsx` (inicio, condicional loading) |

---

## 8. Funciones (tradicionales, flecha y asíncronas)

| Tipo | Para qué | Archivo · líneas |
|------|----------|------------------|
| Helper precio COP | Formato moneda | `backend/utils/formatPrice.ts` (archivo completo) |
| Helper WhatsApp | Abrir chat y mensaje pedido | `backend/utils/whatsapp.ts` · L1–20 |
| Helper `clamp` | Limitar escala UI | `backend/utils/clamp.ts` (archivo completo) |
| `mergeCatalog` | Unir catálogo + admin | `backend/lib/admin-merge.ts` · L22–30 |
| Flecha `onPress` | Agregar producto | `ProductCatalogSection.tsx` · L51 |
| Flecha `setCart(prev =>` | Actualizar carrito | `backend/hooks/useCart.ts` · L27–38 |
| **`async` `fetchCatalogProducts`** | API remota | `backend/lib/catalog-api.ts` · L25–54 |
| **`fetch`** HTTP | Dentro de API | `backend/lib/catalog-api.ts` · L26 |
| **`async` `saveAdminData`** | Guardar local | `database/admin-storage.ts` · L49–52 |
| **`async` `loadAdminData`** | Leer local | `database/admin-storage.ts` · L54–63 |
| **`async` `pickImages`** | Galería fotos | `AdminProductForm.tsx` · L63–79 |
| **`async` `saveForm`** | Guardar producto admin | `AdminPanel.tsx` · L165–221 |
| **`try/catch`** al guardar | Error persistencia | `AdminPanel.tsx` · L219–220 |

---

## 9. React Native — componentes de UI

| Componente | Para qué | Archivo · líneas |
|------------|----------|------------------|
| **`View`** | Contenedores secciones | `frontend/App.tsx` · L217–277 |
| **`Text`** | Títulos, precios | `ProductCatalogSection.tsx` · L41–49 |
| **`ScrollView`** | Pantalla principal | `frontend/App.tsx` · L207–279 |
| **`Pressable`** | Botón agregar/quitar | `ProductCatalogSection.tsx` · L33–56 |
| **`Pressable`** FAB WhatsApp | Flotante contacto | `WhatsAppFab.tsx` · L25–39 |
| **`Pressable`** admin login | Entrar, volver | `AdminPanel.tsx` · L332–337 |
| **`TextInput`** | Búsqueda admin | `AdminPanel.tsx` · L364–372 |
| **`TextInput`** | Form producto | `AdminProductForm.tsx` · L158–205 (campos) |
| **`FlatList`** | Lista productos admin | `AdminPanel.tsx` · L413–440 |
| **`Modal`** carrito | Pedido | `CartModal.tsx` · L57 |
| **`Modal`** detalle | Ficha producto | `ProductDetailModal.tsx` · L1–70 |
| **`Modal`** categorías form | Selector categoría | `AdminProductForm.tsx` · L249–268 |
| **`SafeAreaView`** | Márgenes seguros | `frontend/App.tsx` · L185, L341 |
| **`KeyboardAvoidingView`** | Teclado admin | `AdminPanel.tsx` · L317–328 |
| **`ActivityIndicator`** | Carga imagen | `ProductImage.tsx` · L47–65 |
| **`ActivityIndicator`** | Guardando | `AdminProductForm.tsx` · L240–244 |
| **`Alert`** validación form | Campos obligatorios | `AdminProductForm.tsx` · L90–110 |
| **`Alert`** guardar / eliminar | Admin panel | `AdminPanel.tsx` · L129, L174–220, L225–234 |
| **`Share`** resumen catálogo | Toolbar admin | `AdminPanel.tsx` · L255–268 |
| **`Linking`** WhatsApp | Contacto y toolbar | `backend/utils/whatsapp.ts` · `AdminPanel.tsx` · L352 |
| **`StatusBar`** | Tema claro | `frontend/App.tsx` · import L1 · `AdminModal.tsx` · L67 |

---

## 10. `StyleSheet` y estilos

| Concepto | Dónde | Archivo · líneas |
|----------|-------|------------------|
| **`StyleSheet.create`** global | Estilos tienda | `frontend/styles/appStyles.ts` · L4 en adelante |
| Crear estilos con `scale` | Responsive | `backend/hooks/useResponsiveLayout.ts` · L23–28 → `frontend/styles/appStyles.ts` función `createAppStyles` · L3 |
| Estilos array `[a, b]` | Categoría activa | `CategoryGrid.tsx` · L37 |
| FAB posición absoluta | WhatsApp | `frontend/styles/appStyles.ts` · `whatsFab` · L430 |
| Barra carrito abajo | `cartBar` | `frontend/styles/appStyles.ts` · L35–47 |
| Estilos locales admin panel | `createStyles` | `AdminPanel.tsx` · L450 en adelante |
| Estilos locales form admin | `createStyles` | `AdminProductForm.tsx` · L275 en adelante |
| Root app mínimo | Contenedor externo | `frontend/App.tsx` · L361 |

---

## 11. Expo y configuración del entorno

| Concepto | Dónde | Archivo · líneas |
|----------|-------|------------------|
| Script **`start:lan`** | npm run en celular | `package.json` · L7 |
| Script Expo LAN + IP | Automatizar red | `scripts/start-expo-lan.mjs` · L97–135 |
| Dependencias Expo | SDK 54 | `package.json` · L14–30 |
| **`expo-navigation-bar`** | Admin Android | `AdminModal.tsx` · L5, L41–54 |
| Entrada Metro | `index.ts` | `index.ts` · raíz proyecto |
| Config app | Nombre, icono | `app.json` (raíz) |

---

## 12. Persistencia de datos (`AsyncStorage`)

| Concepto | Dónde | Archivo · líneas |
|----------|-------|------------------|
| Import `AsyncStorage` | Librería persistencia | `database/admin-storage.ts` · L1 |
| Clave almacenamiento | `@regalo_magico_admin_v2` | `database/admin-storage.ts` · L3 |
| **`saveAdminData`** | Escribir JSON | `database/admin-storage.ts` · L49–52 |
| **`loadAdminData`** | Leer al abrir | `database/admin-storage.ts` · L54–63 |
| Disparar carga en app | Al montar | `backend/hooks/useCatalog.ts` · L23–24 |
| Actualizar tras guardar | Callback admin | `AdminPanel.tsx` · L108–113 · `frontend/App.tsx` · L351 |

---

## 13. Imágenes y multimedia

| Concepto | Dónde | Archivo · líneas |
|----------|-------|------------------|
| **`expo-image`** `<Image>` | Foto producto | `ProductImage.tsx` · L11, L67–81 |
| Catálogo `require()` local | Assets empaquetados | `database/catalog.generated.ts` |
| Resolver local vs remoto | Si API falla | `backend/lib/product-images.ts` · L1–90 |
| **`expo-image-picker`** | Elegir de galería | `AdminProductForm.tsx` · L1, L63–79 |
| Varias fotos `imageUris` | Admin storage | `database/admin-storage.ts` · L13, L25 |
| Generar catálogo desde web | Script build | `scripts/generate-catalog.mjs` (raíz `scripts/`) |
| Carpeta imágenes | Assets | `assets/catalog/` |

---

## 14. API y datos remotos

| Concepto | Dónde | Archivo · líneas |
|----------|-------|------------------|
| **`fetch` + parse JSON** | GET catálogo | `backend/lib/catalog-api.ts` · L25–28 |
| Llamada desde hook | Al iniciar si remoto activo | `backend/hooks/useCatalog.ts` · L35–39 |
| Config usar remoto / URLs | Variables entorno | `backend/lib/api-config.ts` (archivo completo) |
| Merge remoto + fotos locales | No perder imágenes | `backend/lib/product-images.ts` · L77–90 |
| Pantalla “Cargando…” | Espera API | `frontend/components/common/CatalogLoadingScreen.tsx` |

---

## 15. Constantes, utilidades y organización

| Elemento | Dónde | Archivo · líneas |
|----------|-------|------------------|
| Categorías tienda | Grid y filtros | `backend/constants/categories.ts` · L5–21 |
| Número WhatsApp | Contacto | `backend/constants/contact.ts` |
| Credenciales admin | Login | `backend/lib/admin-config.ts` · L2–3 |
| Tipos tienda | Producto / carrito | `backend/types/store.ts` · L1–15 |
| Lógica sin UI | API, merge | `backend/lib/` y `database/` |
| UI por módulos | home, catalog, cart… | carpeta `frontend/components/` |
| Hooks reutilizables | Estado compartido | carpeta `backend/hooks/` |

---

## 16. Conceptos de clase no usados en esta app

| Concepto | Motivo |
|----------|--------|
| **Vite** | Bundler **Expo / Metro** |
| **Tailwind CSS** | Se usa **`StyleSheet`** |
| **Global Context** | **Props + hooks** desde `frontend/App.tsx` |
| **expo-router** (calculadora) | Una pantalla en **`frontend/App.tsx` L49–357** |
| **`expo-haptics`** | No integrado |
| **Fragmentos `<></>`** | Se usa **`View`** |

---

## Índice rápido por archivo (ir al concepto)

| Archivo | Conceptos principales | Líneas clave |
|---------|----------------------|--------------|
| `frontend/App.tsx` | Raíz UI, hooks, props a hijos, `ScrollView`, modales | ~L49–357 |
| `backend/hooks/useCart.ts` | `useState`, `useMemo`, carrito | L11–117 |
| `backend/hooks/useCatalog.ts` | `useState`, `useEffect`, `useMemo`, API | L13–87 |
| `backend/hooks/useSectionScroll.ts` | `useRef`, `useState` | L27–52 |
| `backend/hooks/useResponsiveLayout.ts` | `useMemo`, estilos | L13–35 |
| `frontend/components/catalog/ProductCatalogSection.tsx` | `map`, `Pressable`, props | L7–70 |
| `frontend/components/catalog/CategoryGrid.tsx` | `filter`, `map`, ternario | L9–49 |
| `frontend/components/cart/CartModal.tsx` | `Modal`, `map`, props | L11–170 |
| `frontend/components/admin/AdminPanel.tsx` | Admin CRUD, `Alert`, `FlatList` | L36–508 |
| `frontend/components/admin/AdminProductForm.tsx` | Form, `useState`, picker | L29–396 |
| `database/admin-storage.ts` | Interfaces, AsyncStorage | L1–63 |
| `backend/lib/admin-merge.ts` | `filter`, `map`, merge | L22–90 |
| `backend/lib/catalog-api.ts` | `async`, `fetch` | L25–54 |
| `frontend/styles/appStyles.ts` | `StyleSheet.create` | L3–489 |
| `backend/types/store.ts` | Tipos TS | L1–15 |

---

*Regalo Mágico App — referencia con líneas. Si mueves código, actualiza las L en este documento.*
