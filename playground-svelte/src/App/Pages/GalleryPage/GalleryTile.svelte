<script lang="ts">
    import { ElementObserverSvelteUtils } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/GalleryPage/GalleryPage.css";

    import PageLayer from "../../PageComponents/Layer/Layer.svelte";
    import PagePreview from "../../PageComponents/Preview/Preview.svelte";
    import PageRouterLink from "../../PageComponents/RouterLink/RouterLink.svelte";
    import type { GalleryTileProps } from "./GalleryPage.types";

    let props: GalleryTileProps = $props();

    let previewRef = $state<HTMLElement>();

    const getIsOnScreen = ElementObserverSvelteUtils.createViewportIntersectionObserver(() => previewRef);
</script>

<div class={styles.galleryTile} data-gallery-tile="" data-testid={props.item.href}>
    <PageLayer level={1}>
        <PageRouterLink class={styles.galleryTileName} href={props.item.href}>
            {props.item.name}
        </PageRouterLink>

        <div bind:this={previewRef} class={styles.galleryPreview}>
            {#if getIsOnScreen()}
                <PagePreview component={props.item.component} />
            {/if}
        </div>
    </PageLayer>
</div>
