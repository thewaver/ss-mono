<script setup lang="ts">
import { useModel } from "vue";

import { Button, CalendarUtils, DateValueUtils } from "@thewaver/ss-components-vue";

import PageButtonContent from "../../StyledComponents/ButtonContent/ButtonContent.vue";
import PageCalendarHeader from "../../StyledComponents/CalendarContent/PageCalendarHeader.vue";
import PageCalendarTitle from "../../StyledComponents/CalendarContent/PageCalendarTitle.vue";
import type { PageCalendarPagedCaptionProps } from "./CalendarPagedCaption.types";

const PAGE_STEP = 1;
const WEEK_STARTS_ON = 1;
const YEAR_OPTIONS: Intl.DateTimeFormatOptions = { year: "numeric" };
const MONTH_TITLE_OPTIONS: Intl.DateTimeFormatOptions = { month: "long", year: "numeric" };

const props = defineProps<PageCalendarPagedCaptionProps>();

const month = useModel(props, "month");

const getTitle = () => {
    if (props.precision === "day") return DateValueUtils.format(month.value, MONTH_TITLE_OPTIONS, props.locale);
    if (props.precision === "month") return DateValueUtils.format(month.value, YEAR_OPTIONS, props.locale);

    const cells = CalendarUtils.getCells(month.value, props.precision, WEEK_STARTS_ON);

    return CalendarUtils.formatSpan(cells[0], cells[cells.length - 1], YEAR_OPTIONS, props.locale);
};

const page = (direction: 1 | -1) => {
    month.value = CalendarUtils.stepPage(month.value, props.precision, direction * PAGE_STEP);
};
</script>

<template>
    <PageCalendarHeader>
        <Button :id="`${itemKey}PreviousPage`" :ariaLabel="previousLabel" @click="page(-1)">
            <template #renderContent="flags">
                <PageButtonContent :flags="flags">◀</PageButtonContent>
            </template>
        </Button>

        <PageCalendarTitle :flags="{}">{{ getTitle() }}</PageCalendarTitle>

        <Button :id="`${itemKey}NextPage`" :ariaLabel="nextLabel" @click="page(1)">
            <template #renderContent="flags">
                <PageButtonContent :flags="flags">▶</PageButtonContent>
            </template>
        </Button>
    </PageCalendarHeader>
</template>
