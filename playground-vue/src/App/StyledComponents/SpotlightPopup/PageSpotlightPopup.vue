<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/SpotlightPopup/SpotlightPopup.css";

import PageLayer from "../../PageComponents/Layer/Layer.vue";
import { useNextLayerClass } from "../Layer/Layer.context";
import type { SpotlightPopupProps } from "./SpotlightPopupVue.types";

defineProps<SpotlightPopupProps>();

const layerClass = useNextLayerClass();
</script>

<template>
    <div
        :class="[styles.spotlightPopup, layerClass]"
        :style="{
            opacity: visibilityTarget,
            transition: `opacity ${transitionDurationMs}ms`,
        }"
    >
        <div :class="styles.spotlightPopupTitle">{{ title }}</div>
        <PageLayer><slot /></PageLayer>
    </div>
</template>
