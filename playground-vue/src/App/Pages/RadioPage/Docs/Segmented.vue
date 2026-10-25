<script setup lang="ts">
import { shallowRef } from "vue";

import { Radio, RadioGroup } from "@thewaver/ss-components-vue";
import { SIZE_OPTIONS } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.const";
import type { SizeValue } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.types";

import PageRadioSegmentContent from "../../../StyledComponents/RadioSegmentContent/PageRadioSegmentContent.vue";
import PageRadioSegmentFloater from "../../../StyledComponents/RadioSegmentContent/PageRadioSegmentFloater.vue";
import PageRadioSegmentGroup from "../../../StyledComponents/RadioSegmentContent/PageRadioSegmentGroup.vue";

const value = shallowRef<SizeValue>("medium");
</script>

<template>
    <PageRadioSegmentGroup>
        <RadioGroup v-model:value="value" ariaLabel="Size" orientation="horizontal" :gap="0">
            <template #renderSelectionFloater="{ visibilityTarget, transitionDurationMs }">
                <PageRadioSegmentFloater
                    :visibility-target="visibilityTarget"
                    :transition-duration-ms="transitionDurationMs"
                />
            </template>

            <Radio v-for="option in SIZE_OPTIONS" :key="option.value" :value="option.value" :ariaLabel="option.label">
                <template #renderContent="flags">
                    <PageRadioSegmentContent :flags="flags">{{ option.label }}</PageRadioSegmentContent>
                </template>
            </Radio>
        </RadioGroup>
    </PageRadioSegmentGroup>
</template>
