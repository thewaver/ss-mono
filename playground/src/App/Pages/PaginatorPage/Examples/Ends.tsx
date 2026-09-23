import { Paginator } from "@thewaver/ss-components";
import type { PaginatorStep } from "@thewaver/ss-components";

import {
    computePaginatorPageLabel,
    computePaginatorStepLabel,
} from "../../../PageComponents/Announcements/Announcements.const";
import {
    PagePaginatorDemo,
    PagePaginatorGap,
    PagePaginatorPage,
    PagePaginatorPanel,
    PagePaginatorStep,
} from "../../../StyledComponents/PaginatorContent/PaginatorContent";
import type { PaginatorExampleProps } from "../PaginatorPage.types";

const PAGINATOR_GAP = 5;

const END_STEPS: PaginatorStep[] = ["first", "previous", "next", "last"];

type Props = PaginatorExampleProps;

export const EndsExample = (props: Props) => {
    return (
        <PagePaginatorDemo>
            <Paginator
                page={props.page}
                pageCount={props.pageCount}
                siblingCount={props.siblingCount}
                boundaryCount={props.boundaryCount}
                isDisabled={props.isDisabled}
                gap={() => PAGINATOR_GAP}
                ariaLabel={"Results with end jumps"}
                computePageLabel={computePaginatorPageLabel}
                computeStepLabel={computePaginatorStepLabel}
                steps={() => END_STEPS}
                onPageChange={props.onPageChange}
                renderPage={(_getEntry, getRenderProps) => <PagePaginatorPage renderProps={getRenderProps} />}
                renderGap={(getEntry) => <PagePaginatorGap entry={getEntry} />}
                renderStep={(_getStep, getRenderProps) => <PagePaginatorStep renderProps={getRenderProps} />}
            />

            <PagePaginatorPanel page={props.page} pageCount={props.pageCount} />
        </PagePaginatorDemo>
    );
};
