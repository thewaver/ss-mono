<script setup lang="ts">
import { ShadowCaster } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/PointerEffects/ShadowCasterPage/ShadowCasterPage.css";

import type { ShadowCasterExampleProps } from "../ShadowCasterPageVue.types";

type Props = ShadowCasterExampleProps;

defineProps<Props>();
</script>

<template>
    <div :class="styles.stage">
        <ShadowCaster
            :is-disabled="isDisabled"
            :active-range-px="activeRangePx"
            :smoothing-ms="smoothingMs"
            :light-range-px="lightRangePx"
            :max-throw-px="maxThrowPx"
            :min-blur-px="minBlurPx"
            :max-blur-px="maxBlurPx"
            :max-opacity="maxOpacity"
            :min-opacity="minOpacity"
            :resting-opacity="restingOpacity"
            :color="color"
        >
            <div :class="styles.badge" />
        </ShadowCaster>
    </div>
</template>
