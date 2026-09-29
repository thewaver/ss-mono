<script setup lang="ts">
import { MOSAIC_SIZE_ANCHORS, type MosaicSizeAnchor } from "@thewaver/ss-components-vue";
import { MosaicKnobs } from "@thewaver/ss-playground/App/Knobs/Mosaics.const";
import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/Mosaics/Mosaics.const";

import PageNumberField from "../../PageComponents/Field/PageNumberField.vue";
import PageSelectField from "../../PageComponents/Field/PageSelectField.vue";
import PageProp from "../../PageComponents/Prop/Prop.vue";
import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.vue";
import type { MosaicsPanelProps } from "./Mosaics.types";

const props = defineProps<MosaicsPanelProps>();

const controls = props.controls;
</script>

<template>
    <PagePropsPanel scope="global">
        <PageProp
            item-key="itemCount"
            label="Items"
            hint="How many tiles the mosaic packs. The arrangement is recomputed from scratch each time it changes."
        >
            <PageNumberField
                :value="controls.itemCount.value"
                :min="MosaicKnobs.MIN_ITEM_COUNT"
                :max="MosaicKnobs.MAX_ITEM_COUNT"
                :step="MosaicKnobs.ITEM_COUNT_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Items"
                @input="(value: number) => (controls.itemCount.value = value)"
            />
        </PageProp>

        <PageProp item-key="gap" label="Gap (px)" hint="The space left between tiles.">
            <PageNumberField
                :value="controls.gap.value"
                :min="MosaicKnobs.MIN_GAP"
                :max="MosaicKnobs.MAX_GAP"
                :step="MosaicKnobs.GAP_STEP"
                :width="FIELD_WIDTH"
                ariaLabel="Gap in pixels"
                @input="(value: number) => (controls.gap.value = value)"
            />
        </PageProp>

        <PageProp
            item-key="sizeAnchor"
            label="Fixed side"
            hint="Which side the mosaic takes as given: it fills that one and works the other out from the tiles."
        >
            <PageSelectField
                :value="controls.sizeAnchor.value"
                :values="MOSAIC_SIZE_ANCHORS"
                :width="FIELD_WIDTH"
                ariaLabel="Fixed side"
                @change="(value: MosaicSizeAnchor) => (controls.sizeAnchor.value = value)"
            />
        </PageProp>

        <PageProp
            item-key="transitionDurationMs"
            label="Glide (ms)"
            hint="How long a tile takes to glide to its new place when tiles are added, taken out or resized. Resizing the mosaic itself never glides. At 0 tiles move at once, and under reduced motion they always do."
        >
            <PageNumberField
                :value="controls.transitionDurationMs.value"
                :min="MosaicKnobs.MIN_DURATION_MS"
                :max="MosaicKnobs.MAX_DURATION_MS"
                :step="MosaicKnobs.DURATION_STEP_MS"
                :width="FIELD_WIDTH"
                ariaLabel="Glide duration in milliseconds"
                @input="(value: number) => (controls.transitionDurationMs.value = value)"
            />
        </PageProp>
    </PagePropsPanel>
</template>
