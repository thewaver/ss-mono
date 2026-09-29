<script setup lang="ts">
import { useModel } from "vue";

import { PlacementLayoutUtils, Radio, RadioGroup } from "@thewaver/ss-components-vue";
import type { ArcDefs } from "@thewaver/ss-components-vue";

import PageRadioStarCell from "../../../StyledComponents/RadioStarContent/PageRadioStarCell.vue";
import PageRadioStarContent from "../../../StyledComponents/RadioStarContent/PageRadioStarContent.vue";
import type { RadioRatingExampleProps } from "../RadioPage.types";

const RATING_OPTIONS = [1, 2, 3, 4, 5];

const ARC_DEFS: ArcDefs = {
    curveHeightRatio: 0.3867,
    spreadDegrees: 160,
    itemWidthRatio: 0.11,
    itemHeightRatio: 1.0909,
};

const ARC_LAYOUT = PlacementLayoutUtils.createArc(ARC_DEFS);

type Props = RadioRatingExampleProps;

const ARC_WIDTH = "300px";

const props = defineProps<Props>();

const value = useModel(props, "value");
const hovered = useModel(props, "hovered");
</script>

<template>
    <div :style="{ width: ARC_WIDTH }">
        <RadioGroup v-model:value="value" ariaLabel="Rating on an arc" :compute-layout="ARC_LAYOUT">
            <Radio
                v-for="rating in RATING_OPTIONS"
                :key="rating"
                :value="rating"
                :ariaLabel="rating === 1 ? '1 star' : `${rating} stars`"
                @mouse-enter="hovered = rating"
                @mouse-leave="hovered = undefined"
            >
                <template #renderContent="flags">
                    <PageRadioStarCell>
                        <PageRadioStarContent :flags="flags" :is-filled="rating <= (hovered ?? value)" />
                    </PageRadioStarCell>
                </template>
            </Radio>
        </RadioGroup>
    </div>
</template>
