<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/PatchBoardContent/PatchBoardContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PagePatchNodeProps } from "./PatchBoardContent.types";

defineProps<PagePatchNodeProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div
        :class="[
            styles.patchNode,
            layerClass,
            flags.isCarried && styles.isCarried,
            flags.isHovered && styles.isHovered,
            flags.isFocusVisible && styles.isFocusVisible,
            flags.isDisabled && styles.isDisabled,
        ]"
    >
        <span :class="styles.patchNodeName">{{ label }}</span>
        <span :class="styles.patchNodeKind">{{ kind }}</span>
    </div>
</template>
