<script setup lang="ts">
import { WORD_START } from "@thewaver/ss-playground/App/StyledComponents/TreemapContent/TreemapContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TreemapContent/TreemapContent.css";

import { useLayerClass } from "../Layer/Layer.context";
import type { PageTreemapTileProps } from "./TreemapContentVue.types";

defineProps<PageTreemapTileProps>();

const layerClass = useLayerClass();
</script>

<template>
    <div :class="[styles.treemapTile, layerClass, isBranch && styles.treemapTileBranch]">
        <span v-for="(word, index) in name.split(WORD_START)" :key="index">{{ word }}</span>

        <span :class="styles.treemapTileWeight">{{ weight }}</span>
    </div>
</template>
