<script setup lang="ts">
import * as styles from "@thewaver/ss-playground/App/Pages/GalleryPage/GalleryPage.css";

import type { GalleryPageProps } from "./GalleryPage.types";
import GalleryTile from "./GalleryTile.vue";

defineProps<GalleryPageProps>();
</script>

<template>
    <div :class="styles.galleryPage" data-view="gallery">
        <h1 :class="styles.galleryTitle">Gallery</h1>

        <section v-for="section in sections" :key="section.name" :class="styles.gallerySection">
            <h2 :class="styles.galleryHeading">{{ section.name }}</h2>

            <p v-if="section.description" :class="styles.galleryDescription">{{ section.description }}</p>

            <div :class="styles.galleryGrid">
                <GalleryTile v-for="item in section.items" :key="item.href" :item="item" />
            </div>
        </section>
    </div>
</template>
