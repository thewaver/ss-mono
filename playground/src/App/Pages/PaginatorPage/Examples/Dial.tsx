import { Paginator, PlacementLayoutUtils } from "@thewaver/ss-components";
import type { BandDefs, PaginatorStep } from "@thewaver/ss-components";

import {
    PagePaginatorDemo,
    PagePaginatorDialGap,
    PagePaginatorDialPage,
    PagePaginatorDialStep,
    PagePaginatorPanel,
} from "../../../StyledComponents/PaginatorContent/PaginatorContent";
import type { PaginatorExampleProps } from "../PaginatorPage.types";

const DIAL_STEPS: PaginatorStep[] = ["first", "previous", "next", "last"];

const DIAL_DEFS: BandDefs = { holeRadius: 60, bandWidth: 60, wedgeGapDegrees: 2 };

const DIAL_LAYOUT = PlacementLayoutUtils.createRing(DIAL_DEFS);

const DIAL_WIDTH = `${(DIAL_DEFS.holeRadius! + DIAL_DEFS.bandWidth!) * 2}px`;

type Props = PaginatorExampleProps;

export const DialExample = (props: Props) => {
    return (
        <PagePaginatorDemo>
            <div style={{ width: DIAL_WIDTH }}>
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
            </div>
        </PagePaginatorDemo>
    );
};
