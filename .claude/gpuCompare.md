# Comparing the graphics-card renderer with the element renderer, picture for picture

For the slice animations and particles (`decisions.md`, _"Slice animations: a component takes the recipe"_): does a
component draw the same on the graphics card as on page elements?
Headless, so it runs while the user works. Everything in `CLAUDE.md` still holds: temporary files in `.scratch/`,
nothing installed, stop what you start. The frame-rate comparison is `perfCompare.md`, which needs a real window.

## The setup

1. Build the Solid Playground into `.scratch/gpu/dist`
   (`npx vite build --config ./playground-solid/vite.config.ts --outDir "$PWD/.scratch/gpu/dist" --emptyOutDir`) and
   serve it with `vite preview` on a free port (4193 has been used), checking the port first.
2. Launch Playwright's Chromium **headless with `--enable-unsafe-swiftshader --use-angle=swiftshader`**, or WebGL is
   missing and the components fall back to elements.
3. **Inject a hand-driven clock with `page.addInitScript`**, replacing `performance.now`, `requestAnimationFrame` and
   `cancelAnimationFrame` with a queue that only advances when the script calls `window.__advance(ms)` (16 ms steps).
   Playwright's own `page.clock` leaked real time: the components did not even match themselves.
4. **Seed `Math.random`** in the same init script (a mulberry32 is enough) wherever a stress test picks samples at
   random or a component scatters particles, so both runs make the same picks. Both renderers must call the same
   random-using callbacks in the same order, or the sequences drift apart.
5. For each renderer: load the page, set the knobs, set the stress test's `onGraphicsCard` checkbox
   (`[data-prop][data-testid="onGraphicsCard"] input`), which drives the components' `renderer`, let real time pass so the page settles (`waitForTimeout`), open the stress test, then advance the clock to
   fixed moments and screenshot items by their `img` anchor's box.
6. **Check the harness first**: one renderer against itself must come out identical (difference 0).

## Reading the result

- Compare after **shrinking both pictures** (a quarter for cells, a half for 1 px scanlines), so that sampling
  differences fade and position, size and color errors remain. Report the mean of the largest channel difference.
- **The elements are jagged where the graphics card is smooth**: Chrome samples a picture at low quality while it moves in
  2D, and smoothly in 3D and at rest. That alone gives about 3 to 6 on the shrunk scale; verified samples land there.
  To check geometry exactly, temporarily make `SliceRendererUtils` sample the full picture with plain `LINEAR` filtering, then
  put it back.
- **A box-sized clip cannot see overflow.** Since the cell container stopped clipping, check anything that flies in
  from outside (`tumble_left`) with a clip padded well past the box, on a single item, since in a grid the neighbours'
  overflow lands in each other's space.
- An enlarged side-by-side with a difference map (each pixel's difference times four) shows at a glance whether a
  difference is sampling, timing or geometry.
