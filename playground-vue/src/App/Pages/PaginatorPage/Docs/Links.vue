<script setup lang="ts">
import { shallowRef } from "vue";

import { Paginator } from "@thewaver/ss-components-vue";
import {
    computePaginatorPageLabel,
    computePaginatorStepLabel,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import {
    FIRST_PAGE,
    ITEM_COUNT,
    PAGE_SIZE,
    PAGINATOR_GAP,
} from "@thewaver/ss-playground/App/Pages/PaginatorPage/PaginatorPage.const";

import PagePaginatorDemo from "../../../StyledComponents/PaginatorContent/PagePaginatorDemo.vue";
import PagePaginatorGap from "../../../StyledComponents/PaginatorContent/PagePaginatorGap.vue";
import PagePaginatorPage from "../../../StyledComponents/PaginatorContent/PagePaginatorPage.vue";
import PagePaginatorPanel from "../../../StyledComponents/PaginatorContent/PagePaginatorPanel.vue";
import PagePaginatorStep from "../../../StyledComponents/PaginatorContent/PagePaginatorStep.vue";
import type { PaginatorLinksDocsExampleProps } from "../PaginatorPageVue.types";
import CustomPaginatorLink from "./CustomPaginatorLink.vue";

type Props = PaginatorLinksDocsExampleProps;

defineProps<Props>();

const page = shallowRef(FIRST_PAGE);
</script>

<template>
    <PagePaginatorDemo>
        <Paginator
            :page="page"
            :item-count="ITEM_COUNT"
            :page-size="PAGE_SIZE"
            :gap="PAGINATOR_GAP"
            ariaLabel="Linked results"
            :compute-page-label="computePaginatorPageLabel"
            :compute-step-label="computePaginatorStepLabel"
            :compute-href="(target: number) => `#paginator-page-${target}`"
            :link-component="hasLinkComponent ? CustomPaginatorLink : undefined"
            @page-change="(next: number) => (page = next)"
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

        <PagePaginatorPanel :page="page" :item-count="ITEM_COUNT" :page-size="PAGE_SIZE" />
    </PagePaginatorDemo>
</template>
