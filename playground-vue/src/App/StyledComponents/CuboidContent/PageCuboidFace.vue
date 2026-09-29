<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/CuboidContent/CuboidContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { CuboidFaceProps } from "./CuboidContent.types";

defineProps<CuboidFaceProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div :class="[styles.cuboidFace[face], layerClass]">
        <div :class="styles.cuboidFaceTitle">{{ face }}</div>
        <div :class="styles.cuboidFaceBody">{{ state.isShowing ? "facing you" : "turned away" }}</div>
    </div>
</template>
