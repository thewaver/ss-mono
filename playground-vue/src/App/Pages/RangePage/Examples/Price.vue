<script setup lang="ts">
import { useModel } from "vue";

import { Range } from "@thewaver/ss-components-vue";
import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";

import PageRangeContent from "../../../StyledComponents/RangeContent/RangeContent.vue";
import type { RangePriceExampleProps } from "../RangePage.types";

const MIN = 0;
const MAX = 500;
const STEP = 10;

const PRICE_FORMAT = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

type Props = RangePriceExampleProps;

const props = defineProps<Props>();

const range = useModel(props, "range");
</script>

<template>
    <Range
        id="price"
        v-model:range="range"
        ariaLabel="Price range"
        :thumb-labels="['Lowest price', 'Highest price']"
        :min="MIN"
        :max="MAX"
        :step="STEP"
        :thumb-size="RANGE_THUMB_SIZE"
        :compute-value-text="(value) => PRICE_FORMAT.format(value)"
        @change-end="props.onChangeEnd"
    >
        <template #renderContent="renderProps">
            <PageRangeContent :render-props="renderProps" />
        </template>
    </Range>
</template>
