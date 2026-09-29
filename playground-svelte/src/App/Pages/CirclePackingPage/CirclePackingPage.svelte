<script lang="ts">
    import {
        CIRCLE_PACKING_DEFAULTS,
        MediaQueryMonitorSvelteUtils,
        TreemapUtils,
    } from "@thewaver/ss-components-svelte";
    import type { CirclePackingNode } from "@thewaver/ss-components-svelte";
    import { CirclePackingKnobs } from "@thewaver/ss-playground/App/Knobs/CirclePackings.const";
    import { LIBRARY } from "@thewaver/ss-playground/App/Pages/TreemapPage/TreemapPage.const";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import LibraryExample from "./Examples/Library.svelte";

    const EXAMPLES_ROOT = "/src/App/Pages/CirclePackingPage/Examples";

    const NO_MOTION_DURATION_MS = 0;
    const WIDE_SPAN = 2;

    let padding = $state(CIRCLE_PACKING_DEFAULTS.padding);
    let zoomDurationMs = $state(CIRCLE_PACKING_DEFAULTS.zoomDurationMs);

    let branch = $state.raw<CirclePackingNode<string>>(LIBRARY);

    const getPrefersReducedMotion = MediaQueryMonitorSvelteUtils.createReducedMotion();

    const prefersReducedMotion = $derived(getPrefersReducedMotion());

    const showing = $derived(
        (TreemapUtils.findPath(LIBRARY, branch) ?? [LIBRARY]).map((node) => node.value).join("/"),
    );

    const examples: ExampleDefs[] = [
        {
            key: "library",
            name: "This library, by lines of code",
            span: WIDE_SPAN,
            readout: () =>
                `showing ${showing} — press a circle with circles inside it to zoom into it, anywhere else to go back to the top, or Escape to go up one level`,
            component: libraryExample,
            path: `${EXAMPLES_ROOT}/Library.svelte`,
        },
    ];
</script>

{#snippet libraryExample()}
    <LibraryExample
        {padding}
        zoomDurationMs={prefersReducedMotion ? NO_MOTION_DURATION_MS : zoomDurationMs}
        bind:branch
    />
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp
        itemKey={"padding"}
        label={"Padding (px)"}
        hint={"The space left between neighboring circles and around the inside of their parent."}
    >
        <PageNumberField
            value={padding}
            min={CirclePackingKnobs.MIN_PADDING}
            max={CirclePackingKnobs.MAX_PADDING}
            step={CirclePackingKnobs.PADDING_STEP}
            ariaLabel={"Padding in pixels"}
            onInput={(value) => {
                padding = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"zoomDurationMs"}
        label={"Zoom duration (ms)"}
        hint={
            "How long a zoom in or out takes. It is off while the visitor has asked for reduced motion, and 0 jumps straight to the new view."
        }
    >
        <PageNumberField
            value={zoomDurationMs}
            min={CirclePackingKnobs.MIN_ZOOM_DURATION_MS}
            max={CirclePackingKnobs.MAX_ZOOM_DURATION_MS}
            step={CirclePackingKnobs.ZOOM_DURATION_STEP_MS}
            isDisabled={prefersReducedMotion}
            ariaLabel={"Zoom duration in milliseconds"}
            onInput={(value) => {
                zoomDurationMs = value;
            }}
        />
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} layout={"flow"} />
