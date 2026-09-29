<script setup lang="ts">
import type { SVGDefsColors } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/SVGGradients/SVGGradients.css";

import { SVGGradientKnobs } from "../../Knobs/SVGGradients.const";
import PageColorField from "../../PageComponents/Field/PageColorField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import type { SVGGradientsControls, SVGGradientsPaintKind } from "./SVGGradients.types";

type Props = {
    controls: SVGGradientsControls;
};

const props = defineProps<Props>();

const colorKeys = () => Object.keys(props.controls.colors) as (keyof SVGDefsColors)[];
</script>

<template>
    <PageProp
        item-key="paintKind"
        label="Painted as"
        hint="Whether the gradient paints the inside of the sample shape or only its outline."
    >
        <PageSelectField
            :value="controls.paintKind.value"
            :values="SVGGradientKnobs.PAINT_KINDS"
            ariaLabel="Painted as"
            @change="(kind: SVGGradientsPaintKind) => (props.controls.paintKind.value = kind)"
        />
    </PageProp>

    <PageProp
        item-key="colors"
        label="Colors"
        hint="The colors the gradient is built from. Each sample uses as many of them as it needs."
    >
        <div :class="styles.colorList">
            <PageColorField
                v-for="key in colorKeys()"
                :key="key"
                :value="controls.colors[key]"
                :ariaLabel="key"
                @input="(value: string) => props.controls.setColor(key, value)"
            />
        </div>
    </PageProp>

    <PageProp
        item-key="blurWidth"
        label="Blur (px)"
        hint="How far the paint is blurred outward, which is what gives it its glow."
    >
        <PageNumberField
            :value="controls.blurWidth.value"
            :min="SVGGradientKnobs.MIN_BLUR_WIDTH"
            :max="SVGGradientKnobs.MAX_BLUR_WIDTH"
            :step="SVGGradientKnobs.BLUR_WIDTH_STEP"
            ariaLabel="Blur width"
            @input="(value: number) => (props.controls.blurWidth.value = value)"
        />
    </PageProp>
</template>
