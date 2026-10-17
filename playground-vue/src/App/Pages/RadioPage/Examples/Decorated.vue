<script setup lang="ts">
import { useModel } from "vue";

import { CornerHighlight, Radio, RadioGroup } from "@thewaver/ss-components-vue";
import { RADIO_GROUP_GAP, SIZE_OPTIONS } from "@thewaver/ss-playground/App/Pages/RadioPage/RadioPage.const";

import PageRadioContent from "../../../StyledComponents/RadioContent/RadioContent.vue";
import type { RadioExampleProps } from "../RadioPageVue.types";

const CORNER_LENGTH = { width: 8, height: 8 };
const STROKE_THICKNESS = 2;

type Props = RadioExampleProps;

const props = defineProps<Props>();

const value = useModel(props, "value");
</script>

<template>
    <RadioGroup v-model:value="value" ariaLabel="Decorated size" :gap="RADIO_GROUP_GAP">
        <Radio v-for="option in SIZE_OPTIONS" :key="option.value" :value="option.value" :ariaLabel="option.label">
            <template #renderContent="flags">
                <PageRadioContent :flags="flags">{{ option.label }}</PageRadioContent>
            </template>

            <template #renderDecoration="flags">
                <CornerHighlight
                    :color="flags.checkedState === true ? 'yellow' : 'transparent'"
                    :corner-length="CORNER_LENGTH"
                    :stroke-thickness="STROKE_THICKNESS"
                />
            </template>
        </Radio>
    </RadioGroup>
</template>
