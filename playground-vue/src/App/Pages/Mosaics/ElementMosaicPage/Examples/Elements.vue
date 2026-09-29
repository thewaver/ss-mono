<script setup lang="ts">
import { ElementMosaic } from "@thewaver/ss-components-vue";

import PageMosaicTile from "../../../../StyledComponents/MosaicContent/PageMosaicTile.vue";
import type { ElementsExampleProps } from "../ElementMosaicPage.types";

type Props = ElementsExampleProps;

defineProps<Props>();
</script>

<template>
    <ElementMosaic :items="items" :gap="gap" :size-anchor="sizeAnchor" :transition-duration-ms="transitionDurationMs">
        <template #renderItem="{ item, state }">
            <PageMosaicTile :state="state" :width="item.width" :height="item.height">{{ item.name }}</PageMosaicTile>
        </template>
    </ElementMosaic>
</template>
