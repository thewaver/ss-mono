<script lang="ts">
    import { ImageMosaic, Wraparound } from "@thewaver/ss-components-svelte";
    import { MosaicImages } from "@thewaver/ss-playground/App/Pages/Mosaics/ImageMosaicPage/MosaicImages.const";
    import { MOSAIC_GAP, PICTURES_REPEATING_EVERY_DIRECTION_LABEL } from "@thewaver/ss-playground/App/Pages/WraparoundPage/WraparoundPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/WraparoundPage/WraparoundPage.css";

    import type { WraparoundExampleProps } from "../WraparoundPageSvelte.types";

    type Props = WraparoundExampleProps;

    let props: Props = $props();
</script>

<div class={styles.stage}>
    <Wraparound ariaLabel={PICTURES_REPEATING_EVERY_DIRECTION_LABEL}>
        {#snippet renderContent()}
            <div class={styles.mosaicTile}>
                <ImageMosaic
                    sources={MosaicImages.SAMPLE_SOURCES}
                    gap={MOSAIC_GAP}
                    sizeAnchor={"width"}
                    targetAspectRatio={MosaicImages.SAMPLE_SHAPES.landscape}
                    ariaLabel={"Pictures"}
                    onActivate={(index) => props.onPress(`picture ${index + 1}`)}
                >
                    {#snippet renderItem(renderImage)}
                        {@render renderImage()}
                    {/snippet}
                </ImageMosaic>
            </div>
        {/snippet}
    </Wraparound>
</div>
