import { Paginator, PlacementLayoutUtils } from "@thewaver/ss-components";
import type { BandDefs, PaginatorStep } from "@thewaver/ss-components";

import {
    computePaginatorPageLabel,
    computePaginatorStepLabel,
} from "../../../PageComponents/Announcements/Announcements.const";
import {
    PagePaginatorDemo,
    PagePaginatorDialGap,
    PagePaginatorDialPage,
    PagePaginatorDialStep,
    PagePaginatorPanel,
} from "../../../StyledComponents/PaginatorContent/PaginatorContent";
import type { PaginatorExampleProps } from "../PaginatorPage.types";

import * as styles from "../PaginatorPage.css";

const DIAL_STEPS: PaginatorStep[] = ["first", "previous", "next", "last"];

const DIAL_DEFS: BandDefs = { spreadDegrees: 180, facingDegrees: 0, holeRatio: 0.5, wedgeGapDegrees: 2 };

const DIAL_LAYOUT = PlacementLayoutUtils.createRing(DIAL_DEFS);

type Props = PaginatorExampleProps;

export const DialExample = (props: Props) => {
    return (
        <PagePaginatorDemo>
            <div class={styles.halfDial}>
                <div class={styles.halfDialRing}>
                    <Paginator
                        page={props.page}
                        pageCount={props.pageCount}
                        siblingCount={props.siblingCount}
                        boundaryCount={props.boundaryCount}
                        isDisabled={props.isDisabled}
                        ariaLabel={"Results round a dial"}
                        computePageLabel={computePaginatorPageLabel}
                        computeStepLabel={computePaginatorStepLabel}
                        steps={() => DIAL_STEPS}
                        computeLayout={DIAL_LAYOUT}
                        onPageChange={props.onPageChange}
                        renderPage={(_getEntry, getRenderProps) => (
                            <PagePaginatorDialPage renderProps={getRenderProps} />
                        )}
                        renderGap={(getEntry, getPlacement) => (
                            <PagePaginatorDialGap entry={getEntry} placement={getPlacement} />
                        )}
                        renderStep={(_getStep, getRenderProps) => (
                            <PagePaginatorDialStep renderProps={getRenderProps} />
                        )}
                    />
                </div>

                <div class={styles.halfDialPanel}>
                    <PagePaginatorPanel page={props.page} pageCount={props.pageCount} />
                </div>
            </div>
        </PagePaginatorDemo>
    );
};
