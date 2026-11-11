<script setup lang="ts">
import { shallowRef, useId, watchPostEffect } from "vue";

import { SVGStyleDefsVueUtils, Shape } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/ShapePage/ShapePage.css";
import { ShapeConst, type Size2d } from "@thewaver/ss-utils";

type Converted = ReturnType<typeof SVGStyleDefsVueUtils.computeDefsFromStyle>;

type Props = {
    cssText: string;
};

const NOTHING_CONVERTED: Converted = {
    fillDefs: [],
    fillGeom: [],
    strokeDefs: [],
    strokeGeom: [],
    joinRadii: [],
    lameExponents: [],
};

const props = defineProps<Props>();

const id = useId();
const sourceRef = shallowRef<HTMLDivElement>();
const converted = shallowRef(NOTHING_CONVERTED);
const boxSize = shallowRef<Size2d>({ width: 0, height: 0 });

watchPostEffect(() => {
    const source = sourceRef.value;
    const cssText = props.cssText;

    if (!source) return;

    source.style.cssText = cssText;

    const size = { width: source.offsetWidth, height: source.offsetHeight };

    boxSize.value = size;
    converted.value = SVGStyleDefsVueUtils.computeDefsFromStyle(getComputedStyle(source), size, id);
});

const computePoints = (size: Size2d) => ShapeConst.getDefaultShapePoints("square", size);
</script>

<template>
    <div :class="styles.fromCssRow">
        <div ref="sourceRef" :class="styles.fromCssBox">CSS</div>

        <Shape
            :join-radii="converted.joinRadii"
            :fill-geom="converted.fillGeom"
            :lame-exponents="converted.lameExponents"
            :stroke-geom="converted.strokeGeom"
            :compute-points="computePoints"
            :compute-fill-defs="() => converted.fillDefs"
            :compute-stroke-defs="() => converted.strokeDefs"
        >
            <template #renderChildren>
                <div
                    :class="styles.fromCssCaption"
                    :style="{ width: `${boxSize.width}px`, height: `${boxSize.height}px` }"
                >
                    SVG
                </div>
            </template>
        </Shape>
    </div>
</template>
