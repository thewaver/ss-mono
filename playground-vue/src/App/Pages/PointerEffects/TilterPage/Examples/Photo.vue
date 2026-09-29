<script setup lang="ts">
import { Tilter } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/PointerEffects/TilterPage/TilterPage.css";
import knight from "@thewaver/ss-playground/App/knight_profile.webp";

import type { TilterExampleProps } from "../TilterPageVue.types";

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
        <img :class="styles.photo" :src="knight" alt="A knight, tilting with the pointer" />
    </Tilter>
</template>
