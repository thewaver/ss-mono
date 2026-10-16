<script setup lang="ts">
import { RGBSplitter } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/PointerEffects/RGBSplitterPage/RGBSplitterPage.css";
import knightProfile from "@thewaver/ss-playground/App/knight_profile.webp";

import type { RGBSplitterExampleProps } from "../RGBSplitterPageVue.types";

type Props = RGBSplitterExampleProps;

defineProps<Props>();
</script>

<template>
    <div :class="styles.stage">
        <RGBSplitter
            :is-disabled="isDisabled"
            :active-range-px="activeRangePx"
            :smoothing-ms="smoothingMs"
            :split-range-px="splitRangePx"
            :max-offset-px="maxOffsetPx"
            :color-mixing="colorMixing"
        >
            <img :class="styles.photo" :src="knightProfile" alt="A knight in armor" />
        </RGBSplitter>
    </div>
</template>
