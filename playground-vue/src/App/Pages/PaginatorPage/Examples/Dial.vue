<script setup lang="ts">
import { Paginator, PlacementLayoutUtils } from "@thewaver/ss-components-vue";
import type { BandDefs, PaginatorStep } from "@thewaver/ss-components-vue";
import {
    computePaginatorPageLabel,
    computePaginatorStepLabel,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import * as styles from "@thewaver/ss-playground/App/Pages/PaginatorPage/PaginatorPage.css";

import PagePaginatorDemo from "../../../StyledComponents/PaginatorContent/PagePaginatorDemo.vue";
import PagePaginatorDialGap from "../../../StyledComponents/PaginatorContent/PagePaginatorDialGap.vue";
import PagePaginatorDialPage from "../../../StyledComponents/PaginatorContent/PagePaginatorDialPage.vue";
import PagePaginatorDialStep from "../../../StyledComponents/PaginatorContent/PagePaginatorDialStep.vue";
import PagePaginatorPanel from "../../../StyledComponents/PaginatorContent/PagePaginatorPanel.vue";
import type { PaginatorExampleProps } from "../PaginatorPage.types";

const DIAL_STEPS: PaginatorStep[] = ["first", "previous", "next", "last"];

const DIAL_DEFS: BandDefs = { spreadDegrees: 180, facingDegrees: 0, holeRatio: 0.5, wedgeGapDegrees: 2 };

const DIAL_LAYOUT = PlacementLayoutUtils.createRing(DIAL_DEFS);

type Props = PaginatorExampleProps;

const props = defineProps<Props>();
</script>

<template>
    <PagePaginatorDemo>
        <div :class="styles.halfDial">
            <div :class="styles.halfDialRing">
                <Paginator
                    :page="page"
                    :page-count="pageCount"
                    :sibling-count="siblingCount"
                    :boundary-count="boundaryCount"
                    :is-disabled="isDisabled"
                    ariaLabel="Results round a dial"
                    :compute-page-label="computePaginatorPageLabel"
                    :compute-step-label="computePaginatorStepLabel"
                    :steps="DIAL_STEPS"
                    :compute-layout="DIAL_LAYOUT"
                    @page-change="props.onPageChange"
                >
                    <template #renderPage="{ renderProps }">
                        <PagePaginatorDialPage :render-props="renderProps" />
                    </template>

                    <template #renderGap="{ entry, placement }">
                        <PagePaginatorDialGap :entry="entry" :placement="placement" />
                    </template>

                    <template #renderStep="{ renderProps }">
                        <PagePaginatorDialStep :render-props="renderProps" />
                    </template>
                </Paginator>
            </div>

            <div :class="styles.halfDialPanel">
                <PagePaginatorPanel :page="page" :page-count="pageCount" />
            </div>
        </div>
    </PagePaginatorDemo>
</template>
