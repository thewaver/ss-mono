import { useState } from "react";

import { Paginator } from "@thewaver/ss-components-react";
import type { PaginatorStep } from "@thewaver/ss-components-react";
import {
    computePaginatorPageLabel,
    computePaginatorStepLabel,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import {
    DIAL_LAYOUT,
    FIRST_PAGE,
    ITEM_COUNT,
    PAGE_SIZE,
} from "@thewaver/ss-playground/App/Pages/PaginatorPage/PaginatorPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/PaginatorPage/PaginatorPage.css";

import {
    PagePaginatorDemo,
    PagePaginatorDialGap,
    PagePaginatorDialPage,
    PagePaginatorDialStep,
    PagePaginatorPanel,
} from "../../../StyledComponents/PaginatorContent/PaginatorContent";

const DIAL_STEPS: PaginatorStep[] = ["first", "previous", "next", "last"];

export const DialDocsExample = () => {
    const [page, setPage] = useState(FIRST_PAGE);

    return (
        <PagePaginatorDemo>
            <div className={styles.halfDial}>
                <div className={styles.halfDialRing}>
                    <Paginator
                        page={page}
                        itemCount={ITEM_COUNT}
                        pageSize={PAGE_SIZE}
                        steps={DIAL_STEPS}
                        computeLayout={DIAL_LAYOUT}
                        ariaLabel={"Results round a dial"}
                        computePageLabel={computePaginatorPageLabel}
                        computeStepLabel={computePaginatorStepLabel}
                        onPageChange={setPage}
                        renderPage={(_entry, renderProps) => <PagePaginatorDialPage renderProps={renderProps} />}
                        renderGap={(entry, placement) => <PagePaginatorDialGap entry={entry} placement={placement} />}
                        renderStep={(_step, renderProps) => <PagePaginatorDialStep renderProps={renderProps} />}
                    />
                </div>

                <div className={styles.halfDialPanel}>
                    <PagePaginatorPanel page={page} itemCount={ITEM_COUNT} pageSize={PAGE_SIZE} />
                </div>
            </div>
        </PagePaginatorDemo>
    );
};
