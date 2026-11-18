<script lang="ts">
    import { TooltipKnobs } from "@thewaver/ss-playground/App/Knobs/Tooltips.const";
    import {
        ARROW_BED_ARROWS,
        ARROW_BED_SHAPES,
        FIELD_WIDTH,
    } from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.const";
    import { TOOLTIP_ARROW_LABELS } from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.const";

    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import type { ArrowBedKnobsProps } from "./TooltipPageSvelte.types";

    type Props = ArrowBedKnobsProps;

    let props: Props = $props();

    const arrowBed = $derived(props.arrowBed);
</script>

<PageProp
    itemKey={`${props.keyPrefix}Arrow`}
    {...TooltipKnobs.ARROW_TEXT}
>
    <PageSelectField
        value={arrowBed.arrow}
        values={ARROW_BED_ARROWS}
        computeLabel={(next) => TOOLTIP_ARROW_LABELS[next]}
        width={FIELD_WIDTH}
        ariaLabel={"Arrow"}
        onChange={(next) => {
            arrowBed.arrow = next;
        }}
    />
</PageProp>

<PageProp
    itemKey={`${props.keyPrefix}Width`}
    {...TooltipKnobs.ARROW_WIDTH_PX_TEXT}
>
    <PageNumberField
        value={arrowBed.arrowWidth}
        min={TooltipKnobs.MIN_ARROW_SIZE}
        max={TooltipKnobs.MAX_ARROW_SIZE}
        step={TooltipKnobs.ARROW_SIZE_STEP}
        width={FIELD_WIDTH}
        ariaLabel={"Arrow width"}
        onInput={(value) => {
            arrowBed.arrowWidth = value;
        }}
    />
</PageProp>

<PageProp
    itemKey={`${props.keyPrefix}Length`}
    {...TooltipKnobs.ARROW_LENGTH_PX_TEXT}
>
    <PageNumberField
        value={arrowBed.arrowLength}
        min={TooltipKnobs.MIN_ARROW_SIZE}
        max={TooltipKnobs.MAX_ARROW_SIZE}
        step={TooltipKnobs.ARROW_SIZE_STEP}
        width={FIELD_WIDTH}
        ariaLabel={"Arrow length"}
        onInput={(value) => {
            arrowBed.arrowLength = value;
        }}
    />
</PageProp>

<PageProp
    itemKey={`${props.keyPrefix}Shape`}
    {...TooltipKnobs.SHAPE_TEXT}
>
    <PageSelectField
        value={arrowBed.shape}
        values={ARROW_BED_SHAPES}
        width={FIELD_WIDTH}
        ariaLabel={"Shape"}
        onChange={(next) => {
            arrowBed.shape = next;
        }}
    />
</PageProp>
