<script setup lang="ts">
import { computed, shallowRef, useId, watchPostEffect } from "vue";

import { ElementObserverUtils } from "@thewaver/ss-components";
import { SVGStyleDefsVueUtils, Shape } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.css";
import {
    fitFillGeomToArrow,
    toTooltipBodyStyle,
} from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.utils";
import type { Size2d } from "@thewaver/ss-utils";

import { useNextLayerClass } from "../Layer/Layer.context";
import type { TooltipSurfaceProps } from "./TooltipContent.types";

const props = defineProps<TooltipSurfaceProps>();

const id = useId();
const layerClass = useNextLayerClass();
const probeRef = shallowRef<HTMLDivElement>();
const probeSize = shallowRef<Size2d>({ width: 0, height: 0 });

watchPostEffect((onCleanup) => {
    const probe = probeRef.value;

    if (!probe) return;

    onCleanup(
        ElementObserverUtils.observeBorderBoxSize(probe, (size) => {
            probeSize.value = size;
        }),
    );
});

const skin = computed(() => {
    const probe = probeRef.value;
    const size = probeSize.value;

    if (!probe || size.width <= 0 || size.height <= 0) return undefined;

    const style = getComputedStyle(probe);

    return { converted: SVGStyleDefsVueUtils.computeDefsFromStyle(style, size, id), textColor: style.color };
});

const fillGeom = computed(() => fitFillGeomToArrow(skin.value?.converted.fillGeom ?? [], props.hasArrow ?? false));

const computePoints = (size: Size2d) => props.computeGeometry(size, toTooltipBodyStyle(skin.value?.converted));

const computeFillDefs = () => skin.value?.converted.fillDefs ?? [];

const computeStrokeDefs = computed(() => {
    const strokeDefs = skin.value?.converted.strokeDefs ?? [];

    return strokeDefs.length > 0 ? () => strokeDefs : undefined;
});
</script>

<template>
    <div :class="[styles.tooltipFrame, layerClass]">
        <div ref="probeRef" :class="styles.tooltipSkinProbe" aria-hidden="true" />

        <Shape
            :compute-points="computePoints"
            :fill-geom="fillGeom"
            :compute-fill-defs="computeFillDefs"
            :compute-stroke-defs="computeStrokeDefs"
        >
            <template #renderChildren>
                <div :class="styles.tooltipText" :style="{ color: skin?.textColor }"><slot /></div>
            </template>
        </Shape>
    </div>
</template>
