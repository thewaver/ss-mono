import { useState } from "react";

import { PaginatorRoot, PaginatorSteps, PaginatorUtils } from "@thewaver/ss-components-react";
import type { PaginatorStep } from "@thewaver/ss-components-react";
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
    const [page, setPage] = useState(FIRST_PAGE);

    return (
        <PagePaginatorDemo>
            <PaginatorRoot
                page={page}
                itemCount={ITEM_COUNT}
                pageSize={PAGE_SIZE}
                ariaLabel={"Results, counted"}
                onPageChange={setPage}
            >
                <PaginatorSteps
                    steps={COUNT_STEPS}
                    gap={PAGINATOR_GAP}
                    computeStepLabel={computePaginatorStepLabel}
                    renderStep={(_step, renderProps) => <PagePaginatorStep renderProps={renderProps} />}
                >
                    <PagePaginatorCount page={page} pageCount={PAGE_COUNT} />
                </PaginatorSteps>
            </PaginatorRoot>

            <PagePaginatorPanel page={page} itemCount={ITEM_COUNT} pageSize={PAGE_SIZE} />
        </PagePaginatorDemo>
    );
};
