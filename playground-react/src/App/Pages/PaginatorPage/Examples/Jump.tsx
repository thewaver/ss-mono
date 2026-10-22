import { Label, PaginatorPages, PaginatorRoot, PaginatorSteps, PaginatorUtils } from "@thewaver/ss-components-react";
import {
    computePaginatorPageLabel,
    computePaginatorStepLabel,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { COUNT_FIELD_WIDTH, FIRST_PAGE } from "@thewaver/ss-playground/App/Pages/PaginatorPage/PaginatorPage.const";
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
import type { PaginatorExampleProps } from "../PaginatorPageReact.types";

const PAGINATOR_GAP = 5;

type Props = PaginatorExampleProps;

export const JumpExample = (props: Props) => {
    const pageCount = PaginatorUtils.computePageCount(props.itemCount, props.pageSize);

    return (
        <PagePaginatorDemo>
            <PaginatorRoot
                page={props.page}
                itemCount={props.itemCount}
                pageSize={props.pageSize}
                isDisabled={props.isDisabled}
                ariaLabel={"Results with a page field"}
                onPageChange={props.onPageChange}
            >
                <div className={styles.jumpRow}>
                    <PaginatorSteps
                        gap={PAGINATOR_GAP}
                        computeStepLabel={computePaginatorStepLabel}
                        renderStep={(_step, renderProps) => <PagePaginatorStep renderProps={renderProps} />}
                    >
                        <PaginatorPages
                            siblingCount={props.siblingCount}
                            boundaryCount={props.boundaryCount}
                            gap={PAGINATOR_GAP}
                            computePageLabel={computePaginatorPageLabel}
                            renderPage={(_entry, renderProps) => <PagePaginatorPage renderProps={renderProps} />}
                            renderGap={(entry) => <PagePaginatorGap entry={entry} />}
                        />
                    </PaginatorSteps>

                    <Label>
                        <PageLabelCaption>Go to page</PageLabelCaption>

                        <PageNumberField
                            value={props.page}
                            min={FIRST_PAGE}
                            max={Math.max(pageCount, FIRST_PAGE)}
                            width={COUNT_FIELD_WIDTH}
                            isDisabled={props.isDisabled || pageCount < FIRST_PAGE}
                            onInput={props.onPageChange}
                        />
                    </Label>
                </div>
            </PaginatorRoot>

            <PagePaginatorPanel page={props.page} itemCount={props.itemCount} pageSize={props.pageSize} />
        </PagePaginatorDemo>
    );
};
