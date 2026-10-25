import { useState } from "react";

import { Paginator } from "@thewaver/ss-components-react";
import type { PaginatorStep } from "@thewaver/ss-components-react";
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

import {
    PagePaginatorDemo,
    PagePaginatorGap,
    PagePaginatorPage,
    PagePaginatorPanel,
    PagePaginatorStep,
} from "../../../StyledComponents/PaginatorContent/PaginatorContent";

const END_STEPS: PaginatorStep[] = ["first", "previous", "next", "last"];

export const RightToLeftDocsExample = () => {
    const [page, setPage] = useState(FIRST_PAGE);

    return (
        <PagePaginatorDemo>
            <div dir={"rtl"}>
                <Paginator
                    page={page}
                    itemCount={ITEM_COUNT}
                    pageSize={PAGE_SIZE}
                    gap={PAGINATOR_GAP}
                    steps={END_STEPS}
                    ariaLabel={"Results"}
                    computePageLabel={computePaginatorPageLabel}
                    computeStepLabel={computePaginatorStepLabel}
                    onPageChange={setPage}
                    renderPage={(_entry, renderProps) => <PagePaginatorPage renderProps={renderProps} />}
                    renderGap={(entry) => <PagePaginatorGap entry={entry} />}
                    renderStep={(_step, renderProps) => <PagePaginatorStep renderProps={renderProps} />}
                />
            </div>

            <PagePaginatorPanel page={page} itemCount={ITEM_COUNT} pageSize={PAGE_SIZE} />
        </PagePaginatorDemo>
    );
};
