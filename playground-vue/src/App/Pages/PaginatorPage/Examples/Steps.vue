<script setup lang="ts">
import { Paginator } from "@thewaver/ss-components-vue";
import {
    computePaginatorPageLabel,
    computePaginatorStepLabel,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

import PagePaginatorDemo from "../../../StyledComponents/PaginatorContent/PagePaginatorDemo.vue";
import PagePaginatorGap from "../../../StyledComponents/PaginatorContent/PagePaginatorGap.vue";
import PagePaginatorPage from "../../../StyledComponents/PaginatorContent/PagePaginatorPage.vue";
import PagePaginatorPanel from "../../../StyledComponents/PaginatorContent/PagePaginatorPanel.vue";
import PagePaginatorStep from "../../../StyledComponents/PaginatorContent/PagePaginatorStep.vue";
import type { PaginatorExampleProps } from "../PaginatorPage.types";

const PAGINATOR_GAP = 5;

type Props = PaginatorExampleProps;

const props = defineProps<Props>();
</script>

<template>
    <PagePaginatorDemo>
        <Paginator
            :page="page"
            :page-count="pageCount"
            :sibling-count="siblingCount"
            :boundary-count="boundaryCount"
            :is-disabled="isDisabled"
            :gap="PAGINATOR_GAP"
            ariaLabel="Results"
            :compute-page-label="computePaginatorPageLabel"
            :compute-step-label="computePaginatorStepLabel"
            @page-change="props.onPageChange"
        >
            <template #renderPage="{ renderProps }">
                <PagePaginatorPage :render-props="renderProps" />
            </template>

            <template #renderGap="{ entry }">
                <PagePaginatorGap :entry="entry" />
            </template>

            <template #renderStep="{ renderProps }">
                <PagePaginatorStep :render-props="renderProps" />
            </template>
        </Paginator>

        <PagePaginatorPanel :page="page" :page-count="pageCount" />
    </PagePaginatorDemo>
</template>
