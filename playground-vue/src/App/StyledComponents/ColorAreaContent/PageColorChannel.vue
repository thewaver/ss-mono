<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/ColorAreaContent/ColorAreaContent.css";

import { useLayerClass } from "../Layer/Layer.context";

defineProps<{ label: string }>();

const layerClass = useLayerClass();
</script>

<template>
    <div :class="[styles.colorChannel, layerClass]">
        <div :class="styles.colorChannelLabel" aria-hidden="true">
            {{ label }}
        </div>

        <slot />
    </div>
</template>
