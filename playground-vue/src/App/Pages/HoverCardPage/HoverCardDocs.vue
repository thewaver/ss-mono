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
            <PageProp item-key="offsetY" v-bind="HoverCardKnobs.OFFSET_Y_TEXT">
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

            <PageProp item-key="transitionDurationMs" v-bind="HoverCardKnobs.TRANSITION_DURATION_MS_TEXT">
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

            <PageProp item-key="focusShowDelayMs" v-bind="HoverCardKnobs.FOCUS_SHOW_DELAY_MS_TEXT">
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

            <PageProp item-key="hoverShowDelayMs" v-bind="HoverCardKnobs.HOVER_SHOW_DELAY_MS_TEXT">
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
