<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/HoverCardContent/HoverCardContent.css";

import PageLayer from "../../PageComponents/Layer/Layer.vue";
import { useNextLayerClass } from "../Layer/Layer.context";
import type { HoverCardContentProps } from "./HoverCardContentVue.types";

defineProps<HoverCardContentProps>();

const nextLayerClass = useNextLayerClass();
</script>

<template>
    <div
        :class="[styles.hoverCardContent, nextLayerClass, visibilityTarget === 1 && styles.isVisible]"
        :style="{ transition: `opacity ${transitionDurationMs}ms` }"
    >
        <PageLayer><slot /></PageLayer>
    </div>
</template>
