<script setup lang="ts">
import { TooltipKnobs } from "@thewaver/ss-playground/App/Knobs/Tooltips.const";
import {
    ARROW_BED_ARROWS,
    ARROW_BED_SHAPES,
    type ArrowBedArrow,
    type ArrowBedShape,
    FIELD_WIDTH,
} from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.const";
import { TOOLTIP_ARROW_LABELS } from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.const";

import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import type { ArrowBedKnobsProps } from "./TooltipPageVue.types";

type Props = ArrowBedKnobsProps;

defineProps<Props>();

const computeArrowLabel = (next: ArrowBedArrow) => TOOLTIP_ARROW_LABELS[next];
</script>

<template>
    <PageProp
        :item-key="`${keyPrefix}Arrow`"
        controls="Picks the template handed to ShapeUtils.attachArrow"
        label="Arrow"
        hint="Which arrow every tooltip here grows."
    >
        <PageSelectField
            :value="controls.arrow.value"
            :values="ARROW_BED_ARROWS"
            :compute-label="computeArrowLabel"
            :width="FIELD_WIDTH"
            ariaLabel="Arrow"
            @change="(next: ArrowBedArrow) => (controls.arrow.value = next)"
        />
    </PageProp>

    <PageProp
        :item-key="`${keyPrefix}Width`"
        controls="Sets the arrow width handed to the template"
        label="Arrow width (px)"
        hint="How wide every arrow is across its base. Past twice the length, a corner arrow's sides lean 45° or more."
    >
        <PageNumberField
            :value="controls.arrowWidth.value"
            :min="TooltipKnobs.MIN_ARROW_SIZE"
            :max="TooltipKnobs.MAX_ARROW_SIZE"
            :step="TooltipKnobs.ARROW_SIZE_STEP"
            :width="FIELD_WIDTH"
            ariaLabel="Arrow width"
            @input="(value: number) => (controls.arrowWidth.value = value)"
        />
    </PageProp>

    <PageProp
        :item-key="`${keyPrefix}Length`"
        controls="Sets the arrow length handed to the template"
        label="Arrow length (px)"
        hint="How far every arrow's tip stands off its tooltip."
    >
        <PageNumberField
            :value="controls.arrowLength.value"
            :min="TooltipKnobs.MIN_ARROW_SIZE"
            :max="TooltipKnobs.MAX_ARROW_SIZE"
            :step="TooltipKnobs.ARROW_SIZE_STEP"
            :width="FIELD_WIDTH"
            ariaLabel="Arrow length"
            @input="(value: number) => (controls.arrowLength.value = value)"
        />
    </PageProp>

    <PageProp
        :item-key="`${keyPrefix}Shape`"
        controls="Picks the contour handed to ShapeUtils.attachArrow"
        label="Shape"
        hint="The contour every tooltip here is cut to, which is what each arrow's base is walked along from where it attaches."
    >
        <PageSelectField
            :value="controls.shape.value"
            :values="ARROW_BED_SHAPES"
            :width="FIELD_WIDTH"
            ariaLabel="Shape"
            @change="(next: ArrowBedShape) => (controls.shape.value = next)"
        />
    </PageProp>
</template>
