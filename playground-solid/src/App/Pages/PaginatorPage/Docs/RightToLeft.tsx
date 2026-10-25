import { createSignal } from "solid-js";

import { Paginator } from "@thewaver/ss-components-solid";
import type { PaginatorStep } from "@thewaver/ss-components-solid";
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
    const [getPage, setPage] = createSignal(FIRST_PAGE);

    return (
        <PagePaginatorDemo>
            <div dir={"rtl"}>
                <Paginator
                    page={getPage}
                    itemCount={ITEM_COUNT}
                    pageSize={PAGE_SIZE}
                    gap={PAGINATOR_GAP}
                    steps={END_STEPS}
                    ariaLabel={"Results"}
                    computePageLabel={computePaginatorPageLabel}
                    computeStepLabel={computePaginatorStepLabel}
                    onPageChange={setPage}
                    renderPage={(_getEntry, getRenderProps) => <PagePaginatorPage renderProps={getRenderProps} />}
                    renderGap={(getEntry) => <PagePaginatorGap entry={getEntry} />}
                    renderStep={(_getStep, getRenderProps) => <PagePaginatorStep renderProps={getRenderProps} />}
                />
            </div>

            <PagePaginatorPanel page={getPage} itemCount={ITEM_COUNT} pageSize={PAGE_SIZE} />
        </PagePaginatorDemo>
    );
};
