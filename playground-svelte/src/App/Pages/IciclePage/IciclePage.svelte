<script lang="ts">
    import { ICICLE_DEFAULTS, MediaQueryMonitorSvelteUtils, TreemapUtils } from "@thewaver/ss-components-svelte";
    import type { IcicleNode } from "@thewaver/ss-components-svelte";
    import { IcicleKnobs } from "@thewaver/ss-playground/App/Knobs/Icicles.const";
    import { LIBRARY } from "@thewaver/ss-playground/App/Pages/TreemapPage/TreemapPage.const";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import LibraryExample from "./Examples/Library.svelte";

    const EXAMPLES_ROOT = "/src/App/Pages/IciclePage/Examples";

    const NO_MOTION_DURATION_MS = 0;
    const WIDE_SPAN = 2;

    let columnCount = $state(ICICLE_DEFAULTS.columnCount);
    let zoomDurationMs = $state(ICICLE_DEFAULTS.zoomDurationMs);

    let focus = $state.raw<IcicleNode<string>>(LIBRARY);

    const getPrefersReducedMotion = MediaQueryMonitorSvelteUtils.createReducedMotion();

    const showing = $derived((TreemapUtils.findPath(LIBRARY, focus) ?? [LIBRARY]).map((node) => node.value).join("/"));

    const examples: ExampleDefs[] = [
        {
            key: "library",
            name: "This library, by lines of code",
            span: WIDE_SPAN,
            readout: () =>
                `showing ${showing} — press any cell to bring it to the left at full height, the leftmost cell or Escape to go back up; the arrows walk up and down a column and across to a parent or its children`,
            component: libraryExample,
            path: `${EXAMPLES_ROOT}/Library.svelte`,
        },
    ];
</script>

{#snippet libraryExample()}
    <LibraryExample
        {columnCount}
        zoomDurationMs={getPrefersReducedMotion() ? NO_MOTION_DURATION_MS : zoomDurationMs}
        bind:focus
    />
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp
        itemKey={"columnCount"}
        label={"Columns"}
        hint={"How many levels fit across at once, counting the one in view."}
    >
        <PageNumberField
            value={columnCount}
            min={IcicleKnobs.MIN_COLUMN_COUNT}
            max={IcicleKnobs.MAX_COLUMN_COUNT}
            step={IcicleKnobs.COLUMN_COUNT_STEP}
            ariaLabel={"Columns"}
            onInput={(value) => {
                columnCount = value;
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
            min={IcicleKnobs.MIN_ZOOM_DURATION_MS}
            max={IcicleKnobs.MAX_ZOOM_DURATION_MS}
            step={IcicleKnobs.ZOOM_DURATION_STEP_MS}
            isDisabled={getPrefersReducedMotion()}
            ariaLabel={"Zoom duration in milliseconds"}
            onInput={(value) => {
                zoomDurationMs = value;
            }}
        />
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} layout={"flow"} />
