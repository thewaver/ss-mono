# @thewaver/ss-utils

Geometry, CSS, SVG and DOM helpers for building shaped UI.

Framework-agnostic — no dependency on `solid-js` or any other UI library. It's the base
[@thewaver/ss-components](https://www.npmjs.com/package/@thewaver/ss-components) is built on, but
works standalone.

## Install

```
npm install @thewaver/ss-utils
```

## Usage

```ts
import { ShapeConst } from "@thewaver/ss-utils";

const { outerPath } = ShapeConst.getPaths(/* ... */);
```

Every export carries a doc comment describing what it takes, what it returns and what it
guarantees — read it from your editor's hover, or from `dist/index.d.ts`.

## What's here

- **Abstracts** — geometry and math primitives: `angle`, `bitwise`, `bounds`, `color`, `decimal`,
  `dir`, `easing`, `function`, `gesture`, `index2d`, `math`, `matrix3d`, `object`, `point2d`,
  `point3d`, `polygon`, `random`, `rect`, `rotation`, `shape`, `size`, `string`, `time`, `vec2d`,
  `vec3d`, `vec4d`.
- **Web** — browser-facing helpers: CSS (including keyframe generation), DOM, audio, SVG, and JSX
  text metrics/parsing.
- **TypeScript** — shared generic type utilities.

## License

MIT — see [LICENSE](./LICENSE).
