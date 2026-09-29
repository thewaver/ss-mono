<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/StyledComponents/MosaicContent/MosaicContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PageMosaicLinkProps } from "./MosaicContent.types";

defineProps<PageMosaicLinkProps>();

const layerClass = useLayerClass();
</script>

<template>
    <a :class="[styles.mosaicLink, layerClass]" :href="href">
        <slot />

        <span :class="styles.mosaicCaption">{{ caption }}</span>
    </a>
</template>
