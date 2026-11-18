<script lang="ts">
    import { HOVER_CARD_DEFAULTS } from "@thewaver/ss-components-svelte";
    import { HoverCardKnobs } from "@thewaver/ss-playground/App/Knobs/HoverCards.const";
    import { DOCS_ROOT, FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/HoverCardPage/HoverCardPage.const";

    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";

    let offsetY = $state(HoverCardKnobs.STARTING_OFFSET_Y);
    let transitionDurationMs = $state(HOVER_CARD_DEFAULTS.transitionDurationMs);
    let focusShowDelayMs = $state(HOVER_CARD_DEFAULTS.focusShowDelayMs);
    let hoverShowDelayMs = $state(HOVER_CARD_DEFAULTS.hoverShowDelayMs);

    const offset = $derived({ x: 0, y: offsetY });
</script>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample {offset} {transitionDurationMs} {focusShowDelayMs} {hoverShowDelayMs} />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"offsetY"}
            {...HoverCardKnobs.OFFSET_Y_TEXT}
        >
            <PageNumberField
                value={offsetY}
                min={HoverCardKnobs.MIN_OFFSET}
                max={HoverCardKnobs.MAX_OFFSET}
                step={HoverCardKnobs.OFFSET_STEP}
                width={FIELD_WIDTH}
                ariaLabel={"Offset down"}
                onInput={(value) => {
                    offsetY = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"transitionDurationMs"}
            {...HoverCardKnobs.TRANSITION_DURATION_MS_TEXT}
        >
            <PageNumberField
                value={transitionDurationMs}
                min={HoverCardKnobs.MIN_DURATION}
                max={HoverCardKnobs.MAX_DURATION}
                step={HoverCardKnobs.DURATION_STEP}
                width={FIELD_WIDTH}
                ariaLabel={"Transition duration in milliseconds"}
                onInput={(value) => {
                    transitionDurationMs = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"focusShowDelayMs"}
            {...HoverCardKnobs.FOCUS_SHOW_DELAY_MS_TEXT}
        >
            <PageNumberField
                value={focusShowDelayMs}
                min={HoverCardKnobs.MIN_DURATION}
                max={HoverCardKnobs.MAX_DURATION}
                step={HoverCardKnobs.DURATION_STEP}
                width={FIELD_WIDTH}
                ariaLabel={"Focus delay in milliseconds"}
                onInput={(value) => {
                    focusShowDelayMs = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"hoverShowDelayMs"}
            {...HoverCardKnobs.HOVER_SHOW_DELAY_MS_TEXT}
        >
            <PageNumberField
                value={hoverShowDelayMs}
                min={HoverCardKnobs.MIN_DURATION}
                max={HoverCardKnobs.MAX_DURATION}
                step={HoverCardKnobs.DURATION_STEP}
                width={FIELD_WIDTH}
                ariaLabel={"Hover delay in milliseconds"}
                onInput={(value) => {
                    hoverShowDelayMs = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>
