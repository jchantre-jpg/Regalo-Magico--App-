# Uso del material de clases — Regalo Mágico App (móvil)

Relación entre **conceptos de clase** y **código de `regalo-magico-app`**, con **archivo y líneas** para ubicar cada cosa en el editor.

| | |
|---|---|
| **Proyecto** | `regalo-magico-app` |
| **Ejecutar en celular** | `npm run start:lan` → ver `package.json` L7 y `scripts/start-expo-lan.mjs` |
| **Admin** | `lib/admin-config.ts` L2–3 (`admin` / `regalo2026`) |

> Las líneas (**L**) pueden variar un poco si editas el archivo; usa Ctrl+G en VS Code para ir directo.

---

## 1. React Hooks (`useState`, `useEffect` y otros)

| Hook / patrón | Para qué se usa en la app | Archivo · líneas |
|---------------|---------------------------|------------------|
| **`useState`** — carrito | Lista de ítems y modal visible | `hooks/useCart.ts` · L13–15 |
| **`useState`** — modales UI | Detalle, menú, admin | `App.tsx` · L109–113 |
| **`useState`** — catálogo / filtros | Categoría, paginación, persist admin | `hooks/useCatalog.ts` · L14–19 |
| **`useState`** — login / lista admin | Fase, usuario, búsqueda, formulario | `components/admin/AdminPanel.tsx` · L97–101 |
| **`useState`** — formulario producto | Campos nombre, precio, fotos, etc. | `components/admin/AdminProductForm.tsx` · L52–61 |
| **`useState`** — carga de imagen | Error y loading de foto | `components/common/ProductImage.tsx` · L28–29 |
| **`useState`** — offsets de scroll | Posición Y de cada sección | `hooks/useSectionScroll.ts` · L31 |
| **`useEffect`** — cargar admin al iniciar | `loadAdminData` → estado | `hooks/useCatalog.ts` · L21–29 |
| **`useEffect`** — API catálogo remoto | `fetchCatalogProducts` | `hooks/useCatalog.ts` · L31–49 |
| **`useEffect`** — reset “cargar más” | Al cambiar categoría | `hooks/useCatalog.ts` · L51–53 |
| **`useEffect`** — reset panel admin | Volver a login al abrir | `components/admin/AdminPanel.tsx` · L105–114 |
| **`useEffect`** — barra Android admin | `expo-navigation-bar` | `components/admin/AdminModal.tsx` · L41–54 |
| **`useMemo`** — total y cantidad carrito | Suma precios e ítems | `hooks/useCart.ts` · L19–21 |
| **`useMemo`** — catálogo fusionado | Merge + imágenes | `hooks/useCatalog.ts` · L55–67 |
| **`useMemo`** — productos filtrados | Por categoría | `hooks/useCatalog.ts` · L60–63 |
| **`useMemo`** — estilos responsive | `createAppStyles(scale)` | `hooks/useResponsiveLayout.ts` · L23–28 |
| **`useMemo`** — búsqueda admin | Filtrar lista productos | `components/admin/AdminPanel.tsx` · L138–148 |
| **`useMemo`** — estilos form admin | `createStyles(scale)` | `components/admin/AdminProductForm.tsx` · L51 · `AdminPanel.tsx` · L103 |
| **`useRef`** — `ScrollView` | Saltar a secciones | `hooks/useSectionScroll.ts` · L29, L44–46 |

---

## 2. Custom Hooks

| Custom Hook | Responsabilidad | Definido en | Usado en |
|-------------|-----------------|-------------|----------|
| **`useCatalog`** | Catálogo, filtros, admin, API | `hooks/useCatalog.ts` · L13–87 | `App.tsx` · L59–81 |
| **`useCart`** | Carrito y pedido WhatsApp | `hooks/useCart.ts` · L11–117 | `App.tsx` · L83–105 |
| **`useResponsiveLayout`** | Escala y `styles` | `hooks/useResponsiveLayout.ts` · L13–35 | `App.tsx` · L53 |
| **`useSectionScroll`** | Scroll entre secciones | `hooks/useSectionScroll.ts` · L27–52 | `App.tsx` · L55 |
| **`useWhatsApp`** | Abrir contacto | `hooks/useWhatsApp.ts` · L7–15 | `App.tsx` · L57 |

