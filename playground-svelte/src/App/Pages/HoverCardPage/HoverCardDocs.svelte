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
            label={"Offset down (px)"}
            hint={"How far the card is held clear of its anchor. The gap is bridged, so the pointer can cross it without losing the card."}
            controls={"Sets HoverCardProps.offset.y"}
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
            label={"Transition duration (ms)"}
            hint={"How long the card takes to fade in and out."}
            controls={"Sets HoverCardProps.transitionDurationMs"}
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
            label={"Focus delay (ms)"}
            hint={"How long a keyboard focus has to rest on the anchor before the card opens."}
            controls={"Sets HoverCardProps.focusShowDelayMs"}
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
            label={"Hover delay (ms)"}
            hint={"How long the pointer has to rest on the anchor before the card opens. Leave before then and nothing opens."}
            controls={"Sets HoverCardProps.hoverShowDelayMs"}
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
