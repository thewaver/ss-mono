<script setup lang="ts">
import { computed, shallowRef } from "vue";

import type { CornerKey } from "@thewaver/ss-components-vue";
import { CORNERS_DEFAULTS, CORNERS_KEYS } from "@thewaver/ss-components-vue";
import { CornerKnobs } from "@thewaver/ss-playground/App/Knobs/Corners.const";

import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
import PageExamples from "../../PageComponents/Examples/PageExamples.vue";
import PageCheckField from "../../PageComponents/Field/PageCheckField.vue";
import PageColorField from "../../PageComponents/Field/PageColorField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import type { CornersExampleProps } from "./CornersPage.types";
import ControlExample from "./Examples/Control.vue";
import DefaultExample from "./Examples/Default.vue";
import DrawOnExample from "./Examples/DrawOn.vue";
import FocusFollowExample from "./Examples/FocusFollow.vue";
import OverlayExample from "./Examples/Overlay.vue";

const EXAMPLES_ROOT = "/src/App/Pages/CornersPage/Examples";

const CORNER_LABELS: Record<CornerKey, string> = {
    topLeft: "Top left",
    topRight: "Top right",
    bottomLeft: "Bottom left",
    bottomRight: "Bottom right",
};

const FIELD_WIDTH = 110;

const color = shallowRef(CornerKnobs.STARTING_COLOR);
const lengthAcross = shallowRef(CornerKnobs.STARTING_LENGTH);
const lengthDown = shallowRef(CornerKnobs.STARTING_LENGTH);
const strokeThickness = shallowRef(CORNERS_DEFAULTS.strokeThickness);
const transitionDurationMs = shallowRef(CORNERS_DEFAULTS.transitionDurationMs);
const hiddenCorners = shallowRef<CornerKey[]>(CORNERS_KEYS.filter((key) => !CORNERS_DEFAULTS.visibleCorners.has(key)));

const cornerLength = computed(() => ({ width: lengthAcross.value, height: lengthDown.value }));

const visibleCorners = computed(() => new Set(CORNERS_KEYS.filter((key) => !hiddenCorners.value.includes(key))));

const toggleCorner = (key: CornerKey, isVisible: boolean) => {
    hiddenCorners.value = isVisible
        ? hiddenCorners.value.filter((entry) => entry !== key)
        : [...hiddenCorners.value, key];
};

const commonProps = computed<CornersExampleProps>(() => ({
    color: color.value,
    cornerLength: cornerLength.value,
    strokeThickness: strokeThickness.value,
    transitionDurationMs: transitionDurationMs.value,
    visibleCorners: visibleCorners.value,
}));

const examples: ExampleDefs[] = [
    {
        key: "default",
        name: "Around a box",
        readout: () =>
            "each bracket is a single polygon rather than two rules, so the arm lengths and the thickness are numbers rather than a border pretending to be one",
        path: `${EXAMPLES_ROOT}/Default.vue`,
    },
    {
        key: "control",
        name: "As a control's decoration",
        readout: () =>
            "press it — the color transitions rather than switching, which is the whole reason the component owns a duration",
        path: `${EXAMPLES_ROOT}/Control.vue`,
    },
    {
        key: "overlay",
        name: "Over content it does not own",
        readout: () =>
            "the button underneath still takes a press, because the layer carrying the brackets refuses the pointer and says nothing to a screen reader",
        path: `${EXAMPLES_ROOT}/Overlay.vue`,
    },
    {
        key: "focusFollow",
        name: "Following focus and hover",
        readout: () =>
            "one set of marks glides to whichever control is hovered or reached by the keyboard, around the control's own focus ring rather than instead of it — and jumps rather than glides under reduced motion",
        path: `${EXAMPLES_ROOT}/FocusFollow.vue`,
    },
    {
        key: "drawOn",
        name: "Drawn on",
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
                :min="CornerKnobs.MIN_LENGTH"
                :max="CornerKnobs.MAX_LENGTH"
                :step="CornerKnobs.LENGTH_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Arm across"
                @input="(value: number) => (lengthAcross = value)"
            />
        </PageProp>

        <PageProp item-key="cornerLengthHeight" label="Arm down (px)" hint="How long each corner's vertical arm is.">
            <PageNumberField
                :value="lengthDown"
                :min="CornerKnobs.MIN_LENGTH"
                :max="CornerKnobs.MAX_LENGTH"
                :step="CornerKnobs.LENGTH_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Arm down"
                @input="(value: number) => (lengthDown = value)"
            />
        </PageProp>

        <PageProp item-key="strokeThickness" label="Thickness (px)" hint="How thick the corner arms are drawn.">
            <PageNumberField
                :value="strokeThickness"
                :min="CornerKnobs.MIN_THICKNESS"
                :max="CornerKnobs.MAX_THICKNESS"
                :step="CornerKnobs.THICKNESS_STEP"
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
                :min="CornerKnobs.MIN_DURATION"
                :max="CornerKnobs.MAX_DURATION"
                :step="CornerKnobs.DURATION_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Fade in milliseconds"
                @input="(value: number) => (transitionDurationMs = value)"
            />
        </PageProp>

        <PageProp
            v-for="key in CORNERS_KEYS"
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
