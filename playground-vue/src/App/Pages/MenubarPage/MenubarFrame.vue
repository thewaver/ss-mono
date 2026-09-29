<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/Pages/MenubarPage/MenubarPage.css";

import { useLayerClass } from "../../StyledComponents/Layer/Layer.context";
import type { MenubarFrameProps } from "./MenubarPage.types";

defineProps<MenubarFrameProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div :class="[styles.bar, layerClass]" :style="{ width: `${width}px` }">
        <slot />
    </div>
</template>
