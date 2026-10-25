<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/Pages/Menus/WheelMenuPage/WheelMenuPage.css";

import type { WheelGradientDefsProps } from "./WheelMenuPageVue.types";

defineProps<WheelGradientDefsProps>();
</script>

<template>
    <svg :class="styles.wedgeDefs" aria-hidden="true">
        <defs>
            <linearGradient :id="gradientId" x1="0" y1="1" x2="1" y2="0">
                <stop :class="styles.wedgeGradientFrom" offset="0%" />
                <stop :class="styles.wedgeGradientTo" offset="100%" />
            </linearGradient>
        </defs>
    </svg>
</template>
