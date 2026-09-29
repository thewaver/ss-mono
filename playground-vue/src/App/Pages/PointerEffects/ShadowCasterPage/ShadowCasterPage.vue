<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { SHADOW_CASTER_DEFAULTS } from "@thewaver/ss-components-vue";
import { ShadowCasterKnobs } from "@thewaver/ss-playground/App/Knobs/ShadowCasters.const";

import PageExamples from "../../../PageComponents/Examples/PageExamples.vue";
import type { ExampleDefs } from "../../../PageComponents/Examples/Examples.types";
import PageCheckField from "../../../PageComponents/Field/PageCheckField.vue";
import PageColorField from "../../../PageComponents/Field/PageColorField.vue";
import PageNumberField from "../../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../../PageComponents/PropsPanel/PagePropsPanel.vue";
import BadgeExample from "./Examples/Badge.vue";
import CardExample from "./Examples/Card.vue";
import type { ShadowCasterExampleProps } from "./ShadowCasterPageVue.types";

const EXAMPLES_ROOT = "/src/App/Pages/PointerEffects/ShadowCasterPage/Examples";

const FIELD_WIDTH = 110;

const isDisabled = shallowRef(ShadowCasterKnobs.STARTING_IS_DISABLED);
const smoothingMs = shallowRef(SHADOW_CASTER_DEFAULTS.smoothingMs);
const activeRangePx = shallowRef(ShadowCasterKnobs.STARTING_ACTIVE_RANGE_PX);
const lightRangePx = shallowRef(SHADOW_CASTER_DEFAULTS.lightRangePx);
const maxThrowPx = shallowRef(SHADOW_CASTER_DEFAULTS.maxThrowPx);
const minBlurPx = shallowRef(SHADOW_CASTER_DEFAULTS.minBlurPx);
const maxBlurPx = shallowRef(SHADOW_CASTER_DEFAULTS.maxBlurPx);
const maxOpacity = shallowRef(SHADOW_CASTER_DEFAULTS.maxOpacity);
const minOpacity = shallowRef(SHADOW_CASTER_DEFAULTS.minOpacity);
const restingOpacity = shallowRef(SHADOW_CASTER_DEFAULTS.restingOpacity);
const color = shallowRef(SHADOW_CASTER_DEFAULTS.color);

const commonProps = computed<ShadowCasterExampleProps>(() => ({
    isDisabled: isDisabled.value,
    activeRangePx: activeRangePx.value,
    smoothingMs: smoothingMs.value,
    lightRangePx: lightRangePx.value,
    maxThrowPx: maxThrowPx.value,
    minBlurPx: minBlurPx.value,
    maxBlurPx: maxBlurPx.value,
    maxOpacity: maxOpacity.value,
    minOpacity: minOpacity.value,
    restingOpacity: restingOpacity.value,
    color: color.value,
}));

