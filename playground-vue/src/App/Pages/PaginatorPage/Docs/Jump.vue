<script setup lang="ts">
import { shallowRef } from "vue";

import { Label, PaginatorPages, PaginatorRoot, PaginatorSteps, PaginatorUtils } from "@thewaver/ss-components-vue";
import {
    computePaginatorPageLabel,
    computePaginatorStepLabel,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import {
    COUNT_FIELD_WIDTH,
    FIRST_PAGE,
    ITEM_COUNT,
    PAGE_SIZE,
    PAGINATOR_GAP,
} from "@thewaver/ss-playground/App/Pages/PaginatorPage/PaginatorPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/PaginatorPage/PaginatorPage.css";

import PageNumberField from "../../../PageComponents/Field/PageNumberField.vue";
import PageLabelCaption from "../../../StyledComponents/LabelCaption/LabelCaption.vue";
import PagePaginatorDemo from "../../../StyledComponents/PaginatorContent/PagePaginatorDemo.vue";
import PagePaginatorGap from "../../../StyledComponents/PaginatorContent/PagePaginatorGap.vue";
import PagePaginatorPage from "../../../StyledComponents/PaginatorContent/PagePaginatorPage.vue";
import PagePaginatorPanel from "../../../StyledComponents/PaginatorContent/PagePaginatorPanel.vue";
import PagePaginatorStep from "../../../StyledComponents/PaginatorContent/PagePaginatorStep.vue";

const PAGE_COUNT = PaginatorUtils.computePageCount(ITEM_COUNT, PAGE_SIZE);

const page = shallowRef(FIRST_PAGE);
</script>

<template>
    <PagePaginatorDemo>
        <PaginatorRoot
            :page="page"
            :item-count="ITEM_COUNT"
            :page-size="PAGE_SIZE"
            ariaLabel="Results with a page field"
            @page-change="(next: number) => (page = next)"
        >
            <div :class="styles.jumpRow">
                <PaginatorSteps :gap="PAGINATOR_GAP" :compute-step-label="computePaginatorStepLabel">
                    <template #renderStep="{ renderProps }">
                        <PagePaginatorStep :render-props="renderProps" />
                    </template>

                    <PaginatorPages :gap="PAGINATOR_GAP" :compute-page-label="computePaginatorPageLabel">
                        <template #renderPage="{ renderProps }">
                            <PagePaginatorPage :render-props="renderProps" />
                        </template>

                        <template #renderGap="{ entry }">
                            <PagePaginatorGap :entry="entry" />
                        </template>
                    </PaginatorPages>
                </PaginatorSteps>

                <Label>
                    <PageLabelCaption>Go to page</PageLabelCaption>

                    <PageNumberField
                        id="goToPage"
                        :value="page"
                        :min="FIRST_PAGE"
                        :max="PAGE_COUNT"
                        :width="COUNT_FIELD_WIDTH"
                        @input="(next: number) => (page = next)"
                    />
                </Label>
            </div>
        </PaginatorRoot>

        <PagePaginatorPanel :page="page" :item-count="ITEM_COUNT" :page-size="PAGE_SIZE" />
    </PagePaginatorDemo>
</template>