| Patrón | Ejemplo con líneas |
|--------|-------------------|
| Hook retorna estado + acciones | `useCart.ts` · L95–116 (`return { cart, addToCart, ... }`) |
| Desestructuración en `App` | `App.tsx` · L59–81 (`useCatalog`), L83–105 (`useCart`) |

---

## 3. Props

| Uso de Props | Ejemplo en la app | Archivo · líneas |
|--------------|-------------------|------------------|
| Interface `Props` | Contrato del componente | Ver tabla abajo |
| Pasar productos y callbacks | Catálogo desde `App` | `App.tsx` · L251–258 |
| Pasar categoría activa | Filtro de grid | `App.tsx` · L229–243 |
| Pasar carrito al modal | Estado del pedido | `App.tsx` · L301–319 |
| Pasar persist admin | Guardar cambios | `App.tsx` · L343–352 |
| Props opcionales `?` | `requirePhotos?` | `components/admin/AdminProductForm.tsx` · L35 |
| Props opcionales `?` | `emoji?` en imagen | `components/common/ProductImage.tsx` · L15 |
| Valor por defecto en props | `requirePhotos = true` | `AdminProductForm.tsx` · L47 |
| Desestructuración `({ ... }: Props)` | FAB WhatsApp | `components/layout/WhatsAppFab.tsx` · L7–17, L21 |
| Desestructuración en carrito | Modal carrito | `components/cart/CartModal.tsx` · L11–30, L35–53 |

**Interfaces `Props` por componente (línea donde empieza el tipo):**

| Componente | Archivo · línea `Props` |
|------------|-------------------------|
| `WhatsAppFab` | `components/layout/WhatsAppFab.tsx` · L7 |
| `ProductCatalogSection` | `components/catalog/ProductCatalogSection.tsx` · L7 |
| `CategoryGrid` | `components/catalog/CategoryGrid.tsx` · L9 |
| `CartModal` | `components/cart/CartModal.tsx` · L11 |
| `ProductDetailModal` | `components/product/ProductDetailModal.tsx` · L8 |
| `AdminPanel` | `components/admin/AdminPanel.tsx` · L36 |
| `AdminModal` | `components/admin/AdminModal.tsx` · L16 |
| `AdminProductForm` | `components/admin/AdminProductForm.tsx` · L29 |
| `HeroSection` | `components/home/HeroSection.tsx` · L5 |
| `ContactSection` | `components/home/ContactSection.tsx` · L5 |
| `TopNav` | `components/layout/TopNav.tsx` · L7 |
| `NavMenu` | `components/layout/NavMenu.tsx` · L5 |
| `ProductImage` | `components/common/ProductImage.tsx` · L13 |

---

## 4. Componentes React y JSX (`.tsx`)

| Concepto | Dónde se utiliza | Archivo · líneas |
|----------|------------------|------------------|
| Componente raíz | Pantalla tienda | `App.tsx` · L49–357 |
| Importar hijos en raíz | Hero, catálogo, modales | `App.tsx` · L11–33 |
| `export default function App` | Entrada app | `App.tsx` · L49 |
| Hero | Banner inicio | `App.tsx` · L221 · `components/home/HeroSection.tsx` |
| Interpolación `{item.nombre}` | Nombre y precio | `ProductCatalogSection.tsx` · L41–49 |
| Contador en barra carrito | Badge cantidad | `App.tsx` (barra carrito, buscar `cartItemsCount`) |
| Contenedor `View` | Secciones sin HTML | `App.tsx` · L207–279 (`ScrollView` interno) |

---

## 5. TypeScript — tipos básicos, listas e interfaces