const examples: ExampleDefs[] = [
    {
        key: "card",
        name: "Card",
        readout: () =>
            "the shadow is thrown away from the pointer, and lengthens and softens as the pointer retreats",
        path: `${EXAMPLES_ROOT}/Card.vue`,
    },
    {
        key: "badge",
        name: "Cut shape",
        readout: () =>
            "the same wrapper over a clipped star — the shadow traces the shape rather than the box around it",
        path: `${EXAMPLES_ROOT}/Badge.vue`,
    },
];
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp
            item-key="isDisabled"
            label="Disabled"
            hint="Stops the shadow following the pointer and leaves it at rest. It is what a page honoring a reduced-motion preference passes."
        >
            <PageCheckField
                :value="isDisabled"
                ariaLabel="Disabled"
                @change="(value: boolean) => (isDisabled = value)"
            />
        </PageProp>

        <PageProp
            item-key="smoothingMs"
            label="Smoothing (ms)"
            hint="How long the shadow takes to catch up with the pointer. At 0 it follows exactly; raised, it swings after a quick movement and eases back to rest."
        >
            <PageNumberField
                :value="smoothingMs"
                :min="ShadowCasterKnobs.MIN_SMOOTHING_MS"
                :max="ShadowCasterKnobs.MAX_SMOOTHING_MS"
                :step="ShadowCasterKnobs.SMOOTHING_STEP_MS"
                :width="FIELD_WIDTH"
                ariaLabel="Smoothing in milliseconds"
                @input="(value: number) => (smoothingMs = value)"
            />
        </PageProp>

        <PageProp
            item-key="activeRangePx"
            label="Active range (px)"
            hint="How near the pointer has to be before the shadow answers it at all, measured from the content's center. Outside it the shadow rests."
        >
            <PageNumberField
                :value="activeRangePx"
                :min="ShadowCasterKnobs.MIN_ACTIVE_RANGE_PX"
                :max="ShadowCasterKnobs.MAX_ACTIVE_RANGE_PX"
                :step="ShadowCasterKnobs.ACTIVE_RANGE_STEP_PX"
                :width="FIELD_WIDTH"
                ariaLabel="Active range in pixels"
                @input="(value: number) => (activeRangePx = value)"
            />
        </PageProp>

        <PageProp
            item-key="lightRangePx"
            label="Light range (px)"
            hint="How far the pointer's light reaches. Past it the shadow is at its longest and faintest."
        >
            <PageNumberField
                :value="lightRangePx"
                :min="ShadowCasterKnobs.MIN_LIGHT_RANGE_PX"
                :max="ShadowCasterKnobs.MAX_LIGHT_RANGE_PX"
                :step="ShadowCasterKnobs.LIGHT_RANGE_STEP_PX"
                :width="FIELD_WIDTH"
                ariaLabel="Light range in pixels"
                @input="(value: number) => (lightRangePx = value)"
            />
        </PageProp>

        <PageProp
            item-key="maxThrowPx"
            label="Max throw (px)"
            hint="How far the shadow is thrown once the pointer is out at the edge of the light."
        >
            <PageNumberField
                :value="maxThrowPx"
                :min="ShadowCasterKnobs.MIN_THROW_PX"
                :max="ShadowCasterKnobs.MAX_THROW_PX"
                :step="ShadowCasterKnobs.THROW_STEP_PX"
                :width="FIELD_WIDTH"
                ariaLabel="Maximum throw in pixels"
                @input="(value: number) => (maxThrowPx = value)"
            />
        </PageProp>

        <PageProp
            item-key="minBlurPx"
            label="Near blur (px)"
            hint="How soft the shadow is with the pointer on the content."
        >
            <PageNumberField
                :value="minBlurPx"
                :min="ShadowCasterKnobs.MIN_BLUR_PX"
                :max="ShadowCasterKnobs.MAX_BLUR_PX"
                :step="ShadowCasterKnobs.BLUR_STEP_PX"
                :width="FIELD_WIDTH"
                ariaLabel="Near blur in pixels"
                @input="(value: number) => (minBlurPx = value)"
            />
        </PageProp>

        <PageProp
            item-key="maxBlurPx"
            label="Far blur (px)"
            hint="How soft the shadow is once the pointer is out at the edge of the light."
        >
            <PageNumberField
                :value="maxBlurPx"
                :min="ShadowCasterKnobs.MIN_BLUR_PX"
                :max="ShadowCasterKnobs.MAX_BLUR_PX"
                :step="ShadowCasterKnobs.BLUR_STEP_PX"
                :width="FIELD_WIDTH"
                ariaLabel="Far blur in pixels"
                @input="(value: number) => (maxBlurPx = value)"
            />
        </PageProp>

        <PageProp
            item-key="maxOpacity"
            label="Near opacity"
            hint="How dark the shadow is with the pointer on the content. It fades as the pointer retreats."
        >
            <PageNumberField
                :value="maxOpacity"
                :min="ShadowCasterKnobs.MIN_OPACITY"
                :max="ShadowCasterKnobs.MAX_OPACITY"
                :step="ShadowCasterKnobs.OPACITY_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Near opacity"
                @input="(value: number) => (maxOpacity = value)"
            />
        </PageProp>

        <PageProp
            item-key="minOpacity"
            label="Far opacity"
            hint="How dark the shadow is once the pointer is out at the edge of the light. Nothing, by default."
        >
            <PageNumberField
                :value="minOpacity"
                :min="ShadowCasterKnobs.MIN_OPACITY"
                :max="ShadowCasterKnobs.MAX_OPACITY"
                :step="ShadowCasterKnobs.OPACITY_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Far opacity"
                @input="(value: number) => (minOpacity = value)"
            />
        </PageProp>

        <PageProp
            item-key="restingOpacity"
            label="Resting opacity"
            hint="How dark the shadow is with no pointer near it at all, or with the effect turned off."
        >
            <PageNumberField
                :value="restingOpacity"
                :min="ShadowCasterKnobs.MIN_OPACITY"
                :max="ShadowCasterKnobs.MAX_OPACITY"
                :step="ShadowCasterKnobs.OPACITY_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Resting opacity"
                @input="(value: number) => (restingOpacity = value)"
            />
        </PageProp>

        <PageProp
            item-key="color"
            label="Color"
            hint="What the shadow is made of. Whatever alpha it carries is replaced by the opacity ramp."
        >
            <PageColorField :value="color" ariaLabel="Color" @input="(value: string) => (color = value)" />
        </PageProp>
    </PagePropsPanel>

    <PageExamples :items="examples">
        <template #card>
            <CardExample v-bind="commonProps" />
        </template>

        <template #badge>
            <BadgeExample v-bind="commonProps" />
        </template>
    </PageExamples>
</template>
