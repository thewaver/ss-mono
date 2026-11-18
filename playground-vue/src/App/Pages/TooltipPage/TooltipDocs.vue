<script setup lang="ts">
import { computed, shallowRef } from "vue";

import type { AnchorHPlacement, AnchorVPlacement } from "@thewaver/ss-components-vue";
import { ANCHOR_H_PLACEMENTS, ANCHOR_V_PLACEMENTS, TOOLTIP_DEFAULTS } from "@thewaver/ss-components-vue";
import { TooltipKnobs } from "@thewaver/ss-playground/App/Knobs/Tooltips.const";
import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
import { DOCS_ROOT, DOCS_SECTIONS, FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.const";
import {
    TOOLTIP_ARROWS,
    TOOLTIP_ARROW_LABELS,
    TOOLTIP_HOVER_DELAY_MS,
    TOOLTIP_REVEALS,
    TOOLTIP_REVEAL_LABELS,
    type TooltipArrow,
    type TooltipReveal,
} from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.const";

import PageDocsAlert from "../../PageComponents/DocsAlert/PageDocsAlert.vue";
import PageDocsExample from "../../PageComponents/DocsExample/PageDocsExample.vue";
import PageDocsSection from "../../PageComponents/DocsSection/PageDocsSection.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import { useArrowBed } from "./ArrowBed.utils";
import ArrowBedKnobs from "./ArrowBedKnobs.vue";
import ArrowsDocsExample from "./Docs/Arrows.vue";
import BasicDocsExample from "./Docs/Basic.vue";
import CirclingDocsExample from "./Docs/Circling.vue";
import RichDocsExample from "./Docs/Rich.vue";
import RightToLeftDocsExample from "./Docs/RightToLeft.vue";
import WordDocsExample from "./Docs/Word.vue";

const computeRevealLabel = (next: TooltipReveal) => TOOLTIP_REVEAL_LABELS[next];
const computeArrowLabel = (next: TooltipArrow) => TOOLTIP_ARROW_LABELS[next];

const reveal = shallowRef<TooltipReveal>(TooltipKnobs.STARTING_REVEAL);
const arrow = shallowRef<TooltipArrow>(TooltipKnobs.STARTING_ARROW);
const arrowWidth = shallowRef(TooltipKnobs.STARTING_ARROW_WIDTH);
const arrowLength = shallowRef(TooltipKnobs.STARTING_ARROW_LENGTH);
const hPlacement = shallowRef<AnchorHPlacement>(TooltipKnobs.STARTING_H_PLACEMENT);
const vPlacement = shallowRef<AnchorVPlacement>(TooltipKnobs.STARTING_V_PLACEMENT);
const offsetX = shallowRef(TooltipKnobs.STARTING_OFFSET_X);
const offsetY = shallowRef(TooltipKnobs.STARTING_OFFSET_Y);
const transitionDurationMs = shallowRef(TOOLTIP_DEFAULTS.transitionDurationMs);
const focusShowDelayMs = shallowRef(TOOLTIP_DEFAULTS.focusShowDelayMs);
const hoverShowDelayMs = shallowRef(TOOLTIP_HOVER_DELAY_MS);

const circling = useArrowBed();
const arrowBed = useArrowBed();

const placement = computed(() => ({ x: hPlacement.value, y: vPlacement.value }));

const offset = computed(() => ({ x: offsetX.value, y: offsetY.value }));
</script>

<template>
    <PageDocsExample :path="`${DOCS_ROOT}/Basic.vue`">
        <BasicDocsExample
            :placement="placement"
            :offset="offset"
            :transition-duration-ms="transitionDurationMs"
            :focus-show-delay-ms="focusShowDelayMs"
            :hover-show-delay-ms="hoverShowDelayMs"
            :reveal="reveal"
            :arrow="arrow"
            :arrow-width="arrowWidth"
            :arrow-length="arrowLength"
        />

        <template #renderKnobs>
            <PageProp item-key="reveal" v-bind="TooltipKnobs.REVEAL_TEXT">
                <PageSelectField
                    :value="reveal"
                    :values="TOOLTIP_REVEALS"
                    :compute-label="computeRevealLabel"
                    :width="FIELD_WIDTH"
                    ariaLabel="Reveal"
                    @change="(next: TooltipReveal) => (reveal = next)"
                />
            </PageProp>

            <PageProp item-key="arrow" v-bind="TooltipKnobs.ARROW_2_TEXT">
                <PageSelectField
                    :value="arrow"
                    :values="TOOLTIP_ARROWS"
                    :compute-label="computeArrowLabel"
                    :width="FIELD_WIDTH"
                    ariaLabel="Arrow"
                    @change="(next: TooltipArrow) => (arrow = next)"
                />
            </PageProp>

            <PageProp v-if="arrow !== 'none'" item-key="arrowWidth" v-bind="TooltipKnobs.ARROW_WIDTH_TEXT">
                <PageNumberField
                    :value="arrowWidth"
                    :min="TooltipKnobs.MIN_ARROW_SIZE"
                    :max="TooltipKnobs.MAX_ARROW_SIZE"
                    :step="TooltipKnobs.ARROW_SIZE_STEP"
                    :width="FIELD_WIDTH"
                    ariaLabel="Arrow width"
                    @input="(value: number) => (arrowWidth = value)"
                />
            </PageProp>

            <PageProp v-if="arrow !== 'none'" item-key="arrowLength" v-bind="TooltipKnobs.ARROW_LENGTH_TEXT">
                <PageNumberField
                    :value="arrowLength"
                    :min="TooltipKnobs.MIN_ARROW_SIZE"
                    :max="TooltipKnobs.MAX_ARROW_SIZE"
                    :step="TooltipKnobs.ARROW_SIZE_STEP"
                    :width="FIELD_WIDTH"
                    ariaLabel="Arrow length"
                    @input="(value: number) => (arrowLength = value)"
                />
            </PageProp>

            <PageProp item-key="hPlacement" v-bind="TooltipKnobs.H_PLACEMENT_TEXT">
                <PageSelectField
                    :value="hPlacement"
                    :values="ANCHOR_H_PLACEMENTS"
                    :width="FIELD_WIDTH"
                    ariaLabel="Placement across"
                    @change="(next: AnchorHPlacement) => (hPlacement = next)"
                />
            </PageProp>

            <PageProp item-key="vPlacement" v-bind="TooltipKnobs.V_PLACEMENT_TEXT">
                <PageSelectField
                    :value="vPlacement"
                    :values="ANCHOR_V_PLACEMENTS"
                    :width="FIELD_WIDTH"
                    ariaLabel="Placement down"
                    @change="(next: AnchorVPlacement) => (vPlacement = next)"
                />
            </PageProp>

            <PageProp item-key="offsetX" v-bind="TooltipKnobs.OFFSET_X_TEXT">
                <PageNumberField
                    :value="offsetX"
                    :min="TooltipKnobs.MIN_OFFSET"
                    :max="TooltipKnobs.MAX_OFFSET"
                    :step="TooltipKnobs.OFFSET_STEP"
                    :width="FIELD_WIDTH"
                    ariaLabel="Offset across"
                    @input="(value: number) => (offsetX = value)"
                />
            </PageProp>

            <PageProp item-key="offsetY" v-bind="TooltipKnobs.OFFSET_Y_TEXT">
                <PageNumberField
                    :value="offsetY"
                    :min="TooltipKnobs.MIN_OFFSET"
                    :max="TooltipKnobs.MAX_OFFSET"
                    :step="TooltipKnobs.OFFSET_STEP"
                    :width="FIELD_WIDTH"
                    ariaLabel="Offset down"
                    @input="(value: number) => (offsetY = value)"
                />
            </PageProp>

            <PageProp item-key="transitionDurationMs" v-bind="TooltipKnobs.TRANSITION_DURATION_MS_TEXT">
                <PageNumberField
                    :value="transitionDurationMs"
                    :min="TooltipKnobs.MIN_DURATION"
                    :max="TooltipKnobs.MAX_DURATION"
                    :step="TooltipKnobs.DURATION_STEP"
                    :width="FIELD_WIDTH"
                    ariaLabel="Reveal in milliseconds"
                    @input="(value: number) => (transitionDurationMs = value)"
                />
            </PageProp>

            <PageProp item-key="focusShowDelayMs" v-bind="TooltipKnobs.FOCUS_SHOW_DELAY_MS_TEXT">
                <PageNumberField
                    :value="focusShowDelayMs"
                    :min="TooltipKnobs.MIN_DURATION"
                    :max="TooltipKnobs.MAX_DURATION"
                    :step="TooltipKnobs.DURATION_STEP"
                    :width="FIELD_WIDTH"
                    ariaLabel="Focus delay in milliseconds"
                    @input="(value: number) => (focusShowDelayMs = value)"
                />
            </PageProp>

            <PageProp item-key="hoverShowDelayMs" v-bind="TooltipKnobs.HOVER_SHOW_DELAY_MS_TEXT">
                <PageNumberField
                    :value="hoverShowDelayMs"
                    :min="TooltipKnobs.MIN_DURATION"
                    :max="TooltipKnobs.MAX_DURATION"
                    :step="TooltipKnobs.DURATION_STEP"
                    :width="FIELD_WIDTH"
                    ariaLabel="Hover delay in milliseconds"
                    @input="(value: number) => (hoverShowDelayMs = value)"
                />
            </PageProp>
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.wordRunningText" />

    <PageDocsAlert severity="alert">
        A word is not a tab stop, so this one is given tabindex="0". Without it the keyboard never reaches the word, and
        its tooltip shows to a pointer alone (<a :href="WCAG_URLS['2.1.1']">WCAG 2.1.1</a>).
    </PageDocsAlert>

    <PageDocsExample :path="`${DOCS_ROOT}/Word.vue`">
        <WordDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.moreThanLine" />

    <PageDocsExample :path="`${DOCS_ROOT}/Rich.vue`">
        <RichDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.rightLeft" />

    <PageDocsExample :path="`${DOCS_ROOT}/RightToLeft.vue`">
        <RightToLeftDocsExample />
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.arrowGoingRound" />

    <PageDocsExample :path="`${DOCS_ROOT}/Circling.vue`">
        <CirclingDocsExample
            :arrow="circling.arrow.value"
            :arrow-width="circling.arrowWidth.value"
            :arrow-length="circling.arrowLength.value"
            :shape="circling.shape.value"
        />

        <template #renderKnobs>
            <ArrowBedKnobs key-prefix="circling" :controls="circling" />
        </template>
    </PageDocsExample>

    <PageDocsSection v-bind="DOCS_SECTIONS.everyArrowOnce" />

    <PageDocsExample :path="`${DOCS_ROOT}/Arrows.vue`">
        <ArrowsDocsExample
            :arrow="arrowBed.arrow.value"
            :arrow-width="arrowBed.arrowWidth.value"
            :arrow-length="arrowBed.arrowLength.value"
            :shape="arrowBed.shape.value"
        />

        <template #renderKnobs>
            <ArrowBedKnobs key-prefix="arrowBed" :controls="arrowBed" />
        </template>
    </PageDocsExample>
</template>
