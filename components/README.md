# @thewaver/ss-components

SolidJS components for building shaped UI.

Headless: every component ships structure, behavior and ARIA wiring, but no color, spacing or
typography. You supply the paint — through class names, inline styles, or a `render`/content prop
where one exists.

Live, editable examples and a full prop table for every component are at
**[ss-components.vercel.app](https://ss-components.vercel.app)**.

## Install

```
npm install @thewaver/ss-components @thewaver/ss-utils solid-js
```

`@thewaver/ss-utils` and `solid-js` are peer dependencies, not bundled.

## Usage

```tsx
import { Button } from "@thewaver/ss-components";
import "@thewaver/ss-components/styles.css";

function Example() {
    return <Button onClick={() => console.log("clicked")} renderContent={() => "Click me"} />;
}
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
- **Visual & motion** — `Shape`, `RichText`, `CellAnimation`, `ScanlineAnimation`, `ScreenWiper`,
  `Odometer`, `Typewriter`, `ScrambleText`, `FlipCard`, `Cuboid`, `Bracket`, `Formation`,
  `ParticleSpawner`, `PatchBoard`, `Reveal`, `ScratchCard`, `Satellite`, `Staircase`, `TileBoard`,
  `Timeline`, `Trail`, `DrumWheel`, `OverheadWheel`, `ElementMosaic`, `ImageMosaic`.

This list is a sketch, not the catalog — every export, including the lower-level primitives and
abstracts these are built from, is in `dist/index.d.ts` and browsable on the demo site above.

## License

MIT — see [LICENSE](./LICENSE).
