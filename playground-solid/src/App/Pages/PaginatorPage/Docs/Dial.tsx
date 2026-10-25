import { createSignal } from "solid-js";

import { Paginator } from "@thewaver/ss-components-solid";
import type { PaginatorStep } from "@thewaver/ss-components-solid";
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
    const [getPage, setPage] = createSignal(FIRST_PAGE);

    return (
        <PagePaginatorDemo>
            <div class={styles.halfDial}>
                <div class={styles.halfDialRing}>
                    <Paginator
                        page={getPage}
                        itemCount={ITEM_COUNT}
                        pageSize={PAGE_SIZE}
                        steps={DIAL_STEPS}
                        computeLayout={DIAL_LAYOUT}
                        ariaLabel={"Results round a dial"}
                        computePageLabel={computePaginatorPageLabel}
                        computeStepLabel={computePaginatorStepLabel}
                        onPageChange={setPage}
                        renderPage={(_getEntry, getRenderProps) => (
                            <PagePaginatorDialPage renderProps={getRenderProps} />
                        )}
                        renderGap={(getEntry, getPlacement) => (
                            <PagePaginatorDialGap entry={getEntry} placement={getPlacement} />
                        )}
                        renderStep={(_getStep, getRenderProps) => (
                            <PagePaginatorDialStep renderProps={getRenderProps} />
                        )}
                    />
                </div>

                <div class={styles.halfDialPanel}>
                    <PagePaginatorPanel page={getPage} itemCount={ITEM_COUNT} pageSize={PAGE_SIZE} />
                </div>
            </div>
        </PagePaginatorDemo>
    );
};
