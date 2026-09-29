<script setup lang="ts">
import { computed, shallowRef, useId } from "vue";

import { GlassSurface, InteractionTrackerVueUtils, SVGDefsSamples } from "@thewaver/ss-components-vue";
import type { PartialGlassDefs } from "@thewaver/ss-components-vue";
import {
    NO_SAMPLE_KEY,
    computeNoSampleDefs,
} from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
import * as styles from "@thewaver/ss-playground/App/Pages/GlassSurfacePage/GlassSurfacePage.css";
import knight from "@thewaver/ss-playground/App/knight.webp";
import { CSSUtils, type Point2d, type Size2d } from "@thewaver/ss-utils";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import type { GlassSurfaceExampleProps } from "../GlassSurfacePage.types";

const STARTING_RATIO: Point2d = { x: 0.5, y: 0.5 };
const HALF_PANE = styles.paneSize * 0.5;

const toOffset = (ratio: number) =>
    `clamp(0px, calc(${ratio * 100}% - ${HALF_PANE}px), calc(100% - ${styles.paneSize}px))`;

const props = defineProps<GlassSurfaceExampleProps>();

const id = useId();

const stageRef = shallowRef<HTMLDivElement>();
const ratio = shallowRef(STARTING_RATIO);

let grabOffset: Point2d | undefined;

const { isDragging } = InteractionTrackerVueUtils.useDrag(stageRef, false, {
    onDrag: (dragRatio) => {
        const offset = (grabOffset ??= { x: dragRatio.x - ratio.value.x, y: dragRatio.y - ratio.value.y });

        ratio.value = { x: dragRatio.x - offset.x, y: dragRatio.y - offset.y };
    },
    onDragEnd: () => {
        grabOffset = undefined;
    },
});

const computeStrokeDefs = (size: Size2d, element: HTMLElement | undefined) => {
    if (props.strokeConfigKey === NO_SAMPLE_KEY) return computeNoSampleDefs(props.colors, "stroke");

    return SVGDefsSamples.Gradient.Tracked.toConfig({
        family: props.strokeConfigKey,
        defs: props.strokeConfigDefs,
    } as SVGDefsSamples.Gradient.Tracked.Entry).computeSVGDefs(`stroke-${id}`, undefined, element, {
        getSize: () => size,
        colors: props.colors,
        blurWidth: props.blurWidth,
    });
};

const glassDefs = computed<PartialGlassDefs>(() => ({
    noise: {
        frequency: props.noiseFrequency,
        octaves: props.noiseOctaves,
    },
    backdrop: { blurRadius: props.blurRadius },
    ripple: { scale: props.rippleScale },
    tint: { color: props.tintColor, opacity: props.tintOpacity },
    sheen: {
        lightHeight: props.lightHeight,
        surfaceScale: props.surfaceScale,
        specularConstant: props.specularConstant,
        specularExponent: props.specularExponent,
    },
}));
</script>

<template>
    <div ref="stageRef" :class="styles.stage" :style="{ backgroundImage: `url(${knight})` }">
        <div
            :class="styles.paneHost"
            :data-dragging="isDragging ? '' : undefined"
            :style="
                assignInlineVars({
                    [styles.paneLeftVar]: toOffset(ratio.x),
                    [styles.paneTopVar]: toOffset(ratio.y),
                })
            "
        >
            <GlassSurface
                :border-radii="CSSUtils.spreadRadius(borderRadius)"
                :border-widths="CSSUtils.spreadWidth(borderWidth)"
                :compute-stroke-defs="computeStrokeDefs"
                :glass-defs="glassDefs"
            >
                <div :class="styles.paneContent">Glass</div>
            </GlassSurface>

            <div :class="styles.paneShadow" :style="{ borderRadius: `${borderRadius}px` }" />
        </div>
    </div>
</template>
