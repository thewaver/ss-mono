<script setup lang="ts">
import { computed, useId } from "vue";

import type { PlacementSector } from "@thewaver/ss-components-vue";
import { PlacementUtils } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/WheelContent/WheelContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PageWheelWedgeProps } from "./WheelContent.types";

const LABEL_TYPE_RATIO = 0.14;
const NO_TILT = 0;
const HALF = 0.5;
const QUARTER_TURN = 90;
const UPSIDE_DOWN_FROM = 90;
const UPSIDE_DOWN_TO = 270;
const HALF_TURN = 180;
const FULL_TURN = 360;

const toLabelTilt = (wedgeAngle: number, sector: PlacementSector | undefined) => {
    if (!sector) return NO_TILT;

    const tilt = (sector.fromAngle + sector.toAngle) * HALF + QUARTER_TURN;
    const painted = (((wedgeAngle + tilt) % FULL_TURN) + FULL_TURN) % FULL_TURN;
    const isUpsideDown = painted > UPSIDE_DOWN_FROM && painted < UPSIDE_DOWN_TO;

    return tilt + (isUpsideDown ? HALF_TURN : NO_TILT);
};

const props = defineProps<PageWheelWedgeProps>();

const layerClass = useLayerClass();

const gradientId = useId();

const rect = computed(() => props.state.placement);
</script>

<template>
    <div v-if="rect" :class="[styles.wheelWedge, layerClass, state.isSelected && styles.isSelected]">
        <svg :class="styles.wheelWedgeSVG" viewBox="0 0 1 1">
            <defs>
                <linearGradient :id="gradientId" x1="0" y1="0" x2="1" y2="1">
                    <stop :class="styles.wheelWedgeGradientFrom" offset="0%" />
                    <stop :class="styles.wheelWedgeGradientTo" offset="100%" />
                </linearGradient>
            </defs>

            <path
                :class="styles.wheelWedgeShape"
                :style="{ fill: state.isSelected ? `url(#${gradientId})` : undefined }"
                :d="PlacementUtils.getSectorPath(rect.sector!)"
            />
        </svg>

        <div
            :class="styles.wheelWedgeLabel"
            :style="{
                left: PlacementUtils.toContainerWidth(rect.leftShare),
                top: PlacementUtils.toContainerWidth(rect.topShare),
                width: PlacementUtils.toContainerWidth(rect.widthShare),
                height: PlacementUtils.toContainerWidth(rect.heightShare),
                fontSize: PlacementUtils.toContainerWidth(rect.widthShare * LABEL_TYPE_RATIO),
                transform: `translate(-50%, -50%) rotate(${toLabelTilt(state.angle, rect.sector)}deg)`,
            }"
        >
            <slot />
        </div>
    </div>
</template>
