<script setup lang="ts">
import { LightCatcher } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/PointerEffects/LightCatcherPage/LightCatcherPage.css";

import type { LightCatcherExampleProps } from "../LightCatcherPageVue.types";

type Props = LightCatcherExampleProps;

defineProps<Props>();
</script>

<template>
    <div :class="styles.stage">
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
            <div :class="styles.panelCard">Come nearer</div>
        </LightCatcher>
    </div>
</template>
