<script setup lang="ts">
import { useModel } from "vue";

import { Range } from "@thewaver/ss-components-vue";
import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";

import PageRangeContent from "../../../StyledComponents/RangeContent/RangeContent.vue";
import type { RangeExampleProps } from "../RangePage.types";

type Props = RangeExampleProps;

const props = defineProps<Props>();

const value = useModel(props, "value");
</script>

<template>
    <Range v-model:value="value" ariaLabel="Volume" :thumb-size="RANGE_THUMB_SIZE">
        <template #renderContent="renderProps">
            <PageRangeContent :render-props="renderProps" />
        </template>
    </Range>
</template>
