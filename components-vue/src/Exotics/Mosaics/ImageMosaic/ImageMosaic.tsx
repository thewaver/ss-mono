import { type SlotsType, computed, defineComponent, onScopeDispose } from "vue";

import {
    IMAGE_MOSAIC_DEFAULTS,
    ImageMosaicStyles,
    ImageMosaicUtils,
    type MosaicPackDefs,
    MosaicUtils,
} from "@thewaver/ss-components";

import { Mosaic } from "../../../Primitives/Mosaic/Mosaic";
import type { MosaicSlots } from "../../../Primitives/Mosaic/Mosaic.types";
import { watchAfterRender } from "../../../Utils/effectUtils";
import { callSlot, declareProps } from "../../../Utils/propUtils";
import { useStore } from "../../../Utils/storeUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import type { ImageMosaicProps, ImageMosaicSlots } from "./ImageMosaic.types";

export const ImageMosaic = defineComponent(
    (props: ImageMosaicProps, { slots }: SlotsContext<ImageMosaicSlots>) => {
        const loader = ImageMosaicUtils.createSizeLoader();

        const sizeBySrc = useStore(loader.store);

        onScopeDispose(loader.stop);

        watchAfterRender([() => props.sources], ([sources]) => loader.request(sources));

        const sizes = computed(() => ImageMosaicUtils.computeSizes(props.sources, sizeBySrc.value));

        const keys = computed(() => props.sources.map((source) => source.src));

        const target = computed(() =>
            ImageMosaicUtils.computeTargetAspectRatio(
                props.targetAspectRatio ?? IMAGE_MOSAIC_DEFAULTS.targetAspectRatio,
                props.sizeAnchor,
            ),
        );

        const targetWidth = computed(() => target.value.width);
        const targetHeight = computed(() => target.value.height);

        const computePlacements = computed(() => {
            const width = targetWidth.value;
            const height = targetHeight.value;

            return (defs: MosaicPackDefs) => MosaicUtils.packScaled(defs, { width, height });
        });

        return () => (
            <Mosaic
                sizeAnchor={props.sizeAnchor}
                gap={props.gap}
                transitionDurationMs={props.transitionDurationMs}
                sizes={sizes.value}
                keys={keys.value}
                isItemSized={true}
                computePlacements={computePlacements.value}
                ariaLabel={props.ariaLabel}
                onActivate={props.onActivate}
            >
                {
                    {
                        renderItem: ({ index, state }) => {
                            const renderImage = () => (
                                <img
                                    class={ImageMosaicStyles.imageMosaicImage}
                                    src={props.sources[index]?.src}
                                    alt={props.sources[index]?.alt}
                                    decoding="async"
                                />
                            );

                            return slots.renderItem
                                ? callSlot(slots.renderItem, { renderImage, state })
                                : renderImage();
                        },
                    } satisfies MosaicSlots
                }
            </Mosaic>
        );
    },
    {
        name: "ImageMosaic",
        slots: Object as SlotsType<ImageMosaicSlots>,
        props: declareProps<ImageMosaicProps>({
            ariaLabel: null,
            onActivate: null,
            sizeAnchor: null,
            gap: null,
            transitionDurationMs: null,
            sources: null,
            targetAspectRatio: null,
        }),
    },
);
