import { Paginator } from "@thewaver/ss-components-solid";
import {
    computePaginatorPageLabel,
    computePaginatorStepLabel,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

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

export const StepsExample = (props: Props) => {
    return (
        <PagePaginatorDemo>
            <Paginator
                page={props.page}
                itemCount={props.itemCount}
                pageSize={props.pageSize}
                siblingCount={props.siblingCount}
                boundaryCount={props.boundaryCount}
                isDisabled={props.isDisabled}
                gap={PAGINATOR_GAP}
                ariaLabel={"Results"}
                computePageLabel={computePaginatorPageLabel}
                computeStepLabel={computePaginatorStepLabel}
                onPageChange={props.onPageChange}
                renderPage={(_getEntry, getRenderProps) => <PagePaginatorPage renderProps={getRenderProps} />}
                renderGap={(getEntry) => <PagePaginatorGap entry={getEntry} />}
                renderStep={(_getStep, getRenderProps) => <PagePaginatorStep renderProps={getRenderProps} />}
            />

            <PagePaginatorPanel page={props.page} itemCount={props.itemCount} pageSize={props.pageSize} />
        </PagePaginatorDemo>
    );
};
