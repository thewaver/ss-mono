import { createSignal } from "solid-js";

import { Paginator } from "@thewaver/ss-components-solid";
import {
    computePaginatorPageLabel,
    computePaginatorStepLabel,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { FIRST_PAGE, PAGINATOR_GAP } from "@thewaver/ss-playground/App/Pages/PaginatorPage/PaginatorPage.const";

import {
    PagePaginatorDemo,
    PagePaginatorGap,
    PagePaginatorPage,
    PagePaginatorPanel,
    PagePaginatorStep,
} from "../../../StyledComponents/PaginatorContent/PaginatorContent";
import type { PaginatorBasicDocsExampleProps } from "../PaginatorPageSolid.types";

type Props = PaginatorBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const [getPage, setPage] = createSignal(FIRST_PAGE);

    return (
        <PagePaginatorDemo>
            <Paginator
                page={getPage}
                itemCount={props.itemCount}
                pageSize={props.pageSize}
                siblingCount={props.siblingCount}
                boundaryCount={props.boundaryCount}
                isDisabled={props.isDisabled}
                gap={PAGINATOR_GAP}
                ariaLabel={"Results"}
                computePageLabel={computePaginatorPageLabel}
                computeStepLabel={computePaginatorStepLabel}
                onPageChange={setPage}
                renderPage={(_getEntry, getRenderProps) => <PagePaginatorPage renderProps={getRenderProps} />}
                renderGap={(getEntry) => <PagePaginatorGap entry={getEntry} />}
                renderStep={(_getStep, getRenderProps) => <PagePaginatorStep renderProps={getRenderProps} />}
            />

            <PagePaginatorPanel page={getPage} itemCount={props.itemCount} pageSize={props.pageSize} />
        </PagePaginatorDemo>
    );
};
