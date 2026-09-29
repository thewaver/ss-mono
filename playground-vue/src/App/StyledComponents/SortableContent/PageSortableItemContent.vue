<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/SortableContent/SortableContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { SortableItemContentProps } from "./SortableContent.types";

defineProps<SortableItemContentProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.sortableItemContent,
            layerClass,
            isCenterd === true && styles.sortableItemCenterd,
            flags.isCarried && styles.isCarried,
            flags.isHovered && styles.isHovered,
            flags.isDisabled && styles.isDisabled,
        ]"
    >
        <div :class="styles.sortableItemGrip" aria-hidden="true">⠿</div>

        <div><slot /></div>

        <div v-if="detail" :class="styles.sortableItemDetail">{{ detail }}</div>
    </div>
</template>
