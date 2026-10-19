<script lang="ts">
    import { MediaQueryMonitorSvelteUtils, TREEMAP_DEFAULTS, TreemapUtils } from "@thewaver/ss-components-svelte";
    import type { TreemapNode } from "@thewaver/ss-components-svelte";
    import { TreemapKnobs } from "@thewaver/ss-playground/App/Knobs/Treemaps.const";
    import {
    EXAMPLE_NAMES,
    EXAMPLES_ROOT,
    LIBRARY,
    NO_MOTION_DURATION_MS,
    WIDE_SPAN,
} from "@thewaver/ss-playground/App/Pages/TreemapPage/TreemapPage.const";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import LibraryExample from "./Examples/Library.svelte";

    let zoomDurationMs = $state(TREEMAP_DEFAULTS.zoomDurationMs);

    let branch = $state.raw<TreemapNode<string>>(LIBRARY);

    const getPrefersReducedMotion = MediaQueryMonitorSvelteUtils.createReducedMotion();

    const showing = $derived((TreemapUtils.findPath(LIBRARY, branch) ?? [LIBRARY]).map((node) => node.value).join("/"));

    const examples: ExampleDefs[] = [
        {
            key: "library",
            name: EXAMPLE_NAMES.library,
            span: WIDE_SPAN,
            readout: () =>
                `showing ${showing} — press a branch to zoom into it, and the bar above or Escape to come back out; a leaf has nothing inside it and does not answer a press`,
            component: libraryExample,
            path: `${EXAMPLES_ROOT}/Library.svelte`,
        },
    ];
</script>

{#snippet libraryExample()}
    <LibraryExample zoomDurationMs={getPrefersReducedMotion() ? NO_MOTION_DURATION_MS : zoomDurationMs} bind:branch />
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp
        itemKey={"zoomDurationMs"}
        controls={"Sets TreemapProps.zoomDurationMs"}
        label={"Zoom duration (ms)"}
        hint={
            "How long a zoom in or out takes. It is off while the visitor has asked for reduced motion, and 0 jumps straight to the new level."
        }
    >
        <PageNumberField
            value={zoomDurationMs}
            min={TreemapKnobs.MIN_ZOOM_DURATION_MS}
            max={TreemapKnobs.MAX_ZOOM_DURATION_MS}
            step={TreemapKnobs.ZOOM_DURATION_STEP_MS}
            isDisabled={getPrefersReducedMotion()}
            ariaLabel={"Zoom duration in milliseconds"}
            onInput={(value) => {
                zoomDurationMs = value;
            }}
        />
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} layout={"flow"} />
