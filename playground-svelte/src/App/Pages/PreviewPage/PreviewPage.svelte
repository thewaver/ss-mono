<script lang="ts">
    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import ScrolledExample from "./Examples/Scrolled.svelte";
    import TextExample from "./Examples/Text.svelte";

    const EXAMPLES_ROOT = "/src/App/Pages/PreviewPage/Examples";

    const COLLAPSED_HEIGHT = 120;

    const LONG_PARAGRAPHS = [
        "The keep was built in the spring of 1412 by masons who had never seen the sea, which is why every window on the seaward wall is a hand too narrow.",
        "Its great hall held four hundred at the harvest feast and was heated by a single fire, on the reasoning that four hundred people are themselves a fire of sorts.",
        "The east tower was added a century later, and leans, and has leaned for so long that the town would find it strange upright.",
    ];

    const SHORT_PARAGRAPHS = ["The east tower leans, and has done for four hundred years."];

    let longExpanded = $state(false);
    let shortExpanded = $state(false);
    let scrolledExpanded = $state(false);

    const examples: ExampleDefs[] = [
        {
            key: "long",
            name: "More than fits",
            readout: () => `expanded: ${longExpanded} — the control appears because there is something behind it`,
            component: longExample,
            path: `${EXAMPLES_ROOT}/Text.svelte`,
        },
        {
            key: "unheld",
            name: "Nobody holding the state",
            readout: () =>
                "no signal passed — the preview keeps whether it is expanded itself, so the page has nothing to show here",
            component: unheldExample,
            path: `${EXAMPLES_ROOT}/Text.svelte`,
        },
        {
            key: "short",
            name: "Less than fits",
            readout: () => `expanded: ${shortExpanded} — same component, same height, no control and no fade at all`,
            component: shortExample,
            path: `${EXAMPLES_ROOT}/Text.svelte`,
        },
        {
            key: "scrolled",
            name: "Inside a box that scrolls",
            readout: () =>
                `expanded: ${scrolledExpanded} — closing it brings the control back rather than leaving you further down`,
            component: scrolledExample,
            path: `${EXAMPLES_ROOT}/Scrolled.svelte`,
        },
    ];
</script>

{#snippet longExample()}
    <TextExample bind:expanded={longExpanded} collapsedHeight={COLLAPSED_HEIGHT} paragraphs={LONG_PARAGRAPHS} />
{/snippet}

{#snippet unheldExample()}
    <TextExample collapsedHeight={COLLAPSED_HEIGHT} paragraphs={LONG_PARAGRAPHS} />
{/snippet}

{#snippet shortExample()}
    <TextExample bind:expanded={shortExpanded} collapsedHeight={COLLAPSED_HEIGHT} paragraphs={SHORT_PARAGRAPHS} />
{/snippet}

{#snippet scrolledExample()}
    <ScrolledExample
        bind:expanded={scrolledExpanded}
        collapsedHeight={COLLAPSED_HEIGHT}
        paragraphs={LONG_PARAGRAPHS}
    />
{/snippet}

<PageExamples items={examples} />
