# @thewaver/ss-components-vue

Vue components for building shaped UI.

Headless: every component ships structure, behavior and ARIA wiring, but no color, spacing or
typography. You supply the paint — through class names, inline styles, or a `render`/content slot
where one exists.

Live, editable examples and a full prop table for every component are at
**[ss-components.vercel.app](https://ss-components.vercel.app)**. The examples there are written for Solid; the Vue
components carry the same names and the same props, with plain values where Solid takes getters and `v-model` where
Solid takes a signal — `value`, `visibility` and the rest are named the same in both, so `v-model:value` is the
two-way form of `value`. A `render*` callback in Solid is a slot of the same name in Vue.

## Install

```
npm install @thewaver/ss-components-vue @thewaver/ss-utils vue
```

`@thewaver/ss-utils` and `vue` are peer dependencies, not bundled. The framework-free core,
`@thewaver/ss-components`, comes along as a dependency; everything it exports is re-exported from here.

## Usage

```vue
<script setup lang="ts">
import { Button } from "@thewaver/ss-components-vue";
import "@thewaver/ss-components/styles.css";

const onClick = () => console.log("clicked");
</script>

<template>
    <Button @click="onClick">
        <template #renderContent>Click me</template>
    </Button>
</template>
```

The `styles.css` import is required — it carries the structural CSS (layout, resets, pointer
handling) every component depends on.

## What's here

- **Form controls** — `TextInput`, `TextArea`, `NumberInput`, `CurrencyInput`,
  `DateInput`, `DatePicker`, `DateRangePicker`, `TimeInput`, `TimePicker`, `Calendar`,
  `RangeCalendar`, `ColorInput`, `ColorArea`, `Select`, `MultiSelect`, `Listbox`, `MultiListbox`, `Checkbox`, `CheckboxGroup`, `Radio`,
  `RadioGroup`, `Range`, `Toggle`, `FileInput`, `TagInput`, plus `Form`, `FormField` and
  `FormSection` for wiring labels, descriptions and errors together.
- **Overlays & navigation** — `Modal`, `Drawer`, `HoverCard`, `Popover`, `Tooltip`, `Menu`, `Menubar`, `WheelMenu`,
  `FanMenu`, `Tabs`, `Accordion`, `Collapsible`, `Breadcrumbs`, `Paginator`, `Stepper`,
  `SplitPane`, `Toasts`.
- **Layout & data** — `Table`, `Tree`, `Scroller`, `Sortable`, `SortableGrid`, `ViewportWrapper`,
  `Surface`, `GlassSurface`, `TrackCarousel`, `DrumCarousel`, `Progress`, `Toolbar`.
- **Visual & motion** — `Shape`, `RichText`, `CellAnimation`, `ScanlineAnimation`,
  `Odometer`, `Typewriter`, `ScrambleText`, `FlipCard`, `Cuboid`, `Bracket`, `Formation`,
  `ParticleSpawner`, `PatchBoard`, `Reveal`, `ScratchCard`, `Satellite`, `Staircase`, `TileBoard`,
  `Timeline`, `Trail`, `DrumWheel`, `OverheadWheel`, `ElementMosaic`, `ImageMosaic`.

This list is a sketch, not the catalog — every export, including the lower-level primitives and
abstracts these are built from, is in `dist/index.d.ts` and browsable on the demo site above.

## License

MIT — see [LICENSE](./LICENSE).
