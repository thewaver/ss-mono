<script setup lang="ts">
import { shallowRef } from "vue";

import { PaginatorRoot, PaginatorSteps, PaginatorUtils } from "@thewaver/ss-components-vue";
import type { PaginatorStep } from "@thewaver/ss-components-vue";
import { computePaginatorStepLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import {
    FIRST_PAGE,
    ITEM_COUNT,
    PAGE_SIZE,
    PAGINATOR_GAP,
} from "@thewaver/ss-playground/App/Pages/PaginatorPage/PaginatorPage.const";

import PagePaginatorCount from "../../../StyledComponents/PaginatorContent/PagePaginatorCount.vue";
import PagePaginatorDemo from "../../../StyledComponents/PaginatorContent/PagePaginatorDemo.vue";
import PagePaginatorPanel from "../../../StyledComponents/PaginatorContent/PagePaginatorPanel.vue";
import PagePaginatorStep from "../../../StyledComponents/PaginatorContent/PagePaginatorStep.vue";

const COUNT_STEPS: PaginatorStep[] = ["first", "previous", "next", "last"];

const PAGE_COUNT = PaginatorUtils.computePageCount(ITEM_COUNT, PAGE_SIZE);

const page = shallowRef(FIRST_PAGE);
</script>

<template>
    <PagePaginatorDemo>
        <PaginatorRoot
            :page="page"
            :item-count="ITEM_COUNT"
            :page-size="PAGE_SIZE"
            ariaLabel="Results, counted"
            @page-change="(next: number) => (page = next)"
        >
            <PaginatorSteps :steps="COUNT_STEPS" :gap="PAGINATOR_GAP" :compute-step-label="computePaginatorStepLabel">
                <template #renderStep="{ renderProps }">
                    <PagePaginatorStep :render-props="renderProps" />
                </template>

                <PagePaginatorCount :page="page" :page-count="PAGE_COUNT" />
            </PaginatorSteps>
        </PaginatorRoot>

        <PagePaginatorPanel :page="page" :item-count="ITEM_COUNT" :page-size="PAGE_SIZE" />
    </PagePaginatorDemo>
</template>
