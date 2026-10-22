<script setup lang="ts">
import { computed } from "vue";

import { PaginatorRoot, PaginatorSteps, PaginatorUtils } from "@thewaver/ss-components-vue";
import type { PaginatorStep } from "@thewaver/ss-components-vue";
import { computePaginatorStepLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

import PagePaginatorCount from "../../../StyledComponents/PaginatorContent/PagePaginatorCount.vue";
import PagePaginatorDemo from "../../../StyledComponents/PaginatorContent/PagePaginatorDemo.vue";
import PagePaginatorPanel from "../../../StyledComponents/PaginatorContent/PagePaginatorPanel.vue";
import PagePaginatorStep from "../../../StyledComponents/PaginatorContent/PagePaginatorStep.vue";
import type { PaginatorExampleProps } from "../PaginatorPageVue.types";

const PAGINATOR_GAP = 5;

const COUNT_STEPS: PaginatorStep[] = ["first", "previous", "next", "last"];

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
            ariaLabel="Results, counted"
            @page-change="props.onPageChange"
        >
            <PaginatorSteps :steps="COUNT_STEPS" :gap="PAGINATOR_GAP" :compute-step-label="computePaginatorStepLabel">
                <template #renderStep="{ renderProps }">
                    <PagePaginatorStep :render-props="renderProps" />
                </template>

                <PagePaginatorCount :page="page" :page-count="pageCount" />
            </PaginatorSteps>
        </PaginatorRoot>

        <PagePaginatorPanel :page="page" :item-count="itemCount" :page-size="pageSize" />
    </PagePaginatorDemo>
</template>
