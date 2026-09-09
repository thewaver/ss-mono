import { Paginator, createRing } from "@thewaver/ss-components";
import type { ArcDefs, PaginatorStep } from "@thewaver/ss-components";

import {
    PagePaginatorDemo,
    PagePaginatorDialGap,
    PagePaginatorDialPage,
    PagePaginatorDialStep,
    PagePaginatorPanel,
} from "../../../StyledComponents/PaginatorContent/PaginatorContent";
import type { PaginatorExampleProps } from "../PaginatorPage.types";

const DIAL_STEPS: PaginatorStep[] = ["first", "previous", "next", "last"];

const DIAL_DEFS: ArcDefs = { holeRadiusPx: 60, bandWidthPx: 60, wedgeGapDegrees: 2 };

const DIAL_LAYOUT = createRing(DIAL_DEFS);

type Props = PaginatorExampleProps;

export const DialExample = (props: Props) => {
    return (
        <PagePaginatorDemo>
            <Paginator
                page={props.page}
                pageCount={props.pageCount}
                siblingCount={props.siblingCount}
                boundaryCount={props.boundaryCount}
                isDisabled={props.isDisabled}
                ariaLabel={"Results round a dial"}
                steps={() => DIAL_STEPS}
                computeLayout={DIAL_LAYOUT}
                onPageChange={props.onPageChange}
                renderPage={(_getEntry, getRenderProps) => <PagePaginatorDialPage renderProps={getRenderProps} />}
                renderGap={(getEntry, getPlacement) => (
                    <PagePaginatorDialGap entry={getEntry} placement={getPlacement} />
                )}
                renderStep={(_getStep, getRenderProps) => <PagePaginatorDialStep renderProps={getRenderProps} />}
            />

            <PagePaginatorPanel page={props.page} pageCount={props.pageCount} />
        </PagePaginatorDemo>
    );
};
