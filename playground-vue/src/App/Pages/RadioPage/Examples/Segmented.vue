<script setup lang="ts">
import { useModel } from "vue";

import { Radio, RadioGroup } from "@thewaver/ss-components-vue";

import PageRadioSegmentContent from "../../../StyledComponents/RadioSegmentContent/PageRadioSegmentContent.vue";
import PageRadioSegmentFloater from "../../../StyledComponents/RadioSegmentContent/PageRadioSegmentFloater.vue";
import PageRadioSegmentGroup from "../../../StyledComponents/RadioSegmentContent/PageRadioSegmentGroup.vue";
import { SIZE_OPTIONS } from "../RadioPage.const";
import type { RadioExampleProps } from "../RadioPage.types";

type Props = RadioExampleProps;

const props = defineProps<Props>();

const value = useModel(props, "value");
</script>

<template>
    <PageRadioSegmentGroup>
        <RadioGroup v-model:value="value" ariaLabel="Segmented size" orientation="horizontal" :gap="0">
            <template #renderFloater="{ visibilityTarget, transitionDurationMs }">
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
