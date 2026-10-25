<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { HOVER_CARD_DEFAULTS } from "@thewaver/ss-components-vue";
import { HoverCardKnobs } from "@thewaver/ss-playground/App/Knobs/HoverCards.const";
import { DOCS_ROOT, FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/HoverCardPage/HoverCardPage.const";

import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import BasicDocsExample from "./Docs/Basic.vue";

const offsetY = shallowRef(HoverCardKnobs.STARTING_OFFSET_Y);
const transitionDurationMs = shallowRef(HOVER_CARD_DEFAULTS.transitionDurationMs);
const focusShowDelayMs = shallowRef(HOVER_CARD_DEFAULTS.focusShowDelayMs);
const hoverShowDelayMs = shallowRef(HOVER_CARD_DEFAULTS.hoverShowDelayMs);

const offset = computed(() => ({ x: 0, y: offsetY.value }));
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample
            :offset="offset"
            :transition-duration-ms="transitionDurationMs"
            :focus-show-delay-ms="focusShowDelayMs"
            :hover-show-delay-ms="hoverShowDelayMs"
        />

        <template #renderKnobs>
            <PageProp
                item-key="offsetY"
                label="Offset down (px)"
                hint="How far the card is held clear of its anchor. The gap is bridged, so the pointer can cross it without losing the card."
                controls="Sets HoverCardProps.offset.y"
            >
                <PageNumberField
                    :value="offsetY"
                    :min="HoverCardKnobs.MIN_OFFSET"
                    :max="HoverCardKnobs.MAX_OFFSET"
                    :step="HoverCardKnobs.OFFSET_STEP"
                    :width="FIELD_WIDTH"
                    ariaLabel="Offset down"
                    @input="(value: number) => (offsetY = value)"
                />
            </PageProp>

            <PageProp
                item-key="transitionDurationMs"
                label="Transition duration (ms)"
                hint="How long the card takes to fade in and out."
                controls="Sets HoverCardProps.transitionDurationMs"
            >
                <PageNumberField
                    :value="transitionDurationMs"
                    :min="HoverCardKnobs.MIN_DURATION"
                    :max="HoverCardKnobs.MAX_DURATION"
                    :step="HoverCardKnobs.DURATION_STEP"
                    :width="FIELD_WIDTH"
                    ariaLabel="Transition duration in milliseconds"
                    @input="(value: number) => (transitionDurationMs = value)"
                />
            </PageProp>

            <PageProp
                item-key="focusShowDelayMs"
                label="Focus delay (ms)"
                hint="How long a keyboard focus has to rest on the anchor before the card opens."
                controls="Sets HoverCardProps.focusShowDelayMs"
            >
                <PageNumberField
                    :value="focusShowDelayMs"
                    :min="HoverCardKnobs.MIN_DURATION"
                    :max="HoverCardKnobs.MAX_DURATION"
                    :step="HoverCardKnobs.DURATION_STEP"
                    :width="FIELD_WIDTH"
                    ariaLabel="Focus delay in milliseconds"
                    @input="(value: number) => (focusShowDelayMs = value)"
                />
            </PageProp>

            <PageProp
                item-key="hoverShowDelayMs"
                label="Hover delay (ms)"
                hint="How long the pointer has to rest on the anchor before the card opens. Leave before then and nothing opens."
                controls="Sets HoverCardProps.hoverShowDelayMs"
            >
                <PageNumberField
                    :value="hoverShowDelayMs"
                    :min="HoverCardKnobs.MIN_DURATION"
                    :max="HoverCardKnobs.MAX_DURATION"
                    :step="HoverCardKnobs.DURATION_STEP"
                    :width="FIELD_WIDTH"
                    ariaLabel="Hover delay in milliseconds"
                    @input="(value: number) => (hoverShowDelayMs = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>
</template>
