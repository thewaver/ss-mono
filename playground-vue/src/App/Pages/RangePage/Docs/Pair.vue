<script setup lang="ts">
import { shallowRef } from "vue";

import { Range } from "@thewaver/ss-components-vue";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";
import type { Span } from "@thewaver/ss-utils";

import PageRangeContent from "../../../StyledComponents/RangeContent/RangeContent.vue";
import type { RangePairDocsExampleProps } from "../RangePageVue.types";

type Props = RangePairDocsExampleProps;

defineProps<Props>();

const range = shallowRef<Span>({ start: 20, end: 80 });
</script>

<template>
    <Range
        id="pair"
        v-model:range="range"
        ariaLabel="Price range"
        :thumb-labels="['Lowest price', 'Highest price']"
        :is-disabled="isDisabled"
        :thumb-size="RANGE_THUMB_SIZE"
    >
        <template #renderContent="renderProps">
            <PageRangeContent :render-props="renderProps" />
        </template>
    </Range>

    <div :class="exampleStyles.exampleReadout" data-readout>{{ `Start: ${range.start} | End: ${range.end}` }}</div>
</template>
