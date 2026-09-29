<script lang="ts">
    import { EDGE_FADER_DEFAULTS } from "@thewaver/ss-components-svelte";
    import { EdgeFaderKnobs } from "@thewaver/ss-playground/App/Knobs/EdgeFaders.const";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import CardExample from "./Examples/Card.svelte";
    import ColumnExample from "./Examples/Column.svelte";
    import GridExample from "./Examples/Grid.svelte";
    import StripExample from "./Examples/Strip.svelte";

    const EXAMPLES_ROOT = "/src/App/Pages/EdgeFaderPage/Examples";

    let size = $state(EDGE_FADER_DEFAULTS.size);
    let isScrollAware = $state(EDGE_FADER_DEFAULTS.isScrollAware);

    const modeText = $derived(
        isScrollAware
            ? "a side fades only while there is more past it, and sharpens as that end arrives"
            : "the chosen sides are faded wherever the scroll stands",
    );

    const examples: ExampleDefs[] = [
        {
            key: "column",
            name: "Top and bottom",
            readout: () => `a scrolling column — ${modeText}`,
            component: columnExample,
            path: `${EXAMPLES_ROOT}/Column.svelte`,
        },
        {
            key: "strip",
            name: "Left and right",
            readout: () => `a scrolling strip — ${modeText}`,
            component: stripExample,
            path: `${EXAMPLES_ROOT}/Strip.svelte`,
        },
        {
            key: "grid",
            name: "All four sides",
            readout: () => `scrolls both ways, and the two fades meet in the corners — ${modeText}`,
            component: gridExample,
            path: `${EXAMPLES_ROOT}/Grid.svelte`,
        },
        {
            key: "card",
            name: "Something that does not scroll",
            readout: () =>
                isScrollAware
                    ? "nothing is out of view, so nothing fades"
                    : "the fade does not need a scroll to be drawn",
            component: cardExample,
            path: `${EXAMPLES_ROOT}/Card.svelte`,
        },
    ];
</script>

{#snippet columnExample()}
    <ColumnExample {size} {isScrollAware} />
{/snippet}

{#snippet stripExample()}
    <StripExample {size} {isScrollAware} />
{/snippet}

{#snippet gridExample()}
    <GridExample {size} {isScrollAware} />
{/snippet}

{#snippet cardExample()}
    <CardExample {size} {isScrollAware} />
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp itemKey={"size"} label={"Fade size (px)"} hint={"How far in from each side the fade reaches."}>
        <PageNumberField
            value={size}
            min={EdgeFaderKnobs.MIN_SIZE}
            max={EdgeFaderKnobs.MAX_SIZE}
            step={EdgeFaderKnobs.SIZE_STEP}
            ariaLabel={"Fade size"}
            onInput={(value) => {
                size = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"isScrollAware"}
        label={"Scroll-aware"}
        hint={"Whether a side fades only while there is more to scroll to past it."}
    >
        <PageCheckField
            value={isScrollAware}
            ariaLabel={"Scroll-aware"}
            onChange={(value) => {
                isScrollAware = value;
            }}
        />
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} minColumnWidth={360} />
