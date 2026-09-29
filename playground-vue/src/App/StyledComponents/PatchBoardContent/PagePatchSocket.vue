<script setup lang="ts">
import { computed } from "vue";

import * as styles from "@thewaver/ss-playground/App/StyledComponents/PatchBoardContent/PatchBoardContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PagePatchSocketProps } from "./PatchBoardContent.types";

const props = defineProps<PagePatchSocketProps>();

const layerClass = useLayerClass();

const isRefused = computed(() => props.flags.isAimed && !props.flags.isAllowed);
</script>

<template>
    <div
        :class="[
            styles.patchSocket,
            layerClass,
            flags.kind === 'in' && styles.isIn,
            flags.isTaken && styles.isTaken,
            flags.isSource && styles.isSource,
            flags.isAimed && styles.isAimed,
            isRefused && styles.isRefused,
            flags.isHovered && styles.isHovered,
            flags.isFocusVisible && styles.isFocusVisible,
            flags.isDisabled && styles.isDisabled,
        ]"
    />
</template>
