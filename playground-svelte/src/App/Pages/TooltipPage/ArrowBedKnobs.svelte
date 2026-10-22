<script lang="ts">
    import { TooltipKnobs } from "@thewaver/ss-playground/App/Knobs/Tooltips.const";
    import {
        ARROW_BED_ARROWS,
        ARROW_BED_SHAPES,
        FIELD_WIDTH,
    } from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.const";
    import { TOOLTIP_ARROW_LABELS } from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.const";

    import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import type { ArrowBedControls } from "./TooltipPageSvelte.types";

    type Props = {
        arrowBed: ArrowBedControls;
    };

    let props: Props = $props();

    const arrowBed = $derived(props.arrowBed);
</script>

<PageExampleKnobs>
    <PageProp
        itemKey={"arrowBedArrow"}
        controls={"Picks the template handed to ShapeUtils.attachArrow"}
        label={"Arrow"}
        hint={"Which arrow every tooltip here grows."}
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
        itemKey={"arrowBedWidth"}
        controls={"Sets the arrow width handed to the template"}
        label={"Arrow width (px)"}
        hint={"How wide every arrow is across its base. Past twice the length, a corner arrow's sides lean 45° or more."}
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
        itemKey={"arrowBedLength"}
        controls={"Sets the arrow length handed to the template"}
        label={"Arrow length (px)"}
        hint={"How far every arrow's tip stands off its tooltip."}
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
        itemKey={"arrowBedShape"}
        controls={"Picks the contour handed to ShapeUtils.attachArrow"}
        label={"Shape"}
        hint={"The contour every tooltip here is cut to, which is what each arrow's base is walked along from where it attaches."}
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
</PageExampleKnobs>
