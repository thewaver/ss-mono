<script setup lang="ts">
import { Corners } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/CornersPage/CornersPage.css";

import type { CornersExampleProps } from "../CornersPage.types";

type Props = CornersExampleProps;

defineProps<Props>();
</script>

<template>
    <div :class="styles.frame">
        <Corners
            :color="color"
            :corner-length="cornerLength"
            :stroke-thickness="strokeThickness"
            :transition-duration-ms="transitionDurationMs"
            :visible-corners="visibleCorners"
        >
            <div :class="styles.frameBody">Whatever it is put around</div>
        </Corners>
    </div>
</template>
