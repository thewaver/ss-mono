import { createSignal } from "solid-js";

import { PaginatorRoot, PaginatorSteps, PaginatorUtils } from "@thewaver/ss-components-solid";
import type { PaginatorStep } from "@thewaver/ss-components-solid";
import { computePaginatorStepLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import {
    FIRST_PAGE,
    ITEM_COUNT,
    PAGE_SIZE,
    PAGINATOR_GAP,
} from "@thewaver/ss-playground/App/Pages/PaginatorPage/PaginatorPage.const";

import {
    PagePaginatorCount,
    PagePaginatorDemo,
    PagePaginatorPanel,
    PagePaginatorStep,
} from "../../../StyledComponents/PaginatorContent/PaginatorContent";

const COUNT_STEPS: PaginatorStep[] = ["first", "previous", "next", "last"];

const PAGE_COUNT = PaginatorUtils.computePageCount(ITEM_COUNT, PAGE_SIZE);

export const CountDocsExample = () => {
    const [getPage, setPage] = createSignal(FIRST_PAGE);

    return (
        <PagePaginatorDemo>
            <PaginatorRoot
                page={getPage}
                itemCount={ITEM_COUNT}
                pageSize={PAGE_SIZE}
                ariaLabel={"Results, counted"}
                onPageChange={setPage}
            >
                <PaginatorSteps
                    steps={COUNT_STEPS}
                    gap={PAGINATOR_GAP}
                    computeStepLabel={computePaginatorStepLabel}
                    renderStep={(_getStep, getRenderProps) => <PagePaginatorStep renderProps={getRenderProps} />}
                >
                    <PagePaginatorCount page={getPage} pageCount={PAGE_COUNT} />
                </PaginatorSteps>
            </PaginatorRoot>

            <PagePaginatorPanel page={getPage} itemCount={ITEM_COUNT} pageSize={PAGE_SIZE} />
        </PagePaginatorDemo>
    );
};
