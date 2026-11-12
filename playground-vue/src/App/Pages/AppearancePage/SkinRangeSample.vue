<script setup lang="ts">
import { shallowRef } from "vue";

import { Range } from "@thewaver/ss-components-vue";
import { SKIN_SAMPLE_RANGE } from "@thewaver/ss-playground/App/Pages/AppearancePage/AppearancePage.const";
import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";

import PageRangeContent from "../../StyledComponents/RangeContent/RangeContent.vue";
import type { SkinStateProps } from "./AppearancePage.types";
import SkinBarCell from "./SkinBarCell.vue";

withDefaults(defineProps<SkinStateProps>(), { isDisabled: undefined, hasError: undefined });

const value = shallowRef(SKIN_SAMPLE_RANGE);
</script>

<template>
    <SkinBarCell :state="state">
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
    </SkinBarCell>
</template>
