import {
    Label,
    PaginatorPages,
    PaginatorRoot,
    PaginatorSteps,
    PaginatorUtils,
    access,
} from "@thewaver/ss-components-solid";
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
import type { PaginatorExampleProps } from "../PaginatorPageSolid.types";

const PAGINATOR_GAP = 5;

type Props = PaginatorExampleProps;

export const JumpExample = (props: Props) => {
    const getPageCount = () => PaginatorUtils.computePageCount(access(props.itemCount), access(props.pageSize));

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
                <div class={styles.jumpRow}>
                    <PaginatorSteps
                        gap={PAGINATOR_GAP}
                        computeStepLabel={computePaginatorStepLabel}
                        renderStep={(_getStep, getRenderProps) => <PagePaginatorStep renderProps={getRenderProps} />}
                    >
                        <PaginatorPages
                            siblingCount={props.siblingCount}
                            boundaryCount={props.boundaryCount}
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
                            value={props.page}
                            min={FIRST_PAGE}
                            max={() => Math.max(getPageCount(), FIRST_PAGE)}
                            width={COUNT_FIELD_WIDTH}
                            isDisabled={() => access(props.isDisabled) || getPageCount() < FIRST_PAGE}
                            onInput={props.onPageChange}
                        />
                    </Label>
                </div>
            </PaginatorRoot>

            <PagePaginatorPanel page={props.page} itemCount={props.itemCount} pageSize={props.pageSize} />
        </PagePaginatorDemo>
    );
};
