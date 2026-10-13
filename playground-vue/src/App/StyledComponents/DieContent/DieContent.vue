<script setup lang="ts">
import { LABEL_SHARE } from "@thewaver/ss-playground/App/StyledComponents/DieContent/DieContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/DieContent/DieContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PageDieFaceProps } from "./DieContentVue.types";

defineProps<PageDieFaceProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[styles.dieFace, layerClass, state.isShowing && styles.dieFaceShowing]"
        :style="{
            fontSize: `${Math.min(state.size.width, state.size.height) * LABEL_SHARE}px`,
        }"
        aria-hidden="true"
    >
        {{ label }}
    </div>
</template>
