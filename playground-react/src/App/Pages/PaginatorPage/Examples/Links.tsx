import { Paginator } from "@thewaver/ss-components-react";
import {
    computePaginatorPageLabel,
    computePaginatorStepLabel,
} from "@thewaver/ss-playground-core/App/PageComponents/Announcements/Announcements.const";

import {
    PagePaginatorDemo,
    PagePaginatorGap,
    PagePaginatorPage,
    PagePaginatorPanel,
    PagePaginatorStep,
} from "../../../StyledComponents/PaginatorContent/PaginatorContent";
import type { PaginatorExampleProps } from "../PaginatorPage.types";

const PAGINATOR_GAP = 5;

type Props = PaginatorExampleProps;

export const LinksExample = (props: Props) => {
    return (
        <PagePaginatorDemo>
            <Paginator
                page={props.page}
                pageCount={props.pageCount}
                siblingCount={props.siblingCount}
                boundaryCount={props.boundaryCount}
                isDisabled={props.isDisabled}
                gap={PAGINATOR_GAP}
                ariaLabel={"Linked results"}
                computePageLabel={computePaginatorPageLabel}
                computeStepLabel={computePaginatorStepLabel}
                computeHref={(page) => `#paginator-page-${page}`}
                onPageChange={props.onPageChange}
                renderPage={(_entry, renderProps) => <PagePaginatorPage renderProps={renderProps} />}
                renderGap={(entry) => <PagePaginatorGap entry={entry} />}
                renderStep={(_step, renderProps) => <PagePaginatorStep renderProps={renderProps} />}
            />

            <PagePaginatorPanel page={props.page} pageCount={props.pageCount} />
        </PagePaginatorDemo>
    );
};