| Concepto | Dónde se utiliza | Archivo · líneas |
|----------|------------------|------------------|
| `string` / `number` en estado | Precio, stock como texto en form | `AdminProductForm.tsx` · L54–55 |
| `boolean` en estado | Modales, saving, loading imagen | `App.tsx` · L111–113 · `ProductImage.tsx` · L28–29 |
| Lista `CartItem[]` | Carrito | `hooks/useCart.ts` · L13 |
| Lista `string[]` fotos | URIs en admin | `AdminProductForm.tsx` · L59 · `lib/admin-storage.ts` · L13, L25 |
| Lista categorías `Categoria[]` | Constantes | `constants/categories.ts` · L5–21 |
| Acceso `arr[0]` imagen principal | Merge catálogo | `lib/admin-merge.ts` · L46, L66 |
| `CartItem` | Producto + cantidad | `types/store.ts` · L11 |
| `SectionKey` (unión) | Secciones scroll | `types/store.ts` · L15 |
| `ProductOverride` | Edición producto catálogo | `lib/admin-storage.ts` · L5–14 |
| `CustomProductRecord` | Producto nuevo admin | `lib/admin-storage.ts` · L16–26 |
| `AdminPersisted` | Todo lo guardado local | `lib/admin-storage.ts` · L28–32 |
| `CatalogProduct` | Catálogo generado | `lib/catalog.generated.ts` (archivo completo) |
| `ProductFormPayload` | Envío formulario | `AdminProductForm.tsx` · L16–25 |

---

## 6. Arrays — `.map()`, `.filter()`, `.join()`

| Método | Para qué | Archivo · líneas |
|--------|----------|------------------|
| **`.map()`** productos en grid | Render tarjetas | `ProductCatalogSection.tsx` · L31–60 |
| **`.map()`** categorías | Tarjetas categoría | `CategoryGrid.tsx` · L31–49 |
| **`.map()`** líneas carrito | Modal pedido | `CartModal.tsx` · L85–140 |
| **`.map()`** fotos formulario | Miniaturas | `AdminProductForm.tsx` · L223–232 |
| **`.map()`** merge catálogo | Base + overrides | `lib/admin-merge.ts` · L26–28 |
| **`.map()`** en carrito (cantidad) | Actualizar ítem | `hooks/useCart.ts` · L33–35, L73 |
| **`.filter()`** sin “todos” | Grid categorías | `CategoryGrid.tsx` · L31 |
| **`.filter()`** eliminados | IDs en `deletedIds` | `lib/admin-merge.ts` · L26 |
| **`.filter()`** carrito qty 0 | Quitar línea | `hooks/useCart.ts` · L55, L67, L81 |
| **`.filter()`** por categoría | Productos visibles | `hooks/useCatalog.ts` · L62 |
| **`.filter()`** búsqueda admin | Lista admin | `AdminPanel.tsx` · L141–147 |
| **`.join()`** mensaje WhatsApp | Texto del pedido | `utils/whatsapp.ts` · L15 |
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
| Pantalla carga catálogo | `catalogLoading` | `App.tsx` (inicio, condicional loading) |

---

## 8. Funciones (tradicionales, flecha y asíncronas)

| Tipo | Para qué | Archivo · líneas |
|------|----------|------------------|
| Helper precio COP | Formato moneda | `utils/formatPrice.ts` (archivo completo) |
| Helper WhatsApp | Abrir chat y mensaje pedido | `utils/whatsapp.ts` · L1–20 |
| Helper `clamp` | Limitar escala UI | `utils/clamp.ts` (archivo completo) |
| `mergeCatalog` | Unir catálogo + admin | `lib/admin-merge.ts` · L22–30 |
| Flecha `onPress` | Agregar producto | `ProductCatalogSection.tsx` · L51 |
| Flecha `setCart(prev =>` | Actualizar carrito | `hooks/useCart.ts` · L27–38 |
| **`async` `fetchCatalogProducts`** | API remota | `lib/catalog-api.ts` · L25–54 |
| **`fetch`** HTTP | Dentro de API | `lib/catalog-api.ts` · L26 |
| **`async` `saveAdminData`** | Guardar local | `lib/admin-storage.ts` · L49–52 |
| **`async` `loadAdminData`** | Leer local | `lib/admin-storage.ts` · L54–63 |
| **`async` `pickImages`** | Galería fotos | `AdminProductForm.tsx` · L63–79 |
| **`async` `saveForm`** | Guardar producto admin | `AdminPanel.tsx` · L165–221 |
| **`try/catch`** al guardar | Error persistencia | `AdminPanel.tsx` · L219–220 |

