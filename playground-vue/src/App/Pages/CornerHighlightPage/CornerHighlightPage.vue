<script setup lang="ts">
import { computed, shallowRef } from "vue";

import type { CornerKey } from "@thewaver/ss-components-vue";
import { CORNER_HIGHLIGHT_DEFAULTS, CORNER_HIGHLIGHT_KEYS } from "@thewaver/ss-components-vue";
import { CornerHighlightKnobs } from "@thewaver/ss-playground/App/Knobs/CornerHighlights.const";
import {
    CORNER_LABELS,
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    FIELD_WIDTH,
} from "@thewaver/ss-playground/App/Pages/CornerHighlightPage/CornerHighlightPage.const";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageColorField from "../../PageComponents/Field/PageColorField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import type { CornerHighlightExampleProps } from "./CornerHighlightPageVue.types";
import ControlExample from "./Examples/Control.vue";
import DefaultExample from "./Examples/Default.vue";
import DrawOnExample from "./Examples/DrawOn.vue";
import FocusFollowExample from "./Examples/FocusFollow.vue";
import OverlayExample from "./Examples/Overlay.vue";

const color = shallowRef(CornerHighlightKnobs.STARTING_COLOR);
const lengthAcross = shallowRef(CornerHighlightKnobs.STARTING_LENGTH);
const lengthDown = shallowRef(CornerHighlightKnobs.STARTING_LENGTH);
const strokeThickness = shallowRef(CORNER_HIGHLIGHT_DEFAULTS.strokeThickness);
const transitionDurationMs = shallowRef(CORNER_HIGHLIGHT_DEFAULTS.transitionDurationMs);
const hiddenCorners = shallowRef<CornerKey[]>(
    CORNER_HIGHLIGHT_KEYS.filter((key) => !CORNER_HIGHLIGHT_DEFAULTS.visibleCorners.has(key)),
);

const cornerLength = computed(() => ({ width: lengthAcross.value, height: lengthDown.value }));

const visibleCorners = computed(
    () => new Set(CORNER_HIGHLIGHT_KEYS.filter((key) => !hiddenCorners.value.includes(key))),
);

const toggleCorner = (key: CornerKey, isVisible: boolean) => {
    hiddenCorners.value = isVisible
        ? hiddenCorners.value.filter((entry) => entry !== key)
        : [...hiddenCorners.value, key];
};

const commonProps = computed<CornerHighlightExampleProps>(() => ({
    color: color.value,
    cornerLength: cornerLength.value,
    strokeThickness: strokeThickness.value,
    transitionDurationMs: transitionDurationMs.value,
    visibleCorners: visibleCorners.value,
}));

const examples: ExampleDefs[] = [
    {
        key: "default",
        name: EXAMPLE_NAMES.default,
        readout: () =>
            "each bracket is a single polygon rather than two rules, so the arm lengths and the thickness are numbers rather than a border pretending to be one",
        path: `${EXAMPLES_ROOT}/Default.vue`,
    },
    {
        key: "control",
        name: EXAMPLE_NAMES.control,
        readout: () =>
            "press it — the color transitions rather than switching, which is the whole reason the component owns a duration",
        path: `${EXAMPLES_ROOT}/Control.vue`,
    },
    {
        key: "overlay",
        name: EXAMPLE_NAMES.overlay,
        readout: () =>
            "the button underneath still takes a press, because the layer carrying the brackets refuses the pointer and says nothing to a screen reader",
        path: `${EXAMPLES_ROOT}/Overlay.vue`,
    },
    {
        key: "focusFollow",
        name: EXAMPLE_NAMES.focusFollow,
        readout: () =>
            "one set of marks glides to whichever control is hovered or reached by the keyboard, around the control's own focus ring rather than instead of it — and jumps rather than glides under reduced motion",
        path: `${EXAMPLES_ROOT}/FocusFollow.vue`,
    },
    {
        key: "drawOn",
        name: EXAMPLE_NAMES.drawOn,
        readout: () =>
            "the arm length grows from nothing as the marks appear, so they draw out of each corner — at full length at once under reduced motion",
        path: `${EXAMPLES_ROOT}/DrawOn.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp item-key="color" label="Color" hint="The color the corner marks are drawn in.">
            <PageColorField :value="color" ariaLabel="Color" @input="(value: string) => (color = value)" />
        </PageProp>

        <PageProp item-key="cornerLengthWidth" label="Arm across (px)" hint="How long each corner's horizontal arm is.">
            <PageNumberField
                :value="lengthAcross"
                :min="CornerHighlightKnobs.MIN_LENGTH"
                :max="CornerHighlightKnobs.MAX_LENGTH"
                :step="CornerHighlightKnobs.LENGTH_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Arm across"
                @input="(value: number) => (lengthAcross = value)"
            />
        </PageProp>

        <PageProp item-key="cornerLengthHeight" label="Arm down (px)" hint="How long each corner's vertical arm is.">
            <PageNumberField
                :value="lengthDown"
                :min="CornerHighlightKnobs.MIN_LENGTH"
                :max="CornerHighlightKnobs.MAX_LENGTH"
                :step="CornerHighlightKnobs.LENGTH_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Arm down"
                @input="(value: number) => (lengthDown = value)"
            />
        </PageProp>

        <PageProp item-key="strokeThickness" label="Thickness (px)" hint="How thick the corner arms are drawn.">
            <PageNumberField
                :value="strokeThickness"
                :min="CornerHighlightKnobs.MIN_THICKNESS"
                :max="CornerHighlightKnobs.MAX_THICKNESS"
                :step="CornerHighlightKnobs.THICKNESS_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Thickness"
                @input="(value: number) => (strokeThickness = value)"
            />
        </PageProp>

        <PageProp
            item-key="transitionDurationMs"
            label="Fade (ms)"
            hint="How long the corners take to follow a change of color, which is how the set as a whole fades. The following and drawn-on examples also glide and grow over this time."
        >
            <PageNumberField
                :value="transitionDurationMs"
                :min="CornerHighlightKnobs.MIN_DURATION"
                :max="CornerHighlightKnobs.MAX_DURATION"
                :step="CornerHighlightKnobs.DURATION_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Fade in milliseconds"
                @input="(value: number) => (transitionDurationMs = value)"
            />
        </PageProp>

        <PageProp
            v-for="key in CORNER_HIGHLIGHT_KEYS"
            :key="key"
            :item-key="key"
            :label="CORNER_LABELS[key]"
            :hint="`Whether the ${CORNER_LABELS[key].toLowerCase()} mark is drawn at all.`"
        >
            <PageCheckField
                :value="visibleCorners.has(key)"
                :ariaLabel="CORNER_LABELS[key]"
                @change="(isVisible: boolean) => toggleCorner(key, isVisible)"
            />
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples">
        <template #default>
            <DefaultExample v-bind="commonProps" />
        </template>

        <template #control>
            <ControlExample v-bind="commonProps" />
        </template>

        <template #overlay>
            <OverlayExample v-bind="commonProps" />
        </template>

        <template #focusFollow>
            <FocusFollowExample v-bind="commonProps" />
        </template>

        <template #drawOn>
            <DrawOnExample v-bind="commonProps" />
        </template>
    </PageExamples>
</template>
