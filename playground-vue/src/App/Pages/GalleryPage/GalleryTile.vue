<script setup lang="ts">
import { shallowRef } from "vue";

import { ElementObserverVueUtils } from "@thewaver/ss-components-vue";
import * as styles from "@thewaver/ss-playground/App/Pages/GalleryPage/GalleryPage.css";

import PageLayer from "../../PageComponents/Layer/Layer.vue";
import PagePreview from "../../PageComponents/Preview/Preview.vue";
import PageRouterLink from "../../PageComponents/RouterLink/RouterLink.vue";
import type { GalleryTileProps } from "./GalleryPage.types";

defineProps<GalleryTileProps>();

const previewRef = shallowRef<HTMLElement>();

const isOnScreen = ElementObserverVueUtils.useViewportIntersection(previewRef);
</script>

<template>
    <div :class="styles.galleryTile" data-gallery-tile="" :data-testid="item.href">
        <PageLayer :level="1">
            <PageRouterLink :class="styles.galleryTileName" :href="item.href">{{ item.name }}</PageRouterLink>

            <div ref="previewRef" :class="styles.galleryPreview">
                <PagePreview v-if="isOnScreen" :component="item.component" />
            </div>
        </PageLayer>
    </div>
</template>
