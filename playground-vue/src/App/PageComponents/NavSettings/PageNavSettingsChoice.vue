<script setup lang="ts" generic="T">
import { useModel } from "vue";

import { Radio, RadioGroup } from "@thewaver/ss-components-vue";

import PageRadioSegmentContent from "../../StyledComponents/RadioSegmentContent/PageRadioSegmentContent.vue";
import PageRadioSegmentFloater from "../../StyledComponents/RadioSegmentContent/PageRadioSegmentFloater.vue";
import PageRadioSegmentGroup from "../../StyledComponents/RadioSegmentContent/PageRadioSegmentGroup.vue";
import type { PageNavSettingsChoiceProps } from "./NavSettings.types";

const props = defineProps<PageNavSettingsChoiceProps<T>>();

const value = useModel(props, "value");
</script>

<template>
    <PageRadioSegmentGroup>
        <RadioGroup v-model:value="value" :ariaLabel="ariaLabel" orientation="horizontal" :gap="0">
            <template #renderSelectionFloater="{ visibilityTarget, transitionDurationMs }">
                <PageRadioSegmentFloater
                    :visibility-target="visibilityTarget"
                    :transition-duration-ms="transitionDurationMs"
                />
            </template>

            <Radio v-for="option in options" :key="option.label" :value="option.value" :ariaLabel="option.label">
                <template #renderContent="flags">
                    <PageRadioSegmentContent :flags="flags">{{ option.label }}</PageRadioSegmentContent>
                </template>
            </Radio>
        </RadioGroup>
    </PageRadioSegmentGroup>
</template>
