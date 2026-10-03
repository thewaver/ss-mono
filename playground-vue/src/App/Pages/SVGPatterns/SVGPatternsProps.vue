<script setup lang="ts">
import type { SVGDefsColors } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/SVGPatterns/SVGPatterns.css";

import { SVGPatternKnobs } from "../../Knobs/SVGPatterns.const";
import PageColorField from "../../PageComponents/Field/PageColorField.vue";
import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import type { SVGPatternsControls } from "./SVGPatterns.types";

type Props = {
    controls: SVGPatternsControls;
};

const props = defineProps<Props>();

const colorKeys = () => Object.keys(props.controls.colors) as (keyof SVGDefsColors)[];
</script>

<template>
    <PageProp item-key="cellSize" label="Cell Size (px)" hint="How large one cell of the pattern is.">
        <PageNumberField
            :value="controls.cellSize.value"
            :min="SVGPatternKnobs.MIN_CELL_SIZE"
            :max="SVGPatternKnobs.MAX_CELL_SIZE"
            :step="SVGPatternKnobs.CELL_SIZE_STEP"
            ariaLabel="Cell size"
            @input="(value: number) => (props.controls.cellSize.value = value)"
        />
    </PageProp>

    <PageProp
        item-key="colors"
        label="Colors"
        hint="The colors the pattern is drawn from. Each sample uses as many of them as it needs."
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
        hint="How far the pattern is blurred outward, which is what gives it its glow."
    >
        <PageNumberField
            :value="controls.blurWidth.value"
            :min="SVGPatternKnobs.MIN_BLUR_WIDTH"
            :max="SVGPatternKnobs.MAX_BLUR_WIDTH"
            :step="SVGPatternKnobs.BLUR_WIDTH_STEP"
            ariaLabel="Blur width"
            @input="(value: number) => (props.controls.blurWidth.value = value)"
        />
    </PageProp>
</template>
