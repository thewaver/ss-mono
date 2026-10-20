# Technical review: `thewaver/ss-mono`

**Commit reviewed:** [`91c47a3270af18bafd6ee7f191be6caf6102cb15`](https://github.com/thewaver/ss-mono/tree/91c47a3270af18bafd6ee7f191be6caf6102cb15)  
**Review date:** 2026-10-20  
**Review model:** GPT-6 Astra, xhigh reasoning, with independent security, accessibility, release, and correctness/performance passes.

## Executive summary

The repository has a strong shared-core design, unusually detailed internal decisions, and broad unit coverage. The framework library packages build, and all **3,251 unit tests in 191 files** pass. `npm audit` reports **zero known advisories across 457 dependencies**.

The current commit is not release-ready, however:

- Every Playground build fails because all four Treemap pages import four constants that no longer exist.
- The published Svelte package omits a dependency required at consumer build time.
- The Svelte peer range accepts versions that do not provide an API the package calls.
- The network-bound Playground development server can disclose files outside the repository through a custom Vite plugin.
- Focus, labeling, activation, virtualization, animation cancellation, and large-tree paths contain reproducible defects.

The most important action is to add a clean, release-shaped gate. The present root `build` and unit-test commands can both pass while the site and a clean Svelte consumer are broken.

## Scope and method

I reviewed the framework-free core, the Solid, React, Vue, and Svelte bindings, shared Playground code, package metadata, and deployment configuration. I read the repository's conventions, decisions, and backlog first so that accepted or already-recorded limits were not presented as new findings.

Checks run:

- `npm ci`: passed.
- `npm test`: passed, 3,251 tests in 191 files.
- `npm run build`: passed for utils and all five library packages.
- Individual builds of `playground-solid`, `playground-react`, `playground-vue`, and `playground-svelte`: all failed on the same missing Treemap exports.
- Workspace type-check: failed on those same missing exports. Svelte also reported 32 accessibility warnings.
- `npm audit` and `npm audit --omit=dev`: zero known advisories.
- Focused Chrome reproductions: SlideButton activation, Label plus TagInput association, React Table/Tree virtualization, virtualized Table focus, Table layout, and forced-colors behavior.
- Focused source-level probes: TurnClock cancellation/failure paths and Tree expansion cost.

The full Playwright suite could not start because its web servers first build the Playgrounds, which currently fail. Cross-port statements below distinguish browser-confirmed behavior from source parity.

## Findings at a glance

| Priority | Severity | Finding                                                                                   |
| -------- | -------- | ----------------------------------------------------------------------------------------- |
| P0       | Critical | All four Playground builds are broken                                                     |
| P0       | High     | The Svelte package omits a required runtime dependency                                    |
| P0       | Medium   | The Svelte peer range accepts incompatible Svelte versions                                |
| P1       | Medium   | The Playground dev server can disclose arbitrary local files                              |
| P1       | High     | SlideButton ignores device-independent activation                                         |
| P1       | High     | Virtualized Table navigation can drop focus to the page                                   |
| P1       | Medium   | Label plus TagInput labels a remove button and leaves the textbox unnamed                 |
| P1       | Medium   | Table and Tree can render no data when estimates are enabled without an overflow ancestor |
| P1       | Medium   | A canceled turn can continue and report completion                                        |
| P1       | Medium   | A synchronous target error permanently blocks another spin or roll                        |
| P2       | Medium   | Certain valid column IDs invalidate the whole Table grid                                  |
| P2       | Medium   | Expanding a large Tree performs quadratic membership work                                 |
| P3       | Low      | Malformed RichText can exhaust CPU or the call stack when content is untrusted            |
| P3       | Low      | Inherited ImageMosaic cache keys suppress legitimate images                               |
| P2       | Warning  | The Playground Range disappears in forced-colors mode                                     |

## Detailed findings

### 1. Critical: all four Playground builds are broken

The Solid, React, Vue, and Svelte Treemap pages import `EXAMPLES_ROOT`, `EXAMPLE_NAMES`, `NO_MOTION_DURATION_MS`, and `WIDE_SPAN`, for example at [`playground-solid/src/App/Pages/TreemapPage/TreemapPage.tsx:5`](https://github.com/thewaver/ss-mono/blob/91c47a3270af18bafd6ee7f191be6caf6102cb15/playground-solid/src/App/Pages/TreemapPage/TreemapPage.tsx#L5-L11). The shared constants file exports `LIBRARY` but none of those four names: [`playground/src/App/Pages/TreemapPage/TreemapPage.const.ts:1`](https://github.com/thewaver/ss-mono/blob/91c47a3270af18bafd6ee7f191be6caf6102cb15/playground/src/App/Pages/TreemapPage/TreemapPage.const.ts#L1-L9).

All four production builds fail on these missing exports. This also prevents Playwright from starting any Playground server. The normal root `build` still passes because it builds only publishable packages, not the Playgrounds: [`package.json:25`](https://github.com/thewaver/ss-mono/blob/91c47a3270af18bafd6ee7f191be6caf6102cb15/package.json#L25-L31). The deployment build does include all four Playgrounds: [`playground/scripts/buildSite.mjs:8`](https://github.com/thewaver/ss-mono/blob/91c47a3270af18bafd6ee7f191be6caf6102cb15/playground/scripts/buildSite.mjs#L8-L30).

**Impact:** The documented site cannot be built or deployed from this commit, and the browser suite cannot run. The passing root build creates a false release signal.

**Recommendation:** Restore or relocate the four shared constants, then add a single release gate that runs workspace type-checking, all four Playground builds or `build:site`, and browser tests. Keep the faster package-only build, but do not use it as the release verdict.

### 2. High: the Svelte package omits a required runtime dependency

`components-svelte` uses `svelte-package`, which preserves source imports, but `@vanilla-extract/dynamic` is listed only under development dependencies: [`components-svelte/package.json:118`](https://github.com/thewaver/ss-mono/blob/91c47a3270af18bafd6ee7f191be6caf6102cb15/components-svelte/package.json#L118-L137). Shipped components import and call it at runtime, including [`components-svelte/src/Composites/Surface/Surface.svelte:4`](https://github.com/thewaver/ss-mono/blob/91c47a3270af18bafd6ee7f191be6caf6102cb15/components-svelte/src/Composites/Surface/Surface.svelte#L4-L8) and [`components-svelte/src/Composites/Surface/Surface.svelte:45`](https://github.com/thewaver/ss-mono/blob/91c47a3270af18bafd6ee7f191be6caf6102cb15/components-svelte/src/Composites/Surface/Surface.svelte#L45-L53). The same import appears in ten other shipped components, including Table and Tooltip.

An isolated consumer build of the emitted `Surface` artifact failed with an unresolved `@vanilla-extract/dynamic` import. Making only that package available caused the same build to pass. The workspace hides the defect because its development dependency is visible.

**Impact:** A clean consumer can install the published package successfully and then fail to build an affected component.

**Recommendation:** Move `@vanilla-extract/dynamic` into `components-svelte` runtime dependencies. Add a smoke build that installs packed artifacts outside the workspace and imports representative components.

### 3. Medium: the Svelte peer range accepts incompatible versions

The package declares `svelte: "^5.0.0"`: [`components-svelte/package.json:125`](https://github.com/thewaver/ss-mono/blob/91c47a3270af18bafd6ee7f191be6caf6102cb15/components-svelte/package.json#L125-L136). The bindings destructure and call the third `hasContext` result from `createContext`: [`components-svelte/src/Essentials/Input/Label/Label.context.ts:1`](https://github.com/thewaver/ss-mono/blob/91c47a3270af18bafd6ee7f191be6caf6102cb15/components-svelte/src/Essentials/Input/Label/Label.context.ts#L1-L9). Svelte added that third result in 5.57.0. Versions such as 5.50.0 satisfy the declared peer range but return only `[get, set]`, so the call reaches `undefined` during component setup.

The mismatch is hidden because local development uses Svelte `^5.57.2`. See the [Svelte 5.57.0 changelog](https://github.com/sveltejs/svelte/blob/svelte%405.57.2/packages/svelte/CHANGELOG.md#5570).

**Impact:** npm can accept an apparently compatible Svelte installation and the component can then fail at startup.

**Recommendation:** Raise the peer minimum to at least `^5.57.0` and test one packed consumer against that exact minimum.

### 4. High, WCAG: SlideButton ignores device-independent activation

The exposed native button handles low-level pointer movement and selected keyboard events, but has no `click` handler. The omission exists in Solid at [`components-solid/src/Essentials/Buttons/SlideButton/SlideButton.tsx:47`](https://github.com/thewaver/ss-mono/blob/91c47a3270af18bafd6ee7f191be6caf6102cb15/components-solid/src/Essentials/Buttons/SlideButton/SlideButton.tsx#L47-L50) and [`components-solid/src/Essentials/Buttons/SlideButton/SlideButton.tsx:67`](https://github.com/thewaver/ss-mono/blob/91c47a3270af18bafd6ee7f191be6caf6102cb15/components-solid/src/Essentials/Buttons/SlideButton/SlideButton.tsx#L67-L97), and the React, Vue, and Svelte ports have the same structure.

A real Solid SlideButton with `holdDurationMs=0` appeared in Chrome's accessibility tree as `button "Confirm"`. Calling the native button's `click()` did not activate it. This directly contradicts the documented idea that a zero hold duration supplies a single-activation assistive route.

**Impact:** Assistive technology commonly activates controls through the device-independent click event. That exposed operation does nothing. The timed keyboard requirement is also already a known dexterity concern.

**Standards:** [WCAG 2.2 SC 4.1.2, Name, Role, Value](https://www.w3.org/TR/WCAG22/#name-role-value) requires user-settable values to be programmatically settable. [SC 2.1.1, Keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html) is supporting context. MDN describes [`click` as device-independent](https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event).

**Recommendation:** Add an explicit default-action activation route. Preserve the hold/drag pointer gesture, and suppress the follow-up click after a completed gesture so activation cannot occur twice. Test click-only activation at default and zero duration in every port.

### 5. High, WCAG: virtualized Table navigation can drop focus to the page

In a 30-row virtualized React Table, focusing the first body cell and pressing Ctrl+End mounted the last row but moved `document.activeElement` to `BODY`. The last cell received `tabindex=0`, yet ArrowUp no longer worked.

The React binding updates state, scrolls, and immediately queries the target DOM node before React mounts it: [`components-react/src/Essentials/Table/Table.tsx:185`](https://github.com/thewaver/ss-mono/blob/91c47a3270af18bafd6ee7f191be6caf6102cb15/components-react/src/Essentials/Table/Table.tsx#L185-L190). Vue and Svelte repeat the same immediate lookup. Tree already solves this exact timing problem with a pending focus ID and a post-commit focus effect: [`components-react/src/Essentials/Tree/Tree.tsx:146`](https://github.com/thewaver/ss-mono/blob/91c47a3270af18bafd6ee7f191be6caf6102cb15/components-react/src/Essentials/Tree/Tree.tsx#L146-L172). This is both a defect and a clear internal pattern outlier.

**Impact:** Standard grid navigation loses the user's place and breaks the next keyboard command.

**Standards:** [WCAG 2.2 SC 2.4.3, Focus Order](https://www.w3.org/TR/WCAG22/#focus-order) and the [ARIA Authoring Practices grid pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/).

**Recommendation:** Reuse Tree's pending-focus/post-render pattern in Table's bindings. Test a movement that crosses the mounted window, assert the destination owns DOM focus, then issue a second arrow command.

### 6. Medium, WCAG: Label plus TagInput labels the wrong control

`Label` uses implicit HTML association by wrapping its children: [`components-solid/src/Essentials/Input/Label/Label.tsx:23`](https://github.com/thewaver/ss-mono/blob/91c47a3270af18bafd6ee7f191be6caf6102cb15/components-solid/src/Essentials/Input/Label/Label.tsx#L23-L32). With one or more tags, TagInput renders tag-removal buttons before the textbox: [`components-solid/src/Essentials/Input/TagInput/TagInput.tsx:143`](https://github.com/thewaver/ss-mono/blob/91c47a3270af18bafd6ee7f191be6caf6102cb15/components-solid/src/Essentials/Input/TagInput/TagInput.tsx#L143-L185). The textbox also drops its own `aria-label` merely because a Label context exists: [`components/src/Essentials/Input/Label/Label.utils.ts:18`](https://github.com/thewaver/ss-mono/blob/91c47a3270af18bafd6ee7f191be6caf6102cb15/components/src/Essentials/Input/Label/Label.utils.ts#L18-L19).

In Chrome, `label.control` was the first remove button. The accessibility tree contained an unnamed textbox. Clicking the visible caption deleted the first tag instead of focusing the field. React, Vue, and Svelte have the same order and suppression rule.

**Impact:** Screen-reader and voice users cannot identify the textbox from its visible caption. Pointer users can accidentally remove data by clicking that caption.

**Standards:** [WCAG 1.3.1, Info and Relationships](https://www.w3.org/TR/WCAG22/#info-and-relationships), [2.5.3, Label in Name](https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html), and 4.1.2.

**Recommendation:** Give the textbox an explicit ID and associate the caption with that exact control. Do not suppress the textbox name unless the association actually exists. Test empty and populated TagInput states and caption clicks in every port.

### 7. Medium: estimates can make Table and Tree content disappear

The shared Virtualizer returns no scrolling element when no ancestor has an accepted overflow style: [`components/src/Abstracts/Virtualizer/Virtualizer.utils.ts:19`](https://github.com/thewaver/ss-mono/blob/91c47a3270af18bafd6ee7f191be6caf6102cb15/components/src/Abstracts/Virtualizer/Virtualizer.utils.ts#L19-L28). The React adapter then marks virtualization inactive and says callers should draw the whole list: [`components-react/src/Abstracts/Virtualizer/VirtualizerReact.utils.ts:48`](https://github.com/thewaver/ss-mono/blob/91c47a3270af18bafd6ee7f191be6caf6102cb15/components-react/src/Abstracts/Virtualizer/VirtualizerReact.utils.ts#L48-L53) and [`components-react/src/Abstracts/Virtualizer/VirtualizerReact.utils.ts:109`](https://github.com/thewaver/ss-mono/blob/91c47a3270af18bafd6ee7f191be6caf6102cb15/components-react/src/Abstracts/Virtualizer/VirtualizerReact.utils.ts#L109-L117). Table and Tree instead select virtual rows solely because an estimate prop exists: [`components-react/src/Essentials/Table/Table.tsx:631`](https://github.com/thewaver/ss-mono/blob/91c47a3270af18bafd6ee7f191be6caf6102cb15/components-react/src/Essentials/Table/Table.tsx#L631-L641) and [`components-react/src/Essentials/Tree/Tree.tsx:429`](https://github.com/thewaver/ss-mono/blob/91c47a3270af18bafd6ee7f191be6caf6102cb15/components-react/src/Essentials/Tree/Tree.tsx#L429-L436).

In Chrome, a normal document-flow 30-row Table rendered only its header and a 30-node Tree rendered zero treeitems. Removing only the estimate restored all data. Putting the same Table in `overflow:auto` rendered a normal window, proving the data and renderers were valid. Equivalent switches exist in the other bindings.

**Impact:** Enabling an optimization can silently remove real content from both the visual and accessibility trees. The prop contracts do not document a required overflow ancestor.

**Recommendation:** When `rowWindow.isLive` is false, render normal rows and omit the virtual spacer regardless of whether an estimate was supplied. Test document scrolling and overflow-container scrolling in each binding.

### 8. Medium: a canceled turn can continue and report completion

`createTween.cancel()` clears only the currently recorded animation-frame ID: [`components/src/Abstracts/TurnClock/TurnClock.utils.ts:32`](https://github.com/thewaver/ss-mono/blob/91c47a3270af18bafd6ee7f191be6caf6102cb15/components/src/Abstracts/TurnClock/TurnClock.utils.ts#L32-L38). A running frame calls `onFrame` and then unconditionally requests another frame: [`components/src/Abstracts/TurnClock/TurnClock.utils.ts:60`](https://github.com/thewaver/ss-mono/blob/91c47a3270af18bafd6ee7f191be6caf6102cb15/components/src/Abstracts/TurnClock/TurnClock.utils.ts#L60-L68). If `onFrame` causes cleanup, the cancel occurs before that new request exists. The same file's `runFrames` correctly rechecks activity after its callback.

A source-level Rotator probe called `stop()` on the first nonzero angle. It still reached angle 540, wrote target 3, and called `onSpinEnd` once. The clock is shared by Wheel/Rotator and Die/Roller.

**Impact:** An unmounted or replaced component can still receive a stale landing, announcement, or completion callback.

**Recommendation:** Give each run a generation token and recheck it immediately after `onFrame` before scheduling more work. Test cancellation and replacement from inside the frame callback, not only between frames.

### 9. Medium: a synchronous target error permanently blocks another spin or roll

`createTargetRequest` evaluates `compute()` before `Promise.resolve`, so a synchronous throw bypasses its rejection handler: [`components/src/Abstracts/TurnClock/TurnClock.utils.ts:133`](https://github.com/thewaver/ss-mono/blob/91c47a3270af18bafd6ee7f191be6caf6102cb15/components/src/Abstracts/TurnClock/TurnClock.utils.ts#L133-L146). Rotator marks itself as awaiting a target before the call and clears that state only through the refusal callback: [`components/src/Abstracts/Rotator/Rotator.utils.ts:160`](https://github.com/thewaver/ss-mono/blob/91c47a3270af18bafd6ee7f191be6caf6102cb15/components/src/Abstracts/Rotator/Rotator.utils.ts#L160-L191). Roller follows the same pattern.

A probe with a synchronously throwing target function left Rotator in `isAwaitingTarget: true`; every later `spin()` returned false. A rejected Promise recovers correctly.

**Impact:** One consumer callback or adapter failure permanently disables the mounted control.

**Recommendation:** Route synchronous exceptions through the same refusal cleanup as rejected Promises. Add the throwing case beside existing rejected-Promise coverage and assert a later spin or roll can begin.

### 10. Medium: valid column IDs can invalidate the whole Table grid

The shared width helper reads `widths[column.id]` without checking that the key belongs to the object: [`components/src/Essentials/Table/Table.utils.ts:115`](https://github.com/thewaver/ss-mono/blob/91c47a3270af18bafd6ee7f191be6caf6102cb15/components/src/Essentials/Table/Table.utils.ts#L115-L129). That value is interpolated into the complete grid template at [`components/src/Essentials/Table/Table.utils.ts:143`](https://github.com/thewaver/ss-mono/blob/91c47a3270af18bafd6ee7f191be6caf6102cb15/components/src/Essentials/Table/Table.utils.ts#L143-L144).

With the ordinary default `{}`, a column ID of `constructor` returns the inherited `Object` constructor. The helper produced `function Object() { [native code] }px`; Chrome rejected the intended two-column template and created one implicit track. `toString` behaves similarly. This violates the repository's own rule that externally supplied keys must use `Object.hasOwn`.

**Impact:** Perfectly valid application data can collapse an entire table layout. This is not prototype pollution or code execution.

**Recommendation:** Use `Object.hasOwn(widths, column.id)` before reading the stored width, otherwise use the column default. Add tests for `constructor`, `toString`, and `__proto__`, both with and without an own stored value.

### 11. Medium, performance: large expanded Trees do quadratic membership work

Each framework binding passes `expanded.includes(value)` into the shared tree walk, for example [`components-react/src/Essentials/Tree/Tree.tsx:113`](https://github.com/thewaver/ss-mono/blob/91c47a3270af18bafd6ee7f191be6caf6102cb15/components-react/src/Essentials/Tree/Tree.tsx#L113-L117). The flattener invokes that test for each visible branch before windowing: [`components/src/Abstracts/Flattener/Flattener.utils.ts:50`](https://github.com/thewaver/ss-mono/blob/91c47a3270af18bafd6ee7f191be6caf6102cb15/components/src/Abstracts/Flattener/Flattener.utils.ts#L50-L70).

Using the real shared helper with 20,000 flat expanded branches took about **290 to 310 ms** locally. The same helper and data with a Set-backed membership function took about **2 ms**. Measurements at 2k, 5k, 10k, and 20k branches followed the expected quadratic curve.

**Impact:** Expanding or refreshing a large tree can pause the main thread even when only a small DOM window is mounted.

**Recommendation:** Build a memoized Set once when the public expanded array changes, then pass `.has` to the existing helper. Keep the public API unchanged. Test output equivalence and use an operation-count or benchmark check rather than a fragile wall-clock assertion.

### 12. Warning, WCAG: the Playground Range disappears in forced-colors mode

The shared Range painter uses backgrounds for its track and selected fill and a box shadow for the track edge: [`playground/src/App/StyledComponents/RangeContent/RangeContent.css.ts:35`](https://github.com/thewaver/ss-mono/blob/91c47a3270af18bafd6ee7f191be6caf6102cb15/playground/src/App/StyledComponents/RangeContent/RangeContent.css.ts#L35-L40) and [`playground/src/App/StyledComponents/RangeContent/RangeContent.css.ts:59`](https://github.com/thewaver/ss-mono/blob/91c47a3270af18bafd6ee7f191be6caf6102cb15/playground/src/App/StyledComponents/RangeContent/RangeContent.css.ts#L59-L68). It has no forced-colors fallback. The hidden native range has also been visually stripped.

Chrome forced-colors emulation changed both custom paints to white over a white Canvas background and removed the shadow. Their contrast became 1:1. The thumb's black border remained visible.

**Impact:** Windows high-contrast users can lose the track and selected range. This is a warning about the Playground's styling, not a request to alter its normal theme colors.

**Standard:** [WCAG 2.2 SC 1.4.11, Non-text Contrast](https://www.w3.org/TR/WCAG22/#non-text-contrast).

**Recommendation:** In forced-colors mode, draw the track and fill with system colors, a border, or another paint that remains visible. Keep the normal theme unchanged.

## Security and OWASP assessment

### Medium: the Playground dev server can disclose arbitrary local files

The custom `playgroundSource` Vite plugin treats every virtual ID beginning with `\0source:` as trusted, extracts the remainder as a path, and reads it directly: [`playground/vite/playgroundSource.ts:8`](https://github.com/thewaver/ss-mono/blob/91c47a3270af18bafd6ee7f191be6caf6102cb15/playground/vite/playgroundSource.ts#L8-L27). Its `load` hook does not verify that the ID was created by the plugin's own `resolveId` hook and does not confine the path to an approved source root.

A harmless canary file outside Vite's allowed roots proved the bypass. The normal `/@fs/<absolute-path>` request returned **403**. A crafted `/@id/__x00__source:<absolute-path>.source?import` request returned **200** and exported the canary contents. The Playground start scripts bind Vite with `--host`, for example [`playground-solid/package.json:6`](https://github.com/thewaver/ss-mono/blob/91c47a3270af18bafd6ee7f191be6caf6102cb15/playground-solid/package.json#L6-L10), so the development server is reachable beyond loopback when the network permits it.

**Impact:** While a developer runs the Playground, an unauthenticated network client can request files readable by that operating-system account, including files outside the repository. This affects development only; the static production build does not include a Vite file-reading server.

**OWASP:** This is an [A05:2021 Security Misconfiguration](https://owasp.org/Top10/2021/A05_2021-Security_Misconfiguration/) issue with CWE-22 and CWE-200 effects. Vite's ordinary filesystem allowlist does not protect reads performed directly by a plugin.

**Recommendation:** In `resolveId`, record only successfully resolved source IDs. In `load`, reject IDs not issued by that path and reject canonical paths outside a small explicit set of source roots. Treat URL decoding, separators, symlinks, and case rules carefully. Add an integration test proving a valid `?source` import works and a canary outside every allowed root receives 403. Bind to loopback by default; use `--host` only when remote device testing is intended.

### Low, conditional: malformed RichText can block or crash rendering

`RichTextUtils.parseContent` accepts an arbitrary string and freely nested tags. When it turns an unclosed tree back into text, it calls recursive `stringifyNode`: [`components/src/Exotics/Text/RichText/RichText.utils.ts:8`](https://github.com/thewaver/ss-mono/blob/91c47a3270af18bafd6ee7f191be6caf6102cb15/components/src/Exotics/Text/RichText/RichText.utils.ts#L8-L12) and [`components/src/Exotics/Text/RichText/RichText.utils.ts:139`](https://github.com/thewaver/ss-mono/blob/91c47a3270af18bafd6ee7f191be6caf6102cb15/components/src/Exotics/Text/RichText/RichText.utils.ts#L139-L147). Closing tags also search the current stack backwards: [`components/src/Exotics/Text/RichText/RichText.utils.ts:78`](https://github.com/thewaver/ss-mono/blob/91c47a3270af18bafd6ee7f191be6caf6102cb15/components/src/Exotics/Text/RichText/RichText.utils.ts#L78-L116).

Using the original parser source:

- About 70 KB containing 10,000 valid nested but unclosed tags threw `RangeError: Maximum call stack size exceeded`.
- A 70 KB adversarial unmatched-tag case took about 0.29 seconds synchronously.
- The same pattern at 280 KB took about 4.13 seconds, consistent with super-linear work.

**Impact:** If a consuming application passes attacker-controlled or merely unbounded user content into RichText, one string can crash the render path or freeze the browser's main thread. The current static Playground does not establish such a remote trust path, so this is a conditional library risk, not a claimed remotely exploitable defect in the demo site.

**OWASP:** This matches the [OWASP Denial of Service Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html) and CWE-400/CWE-674.

**Recommendation:** Replace recursive fallback stringification with an iterative form. Make malformed closing-tag handling linear, cap nesting depth, and document a supported input-size boundary. A consuming server should also enforce content-size limits before storing or rendering untrusted markup. Add tests at the depth boundary and adversarial scaling tests that count operations rather than assert machine-specific times.

### Low: inherited ImageMosaic cache keys suppress legitimate images

ImageMosaic initializes its size cache with a normal object and reads it using caller-supplied `source.src` strings without own-key checks: [`components/src/Exotics/Mosaics/ImageMosaic/ImageMosaic.utils.ts:28`](https://github.com/thewaver/ss-mono/blob/91c47a3270af18bafd6ee7f191be6caf6102cb15/components/src/Exotics/Mosaics/ImageMosaic/ImageMosaic.utils.ts#L28-L28) and [`components/src/Exotics/Mosaics/ImageMosaic/ImageMosaic.utils.ts:78`](https://github.com/thewaver/ss-mono/blob/91c47a3270af18bafd6ee7f191be6caf6102cb15/components/src/Exotics/Mosaics/ImageMosaic/ImageMosaic.utils.ts#L78-L112). A legitimate relative source such as `constructor` or `toString` is therefore treated as already measured before any `Image` is created. The later lookup returns an inherited function instead of the empty-size fallback.

**Impact:** Valid images can be skipped and downstream layout receives the wrong type. This is a correctness and convention defect, not demonstrated prototype pollution or privilege escalation.

**Recommendation:** Use `Object.hasOwn` for both reads, or store sizes in `Map` or a null-prototype object. Add `constructor`, `toString`, and `__proto__` cases. This is the same narrow internal convention broken independently by Table column widths, which suggests an own-key test helper or lint check may be useful.

### Security checks with no confirmed finding

- `npm audit` reported no known advisories in 457 dependencies, both with and without development dependencies.
- RichText does not itself write allowed attributes to DOM elements. It hands unvetted values to the consumer's `renderTag` callback and documents that trust boundary at [`components/src/Exotics/Text/RichText/RichText.types.ts:19`](https://github.com/thewaver/ss-mono/blob/91c47a3270af18bafd6ee7f191be6caf6102cb15/components/src/Exotics/Text/RichText/RichText.types.ts#L19-L33). Consumers that turn an `href` into a link must still allowlist schemes such as `https:`, but this review did not confirm a library-owned XSS sink.
- The own-key Table defect in finding 10 is a functional inherited-property lookup. It does not mutate prototypes and was not presented as prototype pollution.
- No credentials or secrets were printed or included in this report; the file-disclosure proof used a purpose-made canary.

## Architecture and abstraction notes

The repository already makes the important split correctly: algorithms, geometry, stores, and interaction rules live in the framework-free core, while lifecycle and rendering stay framework-specific. I would not replace the four bindings with code generation solely to reduce file count.

The best abstraction opportunities are narrower and evidence-backed:

1. Reuse Tree's pending-focus/post-render mechanism for virtualized Table focus.
2. Make the Virtualizer's inactive fallback a shared invariant so bindings cannot accidentally select an empty virtual branch.
3. Use `runFrames`' post-callback cancellation check as the model for `createTween`.
4. Convert expanded Tree values to a Set once per change, through the membership callback the core already accepts.
5. Test packed packages outside npm workspaces, especially the source-preserving Svelte package.

These changes reduce pattern drift without hiding framework lifecycle differences behind a large abstraction.

## Verification gaps and suggested gate

A practical release gate for this repository should run, in order:

1. `npm ci`
2. `npm run typecheck --workspaces --if-present`
3. `npm test`
4. `npm run build`
5. `npm run build:site`
6. `npm run verify:dom`
7. Pack each public package and build one minimal consumer outside the workspace dependency tree.

The current commit fails at step 2 and step 5. Browser verification is then blocked. A single in-repo CI job running this sequence would have caught both the Treemap break and the missing Svelte consumer dependency before release. No `.github/workflows` gate is present at this commit; an external CI system may exist, but it is not visible here.

## Verified strengths

- **Broad unit coverage:** 3,251 passing tests across 191 files.
- **No known dependency advisories:** npm reported zero vulnerabilities in production and full trees.
- **Well-factored shared core:** navigation arithmetic, geometry, stores, and motion primitives are not independently reimplemented for every framework.
- **Strong focus and modal primitives:** focus traversal excludes hidden and inert nodes, restores focus, and seals modal siblings.
- **Hidden content is usually hidden semantically:** inactive carousel slides and hidden 3D faces use both `aria-hidden` and `inert`.
- **Live announcements are robust:** persistent regions and distinct message nodes avoid common screen-reader announcement loss.
- **Reduced motion is integrated in core interactions:** PlacementBox and several animated examples use actual media-query state rather than theme-only switches.
- **Known limits are documented honestly:** existing Menu, Spotlight, Table interaction, drag-only, visual-regression, and form-serialization gaps were not relabeled as new discoveries here.

## Recommended order of work

1. Repair the shared Treemap exports and make all four Playground builds green.
2. Correct Svelte runtime dependencies and peer minimum, then prove packed consumer builds.
3. Close the Playground source-plugin file-read bypass.
4. Fix SlideButton activation and virtualized Table focus.
5. Fix Virtualizer fallback, TagInput labeling, and the two TurnClock failure paths.
6. Harden RichText limits, own-key caches/lookups, and large-Tree membership.
7. Add the release-shaped verification gate, then address the forced-colors warning.
