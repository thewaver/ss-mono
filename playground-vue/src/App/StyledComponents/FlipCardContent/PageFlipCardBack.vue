<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/FlipCardContent/FlipCardContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { FlipCardFaceProps } from "./FlipCardContent.types";

defineProps<FlipCardFaceProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div :class="[styles.flipCardBack, layerClass]">
        <div :class="styles.flipCardTitle"><slot /></div>
        <div :class="styles.flipCardBody">{{ state.isShowing ? "facing you" : "turned away" }}</div>
    </div>
</template>
