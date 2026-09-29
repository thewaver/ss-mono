<script setup lang="ts">
import { useModel } from "vue";

import { Range } from "@thewaver/ss-components-vue";
import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";

import PageRangeContent from "../../../StyledComponents/RangeContent/RangeContent.vue";
import type { RangeExampleProps } from "../RangePage.types";

const MIN = 1;
const MAX = 5;
const STEP = 1;

type Props = RangeExampleProps;

const props = defineProps<Props>();

const value = useModel(props, "value");
</script>

<template>
    <Range
        v-model:value="value"
        ariaLabel="Difficulty"
        :min="MIN"
        :max="MAX"
        :step="STEP"
        :thumb-size="RANGE_THUMB_SIZE"
    >
        <template #renderContent="renderProps">
            <PageRangeContent :render-props="renderProps" />
        </template>
    </Range>
</template>
