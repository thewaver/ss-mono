<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/DrawerPanel/DrawerPanel.css";

import PageLayer from "../../PageComponents/Layer/Layer.vue";
import { useNextLayerClass } from "../Layer/Layer.context";
import type { DrawerPanelProps } from "./DrawerPanelVue.types";

defineProps<DrawerPanelProps>();

const nextLayerClass = useNextLayerClass();
</script>

<template>
    <div
        :class="[
            styles.drawerPanel,
            nextLayerClass,
            styles.drawerSizeVariants[edge],
            visibilityTarget === 1 ? styles.drawerSlideOn : styles.drawerSlideOffVariants[edge],
        ]"
        :style="{ transition: `transform ${transitionDurationMs}ms` }"
    >
        <PageLayer><slot /></PageLayer>
    </div>
</template>
