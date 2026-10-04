<script setup lang="ts">
import type { CarouselOrientation } from "@thewaver/ss-components-vue";
import { CAROUSEL_ORIENTATIONS, CarouselPlacements } from "@thewaver/ss-components-vue";
import { CarouselKnobs } from "@thewaver/ss-playground/App/Knobs/Carousels.const";
import {
    FIELD_WIDTH,
    ORIENTATION_FIELD_WIDTH,
    ORIENTATION_LABELS,
    PLACEMENT_FIELD_WIDTH,
    PLACEMENT_LABELS,
} from "@thewaver/ss-playground/App/Pages/Carousels/Carousels.const";

import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import type { PageCarouselsPanelProps } from "./Carousels.types";

const props = defineProps<PageCarouselsPanelProps>();

const controls = props.controls;
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp
            v-if="hasPlacement"
            item-key="placement"
            label="Placement"
            hint="The rule that says where each slide is drawn from how far it is from the one showing: a strip, a drum, cover flow and the rest."
        >
            <PageSelectField
                :value="controls.placement.value"
                :values="CarouselPlacements.SAMPLE_KEYS"
                :compute-label="(placement: CarouselPlacements.SampleKey) => PLACEMENT_LABELS[placement]"
                :width="PLACEMENT_FIELD_WIDTH"
                ariaLabel="Placement"
                @change="(placement: CarouselPlacements.SampleKey) => (controls.placement.value = placement)"
            />
        </PageProp>

        <PageProp item-key="slideCount" label="Slide count" hint="How many slides the carousel holds.">
            <PageNumberField
                :value="controls.slideCount.value"
                :min="CarouselKnobs.MIN_SLIDE_COUNT"
                :max="CarouselKnobs.MAX_SLIDE_COUNT"
                :step="CarouselKnobs.SLIDE_COUNT_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Slide count"
                @input="(value: number) => (controls.slideCount.value = value)"
            />
        </PageProp>

        <PageProp
            v-if="hasDelay"
            item-key="delayMs"
            label="RotatorUtils delay (ms)"
            hint="How long a slide is held before the carousel moves to the next one on its own."
        >
            <PageNumberField
                :value="controls.delay.value"
                :min="CarouselKnobs.MIN_DELAY_MS"
                :max="CarouselKnobs.MAX_DELAY_MS"
                :step="CarouselKnobs.DELAY_STEP_MS"
                :width="FIELD_WIDTH"
                ariaLabel="RotatorUtils delay in milliseconds"
                @input="(value: number) => (controls.delay.value = value)"
            />
        </PageProp>

        <PageProp
            item-key="orientation"
            label="Orientation"
            hint="Which way the slides run, and so which way the arrows and the arrow keys move."
        >
            <PageSelectField
                :value="controls.orientation.value"
                :values="CAROUSEL_ORIENTATIONS"
                :compute-label="(orientation: CarouselOrientation) => ORIENTATION_LABELS[orientation]"
                :width="ORIENTATION_FIELD_WIDTH"
                ariaLabel="Orientation"
                @change="(orientation: CarouselOrientation) => (controls.orientation.value = orientation)"
            />
        </PageProp>

        <PageProp
            v-if="hasLooping"
            item-key="isLooping"
            label="Looping"
            hint="Whether stepping past the last slide comes round to the first. Off, the end controls are disabled, a swipe past an end springs back, and rotation stops on the last slide."
        >
            <PageCheckField
                :value="controls.isLooping.value"
                ariaLabel="Looping"
                @change="(value: boolean) => (controls.isLooping.value = value)"
            />
        </PageProp>

        <PageProp
            item-key="isDisabled"
            label="Disabled"
            hint="Turns the carousel off, so neither its controls nor its swipes do anything."
        >
            <PageCheckField
                :value="controls.isDisabled.value"
                ariaLabel="Disabled"
                @change="(value: boolean) => (controls.isDisabled.value = value)"
            />
        </PageProp>
    </PagePropsPanel>
</template>