---

## 9. React Native — componentes de UI

| Componente | Para qué | Archivo · líneas |
|------------|----------|------------------|
| **`View`** | Contenedores secciones | `App.tsx` · L217–277 |
| **`Text`** | Títulos, precios | `ProductCatalogSection.tsx` · L41–49 |
| **`ScrollView`** | Pantalla principal | `App.tsx` · L207–279 |
| **`Pressable`** | Botón agregar/quitar | `ProductCatalogSection.tsx` · L33–56 |
| **`Pressable`** FAB WhatsApp | Flotante contacto | `WhatsAppFab.tsx` · L25–39 |
| **`Pressable`** admin login | Entrar, volver | `AdminPanel.tsx` · L332–337 |
| **`TextInput`** | Búsqueda admin | `AdminPanel.tsx` · L364–372 |
| **`TextInput`** | Form producto | `AdminProductForm.tsx` · L158–205 (campos) |
| **`FlatList`** | Lista productos admin | `AdminPanel.tsx` · L413–440 |
| **`Modal`** carrito | Pedido | `CartModal.tsx` · L57 |
| **`Modal`** detalle | Ficha producto | `ProductDetailModal.tsx` · L1–70 |
| **`Modal`** categorías form | Selector categoría | `AdminProductForm.tsx` · L249–268 |
| **`SafeAreaView`** | Márgenes seguros | `App.tsx` · L185, L341 |
| **`KeyboardAvoidingView`** | Teclado admin | `AdminPanel.tsx` · L317–328 |
| **`ActivityIndicator`** | Carga imagen | `ProductImage.tsx` · L47–65 |
| **`ActivityIndicator`** | Guardando | `AdminProductForm.tsx` · L240–244 |
| **`Alert`** validación form | Campos obligatorios | `AdminProductForm.tsx` · L90–110 |
| **`Alert`** guardar / eliminar | Admin panel | `AdminPanel.tsx` · L129, L174–220, L225–234 |
| **`Share`** resumen catálogo | Toolbar admin | `AdminPanel.tsx` · L255–268 |
| **`Linking`** WhatsApp | Contacto y toolbar | `utils/whatsapp.ts` · `AdminPanel.tsx` · L352 |
| **`StatusBar`** | Tema claro | `App.tsx` · import L1 · `AdminModal.tsx` · L67 |

---

## 10. `StyleSheet` y estilos

| Concepto | Dónde | Archivo · líneas |
|----------|-------|------------------|
| **`StyleSheet.create`** global | Estilos tienda | `styles/appStyles.ts` · L4 en adelante |
| Crear estilos con `scale` | Responsive | `hooks/useResponsiveLayout.ts` · L23–28 → `styles/appStyles.ts` función `createAppStyles` · L3 |
| Estilos array `[a, b]` | Categoría activa | `CategoryGrid.tsx` · L37 |
| FAB posición absoluta | WhatsApp | `styles/appStyles.ts` · `whatsFab` · L430 |
| Barra carrito abajo | `cartBar` | `styles/appStyles.ts` · L35–47 |
| Estilos locales admin panel | `createStyles` | `AdminPanel.tsx` · L450 en adelante |
| Estilos locales form admin | `createStyles` | `AdminProductForm.tsx` · L275 en adelante |
| Root app mínimo | Contenedor externo | `App.tsx` · L361 |

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
| Import `AsyncStorage` | Librería persistencia | `lib/admin-storage.ts` · L1 |
| Clave almacenamiento | `@regalo_magico_admin_v2` | `lib/admin-storage.ts` · L3 |
| **`saveAdminData`** | Escribir JSON | `lib/admin-storage.ts` · L49–52 |
| **`loadAdminData`** | Leer al abrir | `lib/admin-storage.ts` · L54–63 |
| Disparar carga en app | Al montar | `hooks/useCatalog.ts` · L23–24 |
| Actualizar tras guardar | Callback admin | `AdminPanel.tsx` · L108–113 · `App.tsx` · L351 |

---

## 13. Imágenes y multimedia

