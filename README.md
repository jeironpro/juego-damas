# Juego de Damas

## Descripción

Juego de **damas españolas (8×8)** implementado como aplicación web. Se puede jugar de dos
maneras:

- **Contra el bot** (implementado en JavaScript puro) en tres niveles: Fácil, Medio y Difícil.
- **Dos jugadores en el mismo tablero** (hot-seat), turno alternado.

La interfaz incluye un **scoreboard** con los contadores de fichas (descuentan al capturar;
pierde quien llegue a 0), un botón **Deshacer** que permite revertir una sola jugada por partida
y botones para **reiniciar** la partida o **volver al menú** de selección de modo. Cuando hay
captura obligatoria, el tablero resalta las fichas que pueden comer y lo indica al jugador.

## Reglas del juego

- Tablero de 8×8 con **12 fichas por jugador**.
- Las fichas se mueven una casilla en diagonal hacia delante.
- **Captura obligatoria**: si una ficha puede comer, debe hacerlo; la ficha puede capturar
  hacia atrás y encadenar capturas múltiples.
- Al llegar a la última fila, la ficha se corona y se convierte en **dama**, que se mueve una
  casilla en diagonal en cualquier dirección (se identifica con una corona dorada).
- Pierde el jugador que se queda **sin fichas (0)** o **sin movimientos legales**.

## Stack

| Tecnología               | Uso                                                |
| ------------------------ | -------------------------------------------------- |
| React 19                 | Interfaz de usuario (SPA)                          |
| Vite 8                   | Bundler y dev server                               |
| Yarn 4                   | Gestor de paquetes (fijado en `packageManager`)    |
| Vitest + Testing Library | Tests unitarios y de componentes                   |
| ESLint + Prettier        | Lint y formato (Husky + lint-staged en pre-commit) |
| GitHub Actions           | CI: lint, tests y build por PR                     |

## Cómo correr

Requisitos: Node.js 24 (ver `.nvmrc`) y Yarn 4.

```bash
yarn install     # instala dependencias
yarn dev         # servidor de desarrollo (http://localhost:5173)
yarn build       # build de producción en dist/
yarn preview     # sirve el build localmente
yarn test        # ejecuta los tests (Vitest)
yarn lint        # ejecuta ESLint
yarn format      # formatea el código con Prettier
```

## Estructura del proyecto

```
src/
  components/ui/        # componentes genéricos (Button, Icon)
  features/game/        # motor de reglas en JS puro (board, moves, game) + tests
  features/bot/         # bot en JS puro (minimax + heurística) y dificultades
  features/board/       # tablero interactivo (Board, Square, Piece)
  features/scoreboard/  # marcador superior con contadores
  features/menu/        # pantalla de inicio y fin de partida
  hooks/                # useGame (estado de partida y turno del bot)
  styles/               # tokens de diseño y estilos base
docs/
  style-guide.md        # libro de estilo (colores, tipografía, componentes)
```

## Diseño

La dirección visual es clara y minimalista, inspirada en la estética moderna de producto que se
recopila en [Mobbin](https://mobbin.com/). Todos los valores visuales (paleta, tipografía,
espaciados, radios, sombras) están definidos en el [libro de estilo](docs/style-guide.md) y
materializados como _custom properties_ en `src/styles/tokens.css`. Los iconos usan la librería
**Material Symbols** de Google.

## Calidad

- **Tests**: 64 tests entre el motor de reglas, el bot, hooks y componentes (`yarn test`).
- **CI**: pipeline en `.github/workflows/ci.yml` que ejecuta lint, tests y build en cada pull
  request y push a `main`.
- **Pre-commit**: Husky + lint-staged aplican ESLint y Prettier sobre los archivos modificados.

## Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo [LICENSE](LICENSE) para más
detalles.
