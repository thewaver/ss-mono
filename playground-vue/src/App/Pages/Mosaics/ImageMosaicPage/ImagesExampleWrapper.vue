<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { ImageMosaicKnobs } from "@thewaver/ss-playground/App/Knobs/ImageMosaics.const";
import { MosaicImages } from "@thewaver/ss-playground/App/Pages/Mosaics/ImageMosaicPage/MosaicImages.const";
import { FIELD_WIDTH, MOSAIC_EXTENT } from "@thewaver/ss-playground/App/Pages/Mosaics/Mosaics.const";

import PageExampleKnobs from "../../../PageComponents/ExampleKnobs/PageExampleKnobs.vue";
import PageCheckField from "../../../PageComponents/Field/PageCheckField.vue";
import PageSelectField from "../../../PageComponents/Field/PageSelectField.vue";
import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.vue";
import PageProp from "../../../PageComponents/Prop/Prop.vue";
import type { MosaicSharedProps } from "../Mosaics.types";
import ImagesExample from "./Examples/Images.vue";

const props = defineProps<MosaicSharedProps>();

const shapeKey = shallowRef<MosaicImages.SampleShapeKey>(ImageMosaicKnobs.STARTING_SHAPE_KEY);
const isDecorated = shallowRef(ImageMosaicKnobs.STARTING_IS_DECORATED);

const sources = computed(() => MosaicImages.SAMPLE_SOURCES.slice(0, props.itemCount));
</script>

<template>
    <PageMeasureBox
        :width="sizeAnchor === 'width' ? MOSAIC_EXTENT : undefined"
        :height="sizeAnchor === 'height' ? MOSAIC_EXTENT : undefined"
    >
        <ImagesExample
            :sources="sources"
            :gap="gap"
            :size-anchor="sizeAnchor"
            :transition-duration-ms="transitionDurationMs"
            :shape-key="shapeKey"
            :is-decorated="isDecorated"
        />
    </PageMeasureBox>

    <PageExampleKnobs>
        <PageProp item-key="shapeKey" label="Target shape" hint="The outline the tiles are packed into.">
            <PageSelectField
                :value="shapeKey"
                :values="MosaicImages.SAMPLE_SHAPE_KEYS"
                :width="FIELD_WIDTH"
                ariaLabel="Target shape"
                @change="(value: MosaicImages.SampleShapeKey) => (shapeKey = value)"
            />
        </PageProp>

        <PageProp
            item-key="isDecorated"
            label="Wrapped"
            hint="Puts each tile in a frame of its own, so the packing can be told apart from the pictures in it."
        >
            <PageCheckField
                :value="isDecorated"
                ariaLabel="Wrapped"
                @change="(value: boolean) => (isDecorated = value)"
            />
        </PageProp>
    </PageExampleKnobs>
</template>
