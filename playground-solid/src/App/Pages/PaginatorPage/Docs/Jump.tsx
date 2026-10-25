import { createSignal } from "solid-js";

import { Label, PaginatorPages, PaginatorRoot, PaginatorSteps, PaginatorUtils } from "@thewaver/ss-components-solid";
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

import { PageNumberField } from "../../../PageComponents/Field/Field";
import { PageLabelCaption } from "../../../StyledComponents/LabelCaption/LabelCaption";
import {
    PagePaginatorDemo,
    PagePaginatorGap,
    PagePaginatorPage,
    PagePaginatorPanel,
    PagePaginatorStep,
} from "../../../StyledComponents/PaginatorContent/PaginatorContent";

const PAGE_COUNT = PaginatorUtils.computePageCount(ITEM_COUNT, PAGE_SIZE);

export const JumpDocsExample = () => {
    const [getPage, setPage] = createSignal(FIRST_PAGE);

    return (
        <PagePaginatorDemo>
            <PaginatorRoot
                page={getPage}
                itemCount={ITEM_COUNT}
                pageSize={PAGE_SIZE}
                ariaLabel={"Results with a page field"}
                onPageChange={setPage}
            >
                <div class={styles.jumpRow}>
                    <PaginatorSteps
                        gap={PAGINATOR_GAP}
                        computeStepLabel={computePaginatorStepLabel}
                        renderStep={(_getStep, getRenderProps) => <PagePaginatorStep renderProps={getRenderProps} />}
                    >
                        <PaginatorPages
                            gap={PAGINATOR_GAP}
                            computePageLabel={computePaginatorPageLabel}
                            renderPage={(_getEntry, getRenderProps) => (
                                <PagePaginatorPage renderProps={getRenderProps} />
                            )}
                            renderGap={(getEntry) => <PagePaginatorGap entry={getEntry} />}
                        />
                    </PaginatorSteps>

                    <Label>
                        <PageLabelCaption>Go to page</PageLabelCaption>

                        <PageNumberField
                            id={"goToPage"}
                            value={getPage}
                            min={FIRST_PAGE}
                            max={PAGE_COUNT}
                            width={COUNT_FIELD_WIDTH}
                            onInput={setPage}
                        />
                    </Label>
                </div>
            </PaginatorRoot>

            <PagePaginatorPanel page={getPage} itemCount={ITEM_COUNT} pageSize={PAGE_SIZE} />
        </PagePaginatorDemo>
    );
};
