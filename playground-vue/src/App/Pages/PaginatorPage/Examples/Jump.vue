<script setup lang="ts">
import { computed } from "vue";

import { Label, PaginatorPages, PaginatorRoot, PaginatorSteps, PaginatorUtils } from "@thewaver/ss-components-vue";
import {
    computePaginatorPageLabel,
    computePaginatorStepLabel,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { COUNT_FIELD_WIDTH, FIRST_PAGE } from "@thewaver/ss-playground/App/Pages/PaginatorPage/PaginatorPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/PaginatorPage/PaginatorPage.css";

import PageNumberField from "../../../PageComponents/Field/PageNumberField.vue";
import PageLabelCaption from "../../../StyledComponents/LabelCaption/LabelCaption.vue";
import PagePaginatorDemo from "../../../StyledComponents/PaginatorContent/PagePaginatorDemo.vue";
import PagePaginatorGap from "../../../StyledComponents/PaginatorContent/PagePaginatorGap.vue";
import PagePaginatorPage from "../../../StyledComponents/PaginatorContent/PagePaginatorPage.vue";
import PagePaginatorPanel from "../../../StyledComponents/PaginatorContent/PagePaginatorPanel.vue";
import PagePaginatorStep from "../../../StyledComponents/PaginatorContent/PagePaginatorStep.vue";
import type { PaginatorExampleProps } from "../PaginatorPageVue.types";

const PAGINATOR_GAP = 5;

type Props = PaginatorExampleProps;

const props = defineProps<Props>();

const pageCount = computed(() => PaginatorUtils.computePageCount(props.itemCount, props.pageSize));
</script>

<template>
    <PagePaginatorDemo>
        <PaginatorRoot
            :page="page"
            :item-count="itemCount"
            :page-size="pageSize"
            :is-disabled="isDisabled"
            ariaLabel="Results with a page field"
            @page-change="props.onPageChange"
        >
            <div :class="styles.jumpRow">
                <PaginatorSteps :gap="PAGINATOR_GAP" :compute-step-label="computePaginatorStepLabel">
                    <template #renderStep="{ renderProps }">
                        <PagePaginatorStep :render-props="renderProps" />
                    </template>

                    <PaginatorPages
                        :sibling-count="siblingCount"
                        :boundary-count="boundaryCount"
                        :gap="PAGINATOR_GAP"
                        :compute-page-label="computePaginatorPageLabel"
                    >
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
                        :value="page"
                        :min="FIRST_PAGE"
                        :max="Math.max(pageCount, FIRST_PAGE)"
                        :width="COUNT_FIELD_WIDTH"
                        :is-disabled="isDisabled || pageCount < FIRST_PAGE"
                        @input="props.onPageChange"
                    />
                </Label>
            </div>
        </PaginatorRoot>

        <PagePaginatorPanel :page="page" :item-count="itemCount" :page-size="pageSize" />
    </PagePaginatorDemo>
</template>
