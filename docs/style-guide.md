# Libro de estilo — Juego de Damas

## Propósito

Este documento define el sistema de diseño del juego de damas. Es la única fuente de verdad para
colores, tipografía, espaciados y componentes base: cualquier valor visual nuevo debe derivarse de
aquí y materializarse como _custom property_ de CSS en `src/styles/tokens.css`.

La dirección visual toma como referencia la estética moderna de producto que se observa en
[Mobbin](https://mobbin.com/): interfaces limpias, tipografía cuidada, cards con sombras suaves,
esquinas redondeadas y estados bien definidos para cada componente.

## 1. Paleta de colores

### Neutros y fondo

| Token                    | Hex       | HSL                 | Uso                                   |
| ------------------------ | --------- | ------------------- | ------------------------------------- |
| `--color-bg`             | `#F6F5F2` | `hsl(40, 25%, 96%)` | Fondo general de la aplicación        |
| `--color-surface`        | `#FFFFFF` | `hsl(0, 0%, 100%)`  | Cards, paneles y superficies elevadas |
| `--color-text-primary`   | `#1C1917` | `hsl(24, 10%, 10%)` | Texto principal (títulos, cuerpo)     |
| `--color-text-secondary` | `#78716C` | `hsl(25, 5%, 45%)`  | Texto secundario (subtítulos, ayudas) |
| `--color-border`         | `#E7E5E4` | `hsl(24, 6%, 90%)`  | Bordes de cards, inputs y divisores   |

### Color de acento (primario)

| Token                    | Hex       | HSL                   | Uso                                         |
| ------------------------ | --------- | --------------------- | ------------------------------------------- |
| `--color-primary`        | `#4F46E5` | `hsl(243, 75%, 59%)`  | Botones principales, enlaces, foco, acentos |
| `--color-primary-hover`  | `#4338CA` | `hsl(243, 59%, 51%)`  | Hover de elementos primarios                |
| `--color-primary-active` | `#3730A3` | `hsl(243, 51%, 42%)`  | Estado activo/pulsado                       |
| `--color-primary-subtle` | `#EEF2FF` | `hsl(226, 100%, 97%)` | Fondos de selección, badges suaves          |

### Estados de feedback

| Token             | Hex       | HSL                  | Uso                                          |
| ----------------- | --------- | -------------------- | -------------------------------------------- |
| `--color-success` | `#16A34A` | `hsl(142, 76%, 36%)` | Éxito (victorias, mensajes positivos)        |
| `--color-error`   | `#DC2626` | `hsl(0, 72%, 51%)`   | Error (jugadas inválidas, mensajes de error) |
| `--color-warning` | `#D97706` | `hsl(32, 95%, 44%)`  | Advertencia (avisos, confirmaciones)         |

### Tablero y fichas

| Token                           | Hex       | HSL                 | Uso                                              |
| ------------------------------- | --------- | ------------------- | ------------------------------------------------ |
| `--color-board-light`           | `#F0D9B5` | `hsl(40, 66%, 83%)` | Casillas claras del tablero                      |
| `--color-board-dark`            | `#B58863` | `hsl(26, 36%, 55%)` | Casillas oscuras del tablero (jugables)          |
| `--color-piece-player-1`        | `#FAFAF9` | `hsl(60, 9%, 98%)`  | Fichas del jugador 1 (blancas)                   |
| `--color-piece-player-1-border` | `#D6D3D1` | `hsl(24, 6%, 83%)`  | Borde de las fichas del jugador 1                |
| `--color-piece-player-2`        | `#292524` | `hsl(20, 6%, 15%)`  | Fichas del jugador 2 (oscuras)                   |
| `--color-piece-player-2-border` | `#1C1917` | `hsl(24, 10%, 10%)` | Borde de las fichas del jugador 2                |
| `--color-piece-king`            | `#F59E0B` | `hsl(38, 92%, 50%)` | Anillo dorado que identifica a las damas (reyes) |

## 2. Tipografía

- **Familia**: `Inter` (Google Fonts) con fallback `system-ui, -apple-system, sans-serif`.
  Se carga en `index.html`; el token es `--font-family-base`.
- **Jerarquía**:

| Nivel     | Token                  | Tamaño          | Peso | Uso                             |
| --------- | ---------------------- | --------------- | ---- | ------------------------------- |
| Display   | `--font-size-display`  | 32px / 2rem     | 800  | Título principal de pantallas   |
| Título    | `--font-size-title`    | 24px / 1.5rem   | 700  | Títulos de sección              |
| Subtítulo | `--font-size-subtitle` | 18px / 1.125rem | 600  | Subtítulos, nombres de jugador  |
| Cuerpo    | `--font-size-body`     | 16px / 1rem     | 400  | Texto general                   |
| Label     | `--font-size-label`    | 14px / 0.875rem | 500  | Etiquetas de campos y controles |
| Caption   | `--font-size-caption`  | 12px / 0.75rem  | 400  | Ayudas, metadatos               |

- Pesos disponibles: 400 (regular), 500 (medium), 600 (semibold), 700 (bold), 800 (extrabold).
- Interlineado de títulos: 1.2; de cuerpo: 1.5.

## 3. Espaciado y grilla

- **Escala de espaciado** (base 4px):

| Token             | Valor |
| ----------------- | ----- |
| `--spacing-xs`    | 4px   |
| `--spacing-sm`    | 8px   |
| `--spacing-md`    | 12px  |
| `--spacing-lg`    | 16px  |
| `--spacing-xl`    | 24px  |
| `--spacing-xxl`   | 32px  |
| `--spacing-xxxl`  | 48px  |
| `--spacing-xxxxl` | 64px  |

- **Grilla**: los paneles y pantallas se maquetan con esta escala; el tablero usa su propia grilla
  interna (8×8) con casillas cuadradas que se escalan con el contenedor.
- **Breakpoints** (mobile-first, media queries `min-width`):

| Breakpoint | Valor  |
| ---------- | ------ |
| `sm`       | 640px  |
| `md`       | 768px  |
| `lg`       | 1024px |

> Nota: los breakpoints se documentan como tokens para referencia, pero las media queries usan el
> valor literal (`@media (min-width: 768px)`), porque CSS no permite `var()` dentro de media queries.

## 4. Radios, sombras y elevación

| Token           | Valor                           | Uso                              |
| --------------- | ------------------------------- | -------------------------------- |
| `--radius-sm`   | 8px                             | Inputs, badges, botones pequeños |
| `--radius-md`   | 12px                            | Botones, chips                   |
| `--radius-lg`   | 16px                            | Cards, paneles, modales          |
| `--radius-full` | 9999px                          | Píldoras, avatares               |
| `--shadow-sm`   | `0 1px 2px rgb(0 0 0 / 0.05)`   | Bordes suaves, elementos sutiles |
| `--shadow-md`   | `0 4px 12px rgb(0 0 0 / 0.08)`  | Cards en reposo                  |
| `--shadow-lg`   | `0 12px 32px rgb(0 0 0 / 0.12)` | Modales y elementos flotantes    |

## 5. Componentes base

### Botones

- **Primario**: fondo `--color-primary`, texto blanco, radio `--radius-md`, padding
  `--spacing-md` `--spacing-xl`.
  - _hover_: fondo `--color-primary-hover`.
  - _active_: fondo `--color-primary-active`.
  - _disabled_: opacidad 0.5, sin sombra, cursor `not-allowed`.
- **Secundario**: fondo `--color-surface`, borde `--color-border`, texto `--color-text-primary`.
  - _hover_: fondo `--color-primary-subtle`, borde `--color-primary`.
- **Texto (ghost)**: sin fondo ni borde, texto `--color-primary`.
  - _hover_: fondo `--color-primary-subtle`.
- Todos los botones muestran anillo de foco `--focus-ring` en `:focus-visible` y un área táctil
  mínima de 44×44px.

### Cards

- Fondo `--color-surface`, radio `--radius-lg`, sombra `--shadow-md`, borde `--color-border`,
  padding `--spacing-xl`. Se usan para agrupar opciones de juego, paneles y el scoreboard.

### Inputs y selects

- Borde `--color-border`, radio `--radius-sm`, padding `--spacing-md`, label asociado con
  `for`/`id`.
  - _focus_: borde `--color-primary` + `--focus-ring`.
  - _error_: borde y texto `--color-error`.

### Badges

- Fondo `--color-primary-subtle`, texto `--color-primary`, radio `--radius-full`, padding
  `--spacing-xs` `--spacing-md`, peso medium. Se usan para dificultad y estados.

### Estados de feedback

- Mensajes de éxito, error y advertencia usan los tokens de la sección 1 con fondo suave
  (tonalidad al 8–10%) y texto del color base correspondiente.

## 6. Iconografía

- Se usa la librería **Material Symbols** (Google), variante _Rounded_.
- No se incrustan emojis en la interfaz ni en el código: cualquier icono se renderiza como glifo
  de Material Symbols.
- Ejemplos de uso en este proyecto: `undo` (deshacer), `smart_toy` (bot), `group` (dos jugadores),
  `restart_alt` (reiniciar), `emoji_events` (trofeo, fin de partida).

## 7. Accesibilidad

- Contraste: los textos cumplen WCAG AA sobre su fondo (los neutros y el acento están elegidos
  para ello).
- Foco visible: todos los elementos interactivos muestran `--focus-ring`.
- Área táctil mínima: 44×44px en controles táctiles.
- Los elementos interactivos usan etiquetas nativas (`button`, `a`, `label`) y `aria-label`
  descriptivos; las imágenes informativas llevan `alt` y las decorativas `alt=""`.

## 8. Implementación

Los tokens se definen como _custom properties_ en `src/styles/tokens.css` y se consumen en todo el
proyecto; no se repiten valores hex ni píxeles sueltos fuera de ese archivo. La nomenclatura de
clases CSS sigue **BEM** (`bloque__elemento--modificador`).
