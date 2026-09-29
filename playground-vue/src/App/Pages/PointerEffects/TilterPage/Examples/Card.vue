<script setup lang="ts">
import { Tilter } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/PointerEffects/TilterPage/TilterPage.css";

import type { TilterExampleProps } from "../TilterPageVue.types";

const SHEEN_ANGLE_DEGREES = 115;

type Props = TilterExampleProps;

defineProps<Props>();
</script>

<template>
    <Tilter
        :is-disabled="isDisabled"
        :active-range-px="activeRangePx"
        :smoothing-ms="smoothingMs"
        :tilt-range-px="tiltRangePx"
        :max-tilt-degrees="maxTiltDegrees"
        :perspective-px="perspectivePx"
    >
        <template #renderSheen="state">
            <div
                :class="styles.sheen"
                :style="{
                    opacity: sheenOpacity * state.strength,
                    backgroundImage: `linear-gradient(${SHEEN_ANGLE_DEGREES}deg, transparent ${state.sheenPosition - sheenSpreadPercent}%, rgb(255 255 255 / 0.5) ${state.sheenPosition}%, transparent ${state.sheenPosition + sheenSpreadPercent}%)`,
                }"
            />
        </template>

        <div :class="styles.card">Tip me</div>
    </Tilter>
</template>
