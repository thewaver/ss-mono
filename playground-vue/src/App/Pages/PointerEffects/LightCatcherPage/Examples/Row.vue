<script setup lang="ts">
import { LightCatcher } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/PointerEffects/LightCatcherPage/LightCatcherPage.css";

import type { LightCatcherExampleProps } from "../LightCatcherPageVue.types";

const LAMPS = [1, 2, 3, 4, 5];

type Props = LightCatcherExampleProps;

defineProps<Props>();
</script>

<template>
    <div :class="styles.row">
        <div v-for="lamp in LAMPS" :key="lamp" :class="styles.lampSlot">
            <LightCatcher
                :is-disabled="isDisabled"
                :active-range-px="activeRangePx"
                :smoothing-ms="smoothingMs"
                :light-range-px="lightRangePx"
                :max-brightness="maxBrightness"
                :resting-brightness="restingBrightness"
                :max-lightness="maxLightness"
                :resting-lightness="restingLightness"
            >
                <div :class="styles.lamp">{{ lamp }}</div>
            </LightCatcher>
        </div>
    </div>
</template>
