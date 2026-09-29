<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/SidebarContent/SidebarContent.css";

import PageLayer from "../../PageComponents/Layer/Layer.vue";
import type { SidebarSurfaceProps } from "./SidebarContent.types";

defineProps<SidebarSurfaceProps>();
</script>

<template>
    <div :class="styles.sidebarSurface">
        <div :class="styles.sidebarSurfaceContent" :style="{ width: `${width}px` }">
            <PageLayer :level="1"><slot /></PageLayer>
        </div>
    </div>
</template>
