<script lang="ts">
    import { MediaQueryMonitorSvelteUtils, SUNBURST_DEFAULTS, TreemapUtils } from "@thewaver/ss-components-svelte";
    import type { SunburstNode } from "@thewaver/ss-components-svelte";
    import { SunburstKnobs } from "@thewaver/ss-playground/App/Knobs/Sunbursts.const";
    import { LIBRARY } from "@thewaver/ss-playground/App/Pages/TreemapPage/TreemapPage.const";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import LibraryExample from "./Examples/Library.svelte";

    const EXAMPLES_ROOT = "/src/App/Pages/SunburstPage/Examples";

    const NO_MOTION_DURATION_MS = 0;
    const WIDE_SPAN = 2;

    let ringCount = $state(SUNBURST_DEFAULTS.ringCount);
    let zoomDurationMs = $state(SUNBURST_DEFAULTS.zoomDurationMs);
    let branch = $state.raw<SunburstNode<string>>(LIBRARY);

    const getPrefersReducedMotion = MediaQueryMonitorSvelteUtils.createReducedMotion();

    const showing = $derived((TreemapUtils.findPath(LIBRARY, branch) ?? [LIBRARY]).map((node) => node.value).join("/"));

    const examples: ExampleDefs[] = [
        {
            key: "library",
            name: "This library, by lines of code",
            span: WIDE_SPAN,
            readout: () =>
                `showing ${showing} — press an arc with rings outside it to zoom into it, and the middle or Escape to come back out`,
            component: libraryExample,
            path: `${EXAMPLES_ROOT}/Library.svelte`,
        },
    ];
</script>

{#snippet libraryExample()}
    <LibraryExample
        {ringCount}
        zoomDurationMs={getPrefersReducedMotion() ? NO_MOTION_DURATION_MS : zoomDurationMs}
        bind:branch
    />
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp itemKey={"ringCount"} label={"Rings"} hint={"How many levels are drawn around the middle at once."}>
        <PageNumberField
            value={ringCount}
            min={SunburstKnobs.MIN_RING_COUNT}
            max={SunburstKnobs.MAX_RING_COUNT}
            step={SunburstKnobs.RING_COUNT_STEP}
            ariaLabel={"Rings"}
            onInput={(value) => {
                ringCount = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"zoomDurationMs"}
        label={"Zoom duration (ms)"}
        hint={"How long a zoom in or out takes. It is off while the visitor has asked for reduced motion, and 0 jumps straight to the new level."}
    >
        <PageNumberField
            value={zoomDurationMs}
            min={SunburstKnobs.MIN_ZOOM_DURATION_MS}
            max={SunburstKnobs.MAX_ZOOM_DURATION_MS}
            step={SunburstKnobs.ZOOM_DURATION_STEP_MS}
            isDisabled={getPrefersReducedMotion()}
            ariaLabel={"Zoom duration in milliseconds"}
            onInput={(value) => {
                zoomDurationMs = value;
            }}
        />
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} layout={"flow"} />
