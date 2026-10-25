<script setup lang="ts">
import { shallowRef } from "vue";

import { Range } from "@thewaver/ss-components-vue";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";
import type { Span } from "@thewaver/ss-utils";

import PageRangeContent from "../../../StyledComponents/RangeContent/RangeContent.vue";

const range = shallowRef<Span>({ start: 20, end: 80 });
</script>

<template>
    <div dir="rtl">
        <Range
            id="rightToLeft"
            v-model:range="range"
            ariaLabel="Price range"
            :thumb-labels="['Lowest price', 'Highest price']"
            :thumb-size="RANGE_THUMB_SIZE"
        >
            <template #renderContent="renderProps">
                <PageRangeContent :render-props="renderProps" />
            </template>
        </Range>
    </div>

    <div :class="exampleStyles.exampleReadout" data-readout>{{ `Start: ${range.start} | End: ${range.end}` }}</div>
</template>
