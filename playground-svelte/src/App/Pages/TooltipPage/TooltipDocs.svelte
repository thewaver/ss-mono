<script lang="ts">
    import type { AnchorHPlacement, AnchorVPlacement } from "@thewaver/ss-components-svelte";
    import { ANCHOR_H_PLACEMENTS, ANCHOR_V_PLACEMENTS, TOOLTIP_DEFAULTS } from "@thewaver/ss-components-svelte";
    import { TooltipKnobs } from "@thewaver/ss-playground/App/Knobs/Tooltips.const";
    import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
    import { DOCS_SECTIONS, DOCS_ROOT, FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.const";
    import {
        TOOLTIP_ARROWS,
        TOOLTIP_ARROW_LABELS,
        TOOLTIP_HOVER_DELAY_MS,
        TOOLTIP_REVEALS,
        TOOLTIP_REVEAL_LABELS,
        type TooltipArrow,
        type TooltipReveal,
    } from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.const";

    import PageDocsAlert from "../../PageComponents/DocsAlert/PageDocsAlert.svelte";
    import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.svelte";
    import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import { createArrowBed } from "./ArrowBed.utils.svelte";
    import ArrowBedKnobs from "./ArrowBedKnobs.svelte";
    import ArrowsDocsExample from "./Docs/Arrows.svelte";
    import BasicDocsExample from "./Docs/Basic.svelte";
    import CirclingDocsExample from "./Docs/Circling.svelte";
    import RichDocsExample from "./Docs/Rich.svelte";
    import RightToLeftDocsExample from "./Docs/RightToLeft.svelte";
    import WordDocsExample from "./Docs/Word.svelte";

    let reveal = $state<TooltipReveal>(TooltipKnobs.STARTING_REVEAL);
    let arrow = $state<TooltipArrow>(TooltipKnobs.STARTING_ARROW);
    let arrowWidth = $state(TooltipKnobs.STARTING_ARROW_WIDTH);
    let arrowLength = $state(TooltipKnobs.STARTING_ARROW_LENGTH);
    let hPlacement = $state<AnchorHPlacement>(TooltipKnobs.STARTING_H_PLACEMENT);
    let vPlacement = $state<AnchorVPlacement>(TooltipKnobs.STARTING_V_PLACEMENT);
    let offsetX = $state(TooltipKnobs.STARTING_OFFSET_X);
    let offsetY = $state(TooltipKnobs.STARTING_OFFSET_Y);
    let transitionDurationMs = $state(TOOLTIP_DEFAULTS.transitionDurationMs);
    let focusShowDelayMs = $state(TOOLTIP_DEFAULTS.focusShowDelayMs);
    let hoverShowDelayMs = $state(TOOLTIP_HOVER_DELAY_MS);

    const circling = createArrowBed();
    const arrowBed = createArrowBed();

    const placement = $derived({ x: hPlacement, y: vPlacement });

    const offset = $derived({ x: offsetX, y: offsetY });
</script>

<PageDocsExample path={`${DOCS_ROOT}/Basic.svelte`}>
    <BasicDocsExample
        {placement}
        {offset}
        {transitionDurationMs}
        {focusShowDelayMs}
        {hoverShowDelayMs}
        {reveal}
        {arrow}
        {arrowWidth}
        {arrowLength}
    />

    {#snippet renderKnobs()}
        <PageProp
            itemKey={"reveal"}
            {...TooltipKnobs.REVEAL_TEXT}
        >
            <PageSelectField
                value={reveal}
                values={TOOLTIP_REVEALS}
                computeLabel={(next) => TOOLTIP_REVEAL_LABELS[next]}
                width={FIELD_WIDTH}
                ariaLabel={"Reveal"}
                onChange={(next) => {
                    reveal = next;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"arrow"}
            {...TooltipKnobs.ARROW_2_TEXT}
        >
            <PageSelectField
                value={arrow}
                values={TOOLTIP_ARROWS}
                computeLabel={(next) => TOOLTIP_ARROW_LABELS[next]}
                width={FIELD_WIDTH}
                ariaLabel={"Arrow"}
                onChange={(next) => {
                    arrow = next;
                }}
            />
        </PageProp>

        {#if arrow !== "none"}
            <PageProp
                itemKey={"arrowWidth"}
                {...TooltipKnobs.ARROW_WIDTH_TEXT}
            >
                <PageNumberField
                    value={arrowWidth}
                    min={TooltipKnobs.MIN_ARROW_SIZE}
                    max={TooltipKnobs.MAX_ARROW_SIZE}
                    step={TooltipKnobs.ARROW_SIZE_STEP}
                    width={FIELD_WIDTH}
                    ariaLabel={"Arrow width"}
                    onInput={(value) => {
                        arrowWidth = value;
                    }}
                />
            </PageProp>

            <PageProp
                itemKey={"arrowLength"}
                {...TooltipKnobs.ARROW_LENGTH_TEXT}
            >
                <PageNumberField
                    value={arrowLength}
                    min={TooltipKnobs.MIN_ARROW_SIZE}
                    max={TooltipKnobs.MAX_ARROW_SIZE}
                    step={TooltipKnobs.ARROW_SIZE_STEP}
                    width={FIELD_WIDTH}
                    ariaLabel={"Arrow length"}
                    onInput={(value) => {
                        arrowLength = value;
                    }}
                />
            </PageProp>
        {/if}

        <PageProp
            itemKey={"hPlacement"}
            {...TooltipKnobs.H_PLACEMENT_TEXT}
        >
            <PageSelectField
                value={hPlacement}
                values={ANCHOR_H_PLACEMENTS}
                width={FIELD_WIDTH}
                ariaLabel={"Placement across"}
                onChange={(placement) => {
                    hPlacement = placement;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"vPlacement"}
            {...TooltipKnobs.V_PLACEMENT_TEXT}
        >
            <PageSelectField
                value={vPlacement}
                values={ANCHOR_V_PLACEMENTS}
                width={FIELD_WIDTH}
                ariaLabel={"Placement down"}
                onChange={(placement) => {
                    vPlacement = placement;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"offsetX"}
            {...TooltipKnobs.OFFSET_X_TEXT}
        >
            <PageNumberField
                value={offsetX}
                min={TooltipKnobs.MIN_OFFSET}
                max={TooltipKnobs.MAX_OFFSET}
                step={TooltipKnobs.OFFSET_STEP}
                width={FIELD_WIDTH}
                ariaLabel={"Offset across"}
                onInput={(value) => {
                    offsetX = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"offsetY"}
            {...TooltipKnobs.OFFSET_Y_TEXT}
        >
            <PageNumberField
                value={offsetY}
                min={TooltipKnobs.MIN_OFFSET}
                max={TooltipKnobs.MAX_OFFSET}
                step={TooltipKnobs.OFFSET_STEP}
                width={FIELD_WIDTH}
                ariaLabel={"Offset down"}
                onInput={(value) => {
                    offsetY = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"transitionDurationMs"}
            {...TooltipKnobs.TRANSITION_DURATION_MS_TEXT}
        >
            <PageNumberField
                value={transitionDurationMs}
                min={TooltipKnobs.MIN_DURATION}
                max={TooltipKnobs.MAX_DURATION}
                step={TooltipKnobs.DURATION_STEP}
                width={FIELD_WIDTH}
                ariaLabel={"Reveal in milliseconds"}
                onInput={(value) => {
                    transitionDurationMs = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"focusShowDelayMs"}
            {...TooltipKnobs.FOCUS_SHOW_DELAY_MS_TEXT}
        >
            <PageNumberField
                value={focusShowDelayMs}
                min={TooltipKnobs.MIN_DURATION}
                max={TooltipKnobs.MAX_DURATION}
                step={TooltipKnobs.DURATION_STEP}
                width={FIELD_WIDTH}
                ariaLabel={"Focus delay in milliseconds"}
                onInput={(value) => {
                    focusShowDelayMs = value;
                }}
            />
        </PageProp>

        <PageProp
            itemKey={"hoverShowDelayMs"}
            {...TooltipKnobs.HOVER_SHOW_DELAY_MS_TEXT}
        >
            <PageNumberField
                value={hoverShowDelayMs}
                min={TooltipKnobs.MIN_DURATION}
                max={TooltipKnobs.MAX_DURATION}
                step={TooltipKnobs.DURATION_STEP}
                width={FIELD_WIDTH}
                ariaLabel={"Hover delay in milliseconds"}
                onInput={(value) => {
                    hoverShowDelayMs = value;
                }}
            />
        </PageProp>
    {/snippet}
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.wordRunningText}
/>

<PageDocsAlert severity={"alert"}>
    A word is not a tab stop, so this one is given tabindex="0". Without it the keyboard never reaches the word, and its
    tooltip shows to a pointer alone (<a href={WCAG_URLS["2.1.1"]}>WCAG 2.1.1</a>).
</PageDocsAlert>

<PageDocsExample path={`${DOCS_ROOT}/Word.svelte`}>
    <WordDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.moreThanLine}
/>

<PageDocsExample path={`${DOCS_ROOT}/Rich.svelte`}>
    <RichDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.rightLeft}
/>

<PageDocsExample path={`${DOCS_ROOT}/RightToLeft.svelte`}>
    <RightToLeftDocsExample />
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.arrowGoingRound}
/>

<PageDocsExample path={`${DOCS_ROOT}/Circling.svelte`}>
    <CirclingDocsExample
        arrow={circling.arrow}
        arrowWidth={circling.arrowWidth}
        arrowLength={circling.arrowLength}
        shape={circling.shape}
    />

    {#snippet renderKnobs()}
        <ArrowBedKnobs keyPrefix={"circling"} arrowBed={circling} />
    {/snippet}
</PageDocsExample>

<PageDocsSection
    {...DOCS_SECTIONS.everyArrowOnce}
/>

<PageDocsExample path={`${DOCS_ROOT}/Arrows.svelte`}>
    <ArrowsDocsExample
        arrow={arrowBed.arrow}
        arrowWidth={arrowBed.arrowWidth}
        arrowLength={arrowBed.arrowLength}
        shape={arrowBed.shape}
    />

    {#snippet renderKnobs()}
        <ArrowBedKnobs keyPrefix={"arrowBed"} {arrowBed} />
    {/snippet}
</PageDocsExample>