| Concepto | Dónde | Archivo · líneas |
|----------|-------|------------------|
| **`expo-image`** `<Image>` | Foto producto | `ProductImage.tsx` · L11, L67–81 |
| Catálogo `require()` local | Assets empaquetados | `lib/catalog.generated.ts` |
| Resolver local vs remoto | Si API falla | `lib/product-images.ts` · L1–90 |
| **`expo-image-picker`** | Elegir de galería | `AdminProductForm.tsx` · L1, L63–79 |
| Varias fotos `imageUris` | Admin storage | `lib/admin-storage.ts` · L13, L25 |
| Generar catálogo desde web | Script build | `scripts/generate-catalog.mjs` (raíz `scripts/`) |
| Carpeta imágenes | Assets | `assets/catalog/` |

---

## 14. API y datos remotos

| Concepto | Dónde | Archivo · líneas |
|----------|-------|------------------|
| **`fetch` + parse JSON** | GET catálogo | `lib/catalog-api.ts` · L25–28 |
| Llamada desde hook | Al iniciar si remoto activo | `hooks/useCatalog.ts` · L35–39 |
| Config usar remoto / URLs | Variables entorno | `lib/api-config.ts` (archivo completo) |
| Merge remoto + fotos locales | No perder imágenes | `lib/product-images.ts` · L77–90 |
| Pantalla “Cargando…” | Espera API | `components/common/CatalogLoadingScreen.tsx` |

---

## 15. Constantes, utilidades y organización

| Elemento | Dónde | Archivo · líneas |
|----------|-------|------------------|
| Categorías tienda | Grid y filtros | `constants/categories.ts` · L5–21 |
| Número WhatsApp | Contacto | `constants/contact.ts` |
| Credenciales admin | Login | `lib/admin-config.ts` · L2–3 |
| Tipos tienda | Producto / carrito | `types/store.ts` · L1–15 |
| Lógica sin UI | API, merge, storage | carpeta `lib/` |
| UI por módulos | home, catalog, cart… | carpeta `components/` |
| Hooks reutilizables | Estado compartido | carpeta `hooks/` |

---

## 16. Conceptos de clase no usados en esta app

| Concepto | Motivo |
|----------|--------|
| **Vite** | Bundler **Expo / Metro** |
| **Tailwind CSS** | Se usa **`StyleSheet`** |
| **Global Context** | **Props + hooks** desde `App.tsx` |
| **expo-router** (calculadora) | Una pantalla en **`App.tsx` L49–357** |
| **`expo-haptics`** | No integrado |
| **Fragmentos `<></>`** | Se usa **`View`** |

---

## Índice rápido por archivo (ir al concepto)

| Archivo | Conceptos principales | Líneas clave |
|---------|----------------------|--------------|
| `App.tsx` | Raíz, hooks, props a hijos, `ScrollView`, modales | L49–357 |
| `hooks/useCart.ts` | `useState`, `useMemo`, carrito | L11–117 |
| `hooks/useCatalog.ts` | `useState`, `useEffect`, `useMemo`, API | L13–87 |
| `hooks/useSectionScroll.ts` | `useRef`, `useState` | L27–52 |
| `hooks/useResponsiveLayout.ts` | `useMemo`, estilos | L13–35 |
| `components/catalog/ProductCatalogSection.tsx` | `map`, `Pressable`, props | L7–70 |
| `components/catalog/CategoryGrid.tsx` | `filter`, `map`, ternario | L9–49 |
| `components/cart/CartModal.tsx` | `Modal`, `map`, props | L11–170 |
| `components/admin/AdminPanel.tsx` | Admin CRUD, `Alert`, `FlatList` | L36–508 |
| `components/admin/AdminProductForm.tsx` | Form, `useState`, picker | L29–396 |
| `lib/admin-storage.ts` | Interfaces, AsyncStorage | L1–63 |
| `lib/admin-merge.ts` | `filter`, `map`, merge | L22–90 |
| `lib/catalog-api.ts` | `async`, `fetch` | L25–54 |
| `styles/appStyles.ts` | `StyleSheet.create` | L3–489 |
| `types/store.ts` | Tipos TS | L1–15 |

---

*Regalo Mágico App — referencia con líneas. Si mueves código, actualiza las L en este documento.*
