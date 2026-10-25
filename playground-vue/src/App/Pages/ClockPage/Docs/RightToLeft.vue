<script setup lang="ts">
import { shallowRef } from "vue";

import { Clock } from "@thewaver/ss-components-vue";
import { LOCALE } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
import type { TimeValue } from "@thewaver/ss-utils";

import PageClockColumn from "../../../StyledComponents/ClockContent/PageClockColumn.vue";
import PageClockFrame from "../../../StyledComponents/ClockContent/PageClockFrame.vue";
import PageClockOption from "../../../StyledComponents/ClockContent/PageClockOption.vue";
import PageClockUnit from "../../../StyledComponents/ClockContent/PageClockUnit.vue";

const value = shallowRef<TimeValue | undefined>({ hour: 9, minute: 30 });
</script>

<template>
    <div dir="rtl">
        <PageClockFrame>
            <Clock v-model:value="value" :locale="LOCALE" ariaLabel="Time in a right-to-left box">
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
    </div>
</template>
