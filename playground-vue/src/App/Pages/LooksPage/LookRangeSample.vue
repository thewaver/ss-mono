<script setup lang="ts">
import { shallowRef } from "vue";

import { Range } from "@thewaver/ss-components-vue";
import { LOOK_SAMPLE_RANGE } from "@thewaver/ss-playground/App/Pages/LooksPage/LooksPage.const";
import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";

import PageRangeContent from "../../StyledComponents/RangeContent/RangeContent.vue";
import LookBarCell from "./LookBarCell.vue";
import type { LookStateProps } from "./LooksPage.types";

withDefaults(defineProps<LookStateProps>(), { isDisabled: undefined, hasError: undefined });

const value = shallowRef(LOOK_SAMPLE_RANGE);
</script>

<template>
    <LookBarCell :state="state">
        <Range
            v-model:value="value"
            :ariaLabel="state"
            :is-disabled="isDisabled"
            :has-error="hasError"
            :thumb-size="RANGE_THUMB_SIZE"
        >
            <template #renderContent="renderProps">
                <PageRangeContent :render-props="renderProps" />
            </template>
        </Range>
    </LookBarCell>
</template>
