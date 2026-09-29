<script setup lang="ts">
import { useModel } from "vue";

import { Range } from "@thewaver/ss-components-vue";
import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";

import PageRangeContent from "../../../StyledComponents/RangeContent/RangeContent.vue";
import type { RangePairExampleProps } from "../RangePage.types";

type Props = RangePairExampleProps;

const props = defineProps<Props>();

const range = useModel(props, "range");
</script>

<template>
    <Range
        v-model:range="range"
        ariaLabel="Price range"
        :thumb-labels="['Lowest price', 'Highest price']"
        :thumb-size="RANGE_THUMB_SIZE"
    >
        <template #renderContent="renderProps">
            <PageRangeContent :render-props="renderProps" />
        </template>
    </Range>
</template>
