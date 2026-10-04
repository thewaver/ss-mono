<script setup lang="ts">
import { computed, shallowRef } from "vue";

import type { AnchorHPlacement, AnchorVPlacement } from "@thewaver/ss-components-vue";
import { ANCHOR_H_PLACEMENTS, ANCHOR_V_PLACEMENTS, TOOLTIP_DEFAULTS } from "@thewaver/ss-components-vue";
import { TooltipKnobs } from "@thewaver/ss-playground/App/Knobs/Tooltips.const";
import {
    TOOLTIP_HOVER_DELAY_MS,
    TOOLTIP_REVEALS,
    TOOLTIP_REVEAL_LABELS,
    type TooltipReveal,
} from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.const";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import DefaultExample from "./Examples/Default.vue";
import RichExample from "./Examples/Rich.vue";
import WordExample from "./Examples/Word.vue";
import type { TooltipExampleProps } from "./TooltipPage.types";

const EXAMPLES_ROOT = "/src/App/Pages/TooltipPage/Examples";

const FIELD_WIDTH = 110;

const hPlacement = shallowRef<AnchorHPlacement>(TooltipKnobs.STARTING_H_PLACEMENT);
const vPlacement = shallowRef<AnchorVPlacement>(TooltipKnobs.STARTING_V_PLACEMENT);
const offsetX = shallowRef(TooltipKnobs.STARTING_OFFSET_X);
const offsetY = shallowRef(TooltipKnobs.STARTING_OFFSET_Y);
const transitionDurationMs = shallowRef(TOOLTIP_DEFAULTS.transitionDurationMs);
const focusShowDelayMs = shallowRef(TOOLTIP_DEFAULTS.focusShowDelayMs);
const hoverShowDelayMs = shallowRef(TOOLTIP_HOVER_DELAY_MS);
const skipDelayWindowMs = shallowRef(TOOLTIP_DEFAULTS.skipDelayWindowMs);
const reveal = shallowRef<TooltipReveal>(TooltipKnobs.STARTING_REVEAL);

const placement = computed(() => ({ x: hPlacement.value, y: vPlacement.value }));

const offset = computed(() => ({ x: offsetX.value, y: offsetY.value }));

const commonProps = computed<TooltipExampleProps>(() => ({
    placement: placement.value,
    offset: offset.value,
    transitionDurationMs: transitionDurationMs.value,
    focusShowDelayMs: focusShowDelayMs.value,
    hoverShowDelayMs: hoverShowDelayMs.value,
    skipDelayWindowMs: skipDelayWindowMs.value,
    reveal: reveal.value,
}));

const examples: ExampleDefs[] = [
    {
        key: "default",
        name: "On a control of your own",
        readout: () =>
            "the button is a plain one, not the library's — the tooltip is handed its element and wires the hover, the focus and the Escape itself",
        path: `${EXAMPLES_ROOT}/Default.vue`,
    },
    {
        key: "word",
        name: "On something that is not a control",
        readout: () =>
            "any element with a ref can carry one; this word was given a tab stop of its own, without which the tooltip would be reachable by pointer alone",
        path: `${EXAMPLES_ROOT}/Word.vue`,
    },
    {
        key: "rich",
        name: "More than a line",
        readout: () => "the content is whatever you render, and the anchoring is unchanged by how tall it is",
        path: `${EXAMPLES_ROOT}/Rich.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp
            item-key="reveal"
            label="Reveal"
            hint="How the tooltip appears and goes, which is the drawing's own: the tooltip only says whether it is showing and for how long the change takes."
        >
            <PageSelectField
                :value="reveal"
                :values="TOOLTIP_REVEALS"
                :compute-label="(next: TooltipReveal) => TOOLTIP_REVEAL_LABELS[next]"
                :width="FIELD_WIDTH"
                ariaLabel="Reveal"
                @change="(next: TooltipReveal) => (reveal = next)"
            />
        </PageProp>

        <PageProp
            item-key="hPlacement"
            label="Placement across"
            hint="Where the tooltip sits across its anchor: inside an edge, centered, or outside it altogether."
        >
            <PageSelectField
                :value="hPlacement"
                :values="ANCHOR_H_PLACEMENTS"
                :width="FIELD_WIDTH"
                ariaLabel="Placement across"
                @change="(next: AnchorHPlacement) => (hPlacement = next)"
            />
        </PageProp>

        <PageProp
            item-key="vPlacement"
            label="Placement down"
            hint="Where the tooltip sits above or below its anchor: inside an edge, centered, or outside it altogether."
        >
            <PageSelectField
                :value="vPlacement"
                :values="ANCHOR_V_PLACEMENTS"
                :width="FIELD_WIDTH"
                ariaLabel="Placement down"
                @change="(next: AnchorVPlacement) => (vPlacement = next)"
            />
        </PageProp>

        <PageProp
            item-key="offsetX"
            label="Offset across (px)"
            hint="How far the tooltip is nudged sideways from where the placement put it."
        >
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

        <PageProp
            item-key="offsetY"
            label="Offset down (px)"
            hint="How far the tooltip is nudged up or down from where the placement put it."
        >
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

        <PageProp
            item-key="transitionDurationMs"
            label="Reveal (ms)"
            hint="How long the tooltip takes to appear and to go."
        >
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

        <PageProp
            item-key="focusShowDelayMs"
            label="Focus delay (ms)"
            hint="How long a keyboard focus has to rest on the anchor before the tooltip appears."
        >
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

        <PageProp
            item-key="hoverShowDelayMs"
            label="Hover delay (ms)"
            hint="How long the pointer has to rest on the anchor before the tooltip appears. Leave before then and nothing shows."
        >
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

        <PageProp
            item-key="skipDelayWindowMs"
            label="Skip window (ms)"
            hint="How soon after any tooltip closes a hover opens the next one at once. Wait for one tooltip here, then move to its neighbor."
        >
            <PageNumberField
                :value="skipDelayWindowMs"
                :min="TooltipKnobs.MIN_DURATION"
                :max="TooltipKnobs.MAX_DURATION"
                :step="TooltipKnobs.DURATION_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Skip window in milliseconds"
                @input="(value: number) => (skipDelayWindowMs = value)"
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples">
        <template #default>
            <DefaultExample v-bind="commonProps" />
        </template>

        <template #word>
            <WordExample v-bind="commonProps" />
        </template>

        <template #rich>
            <RichExample v-bind="commonProps" />
        </template>
    </PageExamples>
</template>
