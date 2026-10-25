import { useState } from "react";

import { Paginator } from "@thewaver/ss-components-react";
import type { PaginatorLinkProps } from "@thewaver/ss-components-react";
import {
    computePaginatorPageLabel,
    computePaginatorStepLabel,
} from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import {
    FIRST_PAGE,
    ITEM_COUNT,
    PAGE_SIZE,
    PAGINATOR_GAP,
} from "@thewaver/ss-playground/App/Pages/PaginatorPage/PaginatorPage.const";

import {
    PagePaginatorDemo,
    PagePaginatorGap,
    PagePaginatorPage,
    PagePaginatorPanel,
    PagePaginatorStep,
} from "../../../StyledComponents/PaginatorContent/PaginatorContent";
import type { PaginatorLinksDocsExampleProps } from "../PaginatorPageReact.types";

type Props = PaginatorLinksDocsExampleProps;

const CustomPaginatorLink = (props: PaginatorLinkProps) => <a {...props} data-link-component="" />;

export const LinksDocsExample = (props: Props) => {
    const [page, setPage] = useState(FIRST_PAGE);

    return (
        <PagePaginatorDemo>
            <Paginator
                page={page}
                itemCount={ITEM_COUNT}
                pageSize={PAGE_SIZE}
                gap={PAGINATOR_GAP}
                ariaLabel={"Linked results"}
                computePageLabel={computePaginatorPageLabel}
                computeStepLabel={computePaginatorStepLabel}
                computeHref={(page) => `#paginator-page-${page}`}
                linkComponent={props.hasLinkComponent ? CustomPaginatorLink : undefined}
                onPageChange={setPage}
                renderPage={(_entry, renderProps) => <PagePaginatorPage renderProps={renderProps} />}
                renderGap={(entry) => <PagePaginatorGap entry={entry} />}
                renderStep={(_step, renderProps) => <PagePaginatorStep renderProps={renderProps} />}
            />

            <PagePaginatorPanel page={page} itemCount={ITEM_COUNT} pageSize={PAGE_SIZE} />
        </PagePaginatorDemo>
    );
};
