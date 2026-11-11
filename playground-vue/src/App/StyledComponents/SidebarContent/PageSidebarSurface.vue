<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/SidebarContent/SidebarContent.css";

import PageLayer from "../../PageComponents/Layer/Layer.vue";
import { useNextLayerClass } from "../Layer/Layer.context";
import type { SidebarSurfaceProps } from "./SidebarContentVue.types";

defineProps<SidebarSurfaceProps>();

const nextLayerClass = useNextLayerClass();
</script>

<template>
    <div :class="[styles.sidebarSurface, nextLayerClass]">
        <div :class="styles.sidebarSurfaceContent" :style="{ width: `${width}px` }">
            <PageLayer><slot /></PageLayer>
        </div>
    </div>
</template>
