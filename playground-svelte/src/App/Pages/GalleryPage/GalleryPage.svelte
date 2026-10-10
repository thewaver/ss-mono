<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/Pages/GalleryPage/GalleryPage.css";

    import { GALLERY_SECTIONS } from "../../App.router";
    import GalleryTile from "./GalleryTile.svelte";
</script>

<div class={styles.galleryPage} data-view={"gallery"}>
    <h1 class={styles.galleryTitle}>Gallery</h1>

    {#each GALLERY_SECTIONS as section (section.name)}
        <section class={styles.gallerySection}>
            <h2 class={styles.galleryHeading}>{section.name}</h2>

            {#if section.description}
                <p class={styles.galleryDescription}>{section.description}</p>
            {/if}

            <div class={styles.galleryGrid}>
                {#each section.items as item (item.href)}
                    <GalleryTile {item} />
                {/each}
            </div>
        </section>
    {/each}
</div>
