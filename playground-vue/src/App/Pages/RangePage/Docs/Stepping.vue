<script setup lang="ts">
import { shallowRef } from "vue";

import { Range } from "@thewaver/ss-components-vue";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";

import PageRangeContent from "../../../StyledComponents/RangeContent/RangeContent.vue";
import type { RangeSteppingDocsExampleProps } from "../RangePageVue.types";

type Props = RangeSteppingDocsExampleProps;

defineProps<Props>();

const value = shallowRef(3);
</script>

<template>
    <Range
        id="difficulty"
        v-model:value="value"
        ariaLabel="Difficulty"
        :min="min"
        :max="max"
        :step="step"
        :thumb-size="RANGE_THUMB_SIZE"
    >
        <template #renderContent="renderProps">
            <PageRangeContent :render-props="renderProps" />
        </template>
    </Range>

    <div :class="exampleStyles.exampleReadout" data-readout>{{ `Value: ${value}` }}</div>
</template>
