<script lang="ts">
    import { FLIPBOOK_DEFAULTS, FlipbookUtils, MediaQueryMonitorSvelteUtils } from "@thewaver/ss-components-svelte";
    import { FlipbookKnobs } from "@thewaver/ss-playground/App/Knobs/Flipbooks.const";
    import { computeFlipbookSpreadAnnouncement } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import { FLIPBOOK_PAGES } from "@thewaver/ss-playground/App/Pages/FlipbookPage/FlipbookPage.const";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import BookExample from "./Examples/Book.svelte";

    const NO_MOTION_DURATION_MS = 0;

    const FIELD_WIDTH = 110;
    const EXAMPLES_ROOT = "/src/App/Pages/FlipbookPage/Examples";

    let transitionDurationMs = $state(FLIPBOOK_DEFAULTS.transitionDurationMs);
    let index = $state(0);

    const getPrefersReducedMotion = MediaQueryMonitorSvelteUtils.createReducedMotion();

    const turnDurationMs = $derived(getPrefersReducedMotion() ? NO_MOTION_DURATION_MS : transitionDurationMs);

    const examples: ExampleDefs[] = [
        {
            key: "book",
            name: "A book of twelve pages",
            readout: () => {
                const count = FLIPBOOK_PAGES.length;
                const pages = FlipbookUtils.getShowingPages(index, count);

                return `open at ${computeFlipbookSpreadAnnouncement(pages, count)} — turn it with the buttons, with the arrow keys while the book has focus, or by dragging a page across`;
            },
            component: bookExample,
            path: `${EXAMPLES_ROOT}/Book.svelte`,
        },
    ];
</script>

{#snippet bookExample()}
    <BookExample bind:index transitionDurationMs={turnDurationMs} />
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp
        itemKey={"transitionDurationMs"}
        label={"Turn duration (ms)"}
        hint={"How long one page takes to turn over. It is off while the visitor has asked for reduced motion, and the pages then turn at once."}
    >
        <PageNumberField
            value={transitionDurationMs}
            min={FlipbookKnobs.MIN_DURATION_MS}
            max={FlipbookKnobs.MAX_DURATION_MS}
            step={FlipbookKnobs.DURATION_STEP_MS}
            width={FIELD_WIDTH}
            isDisabled={getPrefersReducedMotion()}
            ariaLabel={"Turn duration in milliseconds"}
            onInput={(value) => {
                transitionDurationMs = value;
            }}
        />
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} />
