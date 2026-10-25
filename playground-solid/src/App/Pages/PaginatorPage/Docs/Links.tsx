import { createSignal } from "solid-js";

import { Paginator, access } from "@thewaver/ss-components-solid";
import type { PaginatorLinkProps } from "@thewaver/ss-components-solid";
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
import type { PaginatorLinksDocsExampleProps } from "../PaginatorPageSolid.types";

type Props = PaginatorLinksDocsExampleProps;

const CustomPaginatorLink = (props: PaginatorLinkProps) => <a {...props} data-link-component />;

export const LinksDocsExample = (props: Props) => {
    const [getPage, setPage] = createSignal(FIRST_PAGE);

    return (
        <PagePaginatorDemo>
            <Paginator
                page={getPage}
                itemCount={ITEM_COUNT}
                pageSize={PAGE_SIZE}
                gap={PAGINATOR_GAP}
                ariaLabel={"Linked results"}
                computePageLabel={computePaginatorPageLabel}
                computeStepLabel={computePaginatorStepLabel}
                computeHref={(page) => `#paginator-page-${page}`}
                linkComponent={access(props.hasLinkComponent) ? CustomPaginatorLink : undefined}
                onPageChange={setPage}
                renderPage={(_getEntry, getRenderProps) => <PagePaginatorPage renderProps={getRenderProps} />}
                renderGap={(getEntry) => <PagePaginatorGap entry={getEntry} />}
                renderStep={(_getStep, getRenderProps) => <PagePaginatorStep renderProps={getRenderProps} />}
            />

            <PagePaginatorPanel page={getPage} itemCount={ITEM_COUNT} pageSize={PAGE_SIZE} />
        </PagePaginatorDemo>
    );
};
