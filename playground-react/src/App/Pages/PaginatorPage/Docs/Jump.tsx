import { useState } from "react";

import { Label, PaginatorPages, PaginatorRoot, PaginatorSteps, PaginatorUtils } from "@thewaver/ss-components-react";
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
    const [page, setPage] = useState(FIRST_PAGE);

    return (
        <PagePaginatorDemo>
            <PaginatorRoot
                page={page}
                itemCount={ITEM_COUNT}
                pageSize={PAGE_SIZE}
                ariaLabel={"Results with a page field"}
                onPageChange={setPage}
            >
                <div className={styles.jumpRow}>
                    <PaginatorSteps
                        gap={PAGINATOR_GAP}
                        computeStepLabel={computePaginatorStepLabel}
                        renderStep={(_step, renderProps) => <PagePaginatorStep renderProps={renderProps} />}
                    >
                        <PaginatorPages
                            gap={PAGINATOR_GAP}
                            computePageLabel={computePaginatorPageLabel}
                            renderPage={(_entry, renderProps) => <PagePaginatorPage renderProps={renderProps} />}
                            renderGap={(entry) => <PagePaginatorGap entry={entry} />}
                        />
                    </PaginatorSteps>

                    <Label>
                        <PageLabelCaption>Go to page</PageLabelCaption>

                        <PageNumberField
                            id={"goToPage"}
                            value={page}
                            min={FIRST_PAGE}
                            max={PAGE_COUNT}
                            width={COUNT_FIELD_WIDTH}
                            onInput={setPage}
                        />
                    </Label>
                </div>
            </PaginatorRoot>

            <PagePaginatorPanel page={page} itemCount={ITEM_COUNT} pageSize={PAGE_SIZE} />
        </PagePaginatorDemo>
    );
};
