import { useState } from "react";

import { Paginator } from "@thewaver/ss-components-react";
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
import type { PaginatorBasicDocsExampleProps } from "../PaginatorPageReact.types";

type Props = PaginatorBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const [page, setPage] = useState(FIRST_PAGE);

    return (
        <PagePaginatorDemo>
            <Paginator
                page={page}
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
                renderPage={(_entry, renderProps) => <PagePaginatorPage renderProps={renderProps} />}
                renderGap={(entry) => <PagePaginatorGap entry={entry} />}
                renderStep={(_step, renderProps) => <PagePaginatorStep renderProps={renderProps} />}
            />

            <PagePaginatorPanel page={page} itemCount={props.itemCount} pageSize={props.pageSize} />
        </PagePaginatorDemo>
    );
};
