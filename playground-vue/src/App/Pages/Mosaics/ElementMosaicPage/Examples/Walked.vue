<script setup lang="ts">
import { ElementMosaic } from "@thewaver/ss-components-vue";
import { PICKED_GROWTH } from "@thewaver/ss-playground/App/Pages/Mosaics/Mosaics.const";

import PageMosaicTile from "../../../../StyledComponents/MosaicContent/PageMosaicTile.vue";
import type { WalkedExampleProps } from "../ElementMosaicPage.types";

type Props = WalkedExampleProps;

const props = defineProps<Props>();

const getGrowth = (name: string) => (props.pickedNames.includes(name) ? PICKED_GROWTH : 1);
</script>

<template>
    <ElementMosaic
        :items="items"
        :gap="gap"
        :size-anchor="sizeAnchor"
        :transition-duration-ms="transitionDurationMs"
        ariaLabel="Tiles"
        @activate="props.onActivate"
    >
        <template #renderItem="{ item, state }">
            <PageMosaicTile
                :state="state"
                :width="item.width * getGrowth(item.name)"
                :height="item.height * getGrowth(item.name)"
                >{{ item.name }}</PageMosaicTile
            >
        </template>
    </ElementMosaic>
</template>
