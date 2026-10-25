<script lang="ts">
    import type { AnchorHPlacement, AnchorVPlacement } from "@thewaver/ss-components-svelte";
    import { ANCHOR_H_PLACEMENTS, ANCHOR_V_PLACEMENTS, TOOLTIP_DEFAULTS } from "@thewaver/ss-components-svelte";
    import { TooltipKnobs } from "@thewaver/ss-playground/App/Knobs/Tooltips.const";
    import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
    import { DOCS_ROOT, FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.const";
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
            controls={"Picks how the example content drawn by TooltipProps.renderContent appears"}
            label={"Reveal"}
            hint={"How the tooltip appears and goes, which is the drawing's own: the tooltip only says whether it is showing and for how long the change takes."}
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
            controls={"Picks the arrow on the example content drawn by TooltipProps.renderContent"}
            label={"Arrow"}
            hint={
                "An arrow grown out of the tooltip's body to point at its anchor. It comes out of the side facing the anchor, or out of the nearest corner when the tooltip sits off a corner, and there is none while the tooltip overlaps its anchor. The offset is what makes room for it."
            }
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
                controls={"Sets the arrow width on the example content drawn by TooltipProps.renderContent"}
                label={"Arrow width (px)"}
                hint={
                    "How wide the arrow is across its base. The lightning bolt spans this much from where its base starts to its tip."
                }
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
                controls={"Sets the arrow length on the example content drawn by TooltipProps.renderContent"}
                label={"Arrow length (px)"}
                hint={
                    "How far the arrow's tip stands off the tooltip. Longer than the offset, and the tip reaches over the anchor."
                }
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
            controls={"Sets TooltipProps.placement.x"}
            label={"Placement across"}
            hint={"Where the tooltip sits across its anchor: inside an edge, centered, or outside it altogether."}
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
            controls={"Sets TooltipProps.placement.y"}
            label={"Placement down"}
            hint={"Where the tooltip sits above or below its anchor: inside an edge, centered, or outside it altogether."}
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
            controls={"Sets TooltipProps.offset.x"}
            label={"Offset across (px)"}
            hint={"How far the tooltip is nudged sideways from where the placement put it."}
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
            controls={"Sets TooltipProps.offset.y"}
            label={"Offset down (px)"}
            hint={"How far the tooltip is nudged up or down from where the placement put it."}
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
            controls={"Sets TooltipProps.transitionDurationMs"}
            label={"Reveal (ms)"}
            hint={"How long the tooltip takes to appear and to go."}
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
            controls={"Sets TooltipProps.focusShowDelayMs"}
            label={"Focus delay (ms)"}
            hint={"How long a keyboard focus has to rest on the anchor before the tooltip appears."}
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
            controls={"Sets TooltipProps.hoverShowDelayMs"}
            label={"Hover delay (ms)"}
            hint={
                "How long the pointer has to rest on the anchor before the tooltip appears. Leave before then and nothing shows."
            }
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
    title={"On a word in running text"}
    content={"The tooltip is handed the element it describes through [prop]anchorRef[/prop] rather than wrapping it, so anything with a ref can carry one, here a word in the middle of a sentence."}
/>

<PageDocsAlert severity={"alert"}>
    A word is not a tab stop, so this one is given tabindex="0". Without it the keyboard never reaches the word, and its
    tooltip shows to a pointer alone (<a href={WCAG_URLS["2.1.1"]}>WCAG 2.1.1</a>).
</PageDocsAlert>

<PageDocsExample path={`${DOCS_ROOT}/Word.svelte`}>
    <WordDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"More than a line"}
    content={"What the tooltip shows is whatever [prop]renderContent[/prop] draws, here a title over a paragraph, and it sits where its [prop]placement[/prop] puts it however tall that makes it. It is still read out as the anchor's description, in one run, so nothing in it can be pressed; a link or a button belongs in a HoverCard."}
/>

<PageDocsExample path={`${DOCS_ROOT}/Rich.svelte`}>
    <RichDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"Right to left"}
    content={"Inside a box whose text runs right to left, the tooltip takes the box's direction although it is drawn outside it, so its lines read from the right. Its [prop]placement[/prop] is used as it stands: one asked to sit on the left still sits on the left."}
/>

<PageDocsExample path={`${DOCS_ROOT}/RightToLeft.svelte`}>
    <RightToLeftDocsExample />
</PageDocsExample>

<PageDocsSection
    title={"An arrow going round"}
    content={"An arrow is the drawing's too: [prop]renderContent[/prop] is handed where one should point, and ShapeUtils.attachArrow grows it out of any contour. Move the slider to aim it all the way round: it leaves straight out of the edge it faces, and turns through the diagonal as it rounds a corner."}
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
    title={"Every arrow at once"}
    content={"Eight tooltips round one anchor, one on each side and at each corner, every arrow aimed by the rule a live tooltip's is aimed by, AnchorUtils.computeArrowAim. The corners are where a wide arrow goes wrong: past twice its length, its sides lean 45° or more."}
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
