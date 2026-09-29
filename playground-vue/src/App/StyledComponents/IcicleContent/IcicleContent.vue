<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/IcicleContent/IcicleContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PageIcicleCellProps } from "./IcicleContent.types";

const MIN_LABEL_HEIGHT = 16;
const LABEL_SHOWN = 1;
const LABEL_HIDDEN = 0;

defineProps<PageIcicleCellProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            `${styles.icicleCell} ${family ? styles.icicleCellFamily[family] : styles.icicleCellRoot}`,
            layerClass,
        ]"
        :title="title"
    >
        <span
            :class="styles.icicleLabel"
            :style="{ opacity: state.rect.height > MIN_LABEL_HEIGHT ? LABEL_SHOWN : LABEL_HIDDEN }"
        >
            {{ name }} <span :class="styles.icicleWeight">{{ weight }}</span>
        </span>
    </div>
</template>
