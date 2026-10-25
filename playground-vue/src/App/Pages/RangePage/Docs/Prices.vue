<script setup lang="ts">
import { shallowRef } from "vue";

import { Range } from "@thewaver/ss-components-vue";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";
import type { Span } from "@thewaver/ss-utils";

import PageRangeContent from "../../../StyledComponents/RangeContent/RangeContent.vue";

const MIN = 0;
const MAX = 500;
const STEP = 10;

const PRICE_FORMAT = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const range = shallowRef<Span>({ start: 100, end: 350 });
const settled = shallowRef<number[]>();
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
        :compute-value-text="(value: number) => PRICE_FORMAT.format(value)"
        @change-end="(values: number[]) => (settled = values)"
    >
        <template #renderContent="renderProps">
            <PageRangeContent :render-props="renderProps" />
        </template>
    </Range>

    <div :class="exampleStyles.exampleReadout" data-readout>
        {{
            `Read out as: ${PRICE_FORMAT.format(range.start)} and ${PRICE_FORMAT.format(range.end)} | Settled: ${settled?.join("–") ?? "not yet"}`
        }}
    </div>
</template>
