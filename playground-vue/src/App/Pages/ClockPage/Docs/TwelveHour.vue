<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { Clock } from "@thewaver/ss-components-vue";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import { LOCALE } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
import { TimeUtils } from "@thewaver/ss-utils";
import type { TimeValue } from "@thewaver/ss-utils";

import PageClockColumn from "../../../StyledComponents/ClockContent/PageClockColumn.vue";
import PageClockFrame from "../../../StyledComponents/ClockContent/PageClockFrame.vue";
import PageClockOption from "../../../StyledComponents/ClockContent/PageClockOption.vue";
import PageClockUnit from "../../../StyledComponents/ClockContent/PageClockUnit.vue";
import type { ClockTwelveHourDocsExampleProps } from "../ClockPageVue.types";

type Props = ClockTwelveHourDocsExampleProps;

defineProps<Props>();

const value = shallowRef<TimeValue | undefined>({ hour: 14, minute: 30 });

const valueText = computed(() => (value.value ? TimeUtils.toIso(value.value) : "nothing"));
</script>

<template>
    <PageClockFrame>
        <Clock v-model:value="value" :locale="LOCALE" :is-twelve-hour="isTwelveHour" ariaLabel="Call time">
            <template #renderOption="{ flags }">
                <PageClockOption :render-props="flags" />
            </template>

            <template #renderUnit="{ name }">
                <PageClockUnit>{{ name }}</PageClockUnit>
            </template>

            <template #renderColumn="{ renderOptions }">
                <PageClockColumn><component :is="renderOptions" /></PageClockColumn>
            </template>
        </Clock>
    </PageClockFrame>

    <div :class="exampleStyles.exampleReadout" data-readout>{{ `Value: ${valueText}` }}</div>
</template>
