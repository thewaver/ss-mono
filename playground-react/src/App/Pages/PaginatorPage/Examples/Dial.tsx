import { Paginator, PlacementLayoutUtils } from "@thewaver/ss-components-react";
import type { BandDefs, PaginatorStep } from "@thewaver/ss-components-react";
import {
    computePaginatorPageLabel,
    computePaginatorStepLabel,
} from "@thewaver/ss-playground-core/App/PageComponents/Announcements/Announcements.const";
import * as styles from "@thewaver/ss-playground-core/App/Pages/PaginatorPage/PaginatorPage.css";

import {
    PagePaginatorDemo,
    PagePaginatorDialGap,
    PagePaginatorDialPage,
    PagePaginatorDialStep,
    PagePaginatorPanel,
} from "../../../StyledComponents/PaginatorContent/PaginatorContent";
import type { PaginatorExampleProps } from "../PaginatorPage.types";

const DIAL_STEPS: PaginatorStep[] = ["first", "previous", "next", "last"];

const DIAL_DEFS: BandDefs = { spreadDegrees: 180, facingDegrees: 0, holeRatio: 0.5, wedgeGapDegrees: 2 };

const DIAL_LAYOUT = PlacementLayoutUtils.createRing(DIAL_DEFS);

type Props = PaginatorExampleProps;

export const DialExample = (props: Props) => {
    return (
        <PagePaginatorDemo>
            <div className={styles.halfDial}>
                <div className={styles.halfDialRing}>
                    <Paginator
                        page={props.page}
                        pageCount={props.pageCount}
                        siblingCount={props.siblingCount}
                        boundaryCount={props.boundaryCount}
                        isDisabled={props.isDisabled}
                        ariaLabel={"Results round a dial"}
                        computePageLabel={computePaginatorPageLabel}
                        computeStepLabel={computePaginatorStepLabel}
                        steps={DIAL_STEPS}
                        computeLayout={DIAL_LAYOUT}
                        onPageChange={props.onPageChange}
                        renderPage={(_entry, renderProps) => <PagePaginatorDialPage renderProps={renderProps} />}
                        renderGap={(entry, placement) => <PagePaginatorDialGap entry={entry} placement={placement} />}
                        renderStep={(_step, renderProps) => <PagePaginatorDialStep renderProps={renderProps} />}
                    />
                </div>

                <div className={styles.halfDialPanel}>
                    <PagePaginatorPanel page={props.page} pageCount={props.pageCount} />
                </div>
            </div>
        </PagePaginatorDemo>
    );
};
