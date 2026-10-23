import { Scroller } from "@thewaver/ss-components-react";
import { GRID_SIZE, getGridCellLabel } from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.css";
import { FOCUS_RING_WIDTH } from "@thewaver/ss-playground/App/Theme.css";

import { PageScrollerButton } from "../../../PageComponents/ScrollerButton/ScrollerButton";
import { PageScrollerBarContent } from "../../../StyledComponents/ScrollerBarContent/ScrollerBarContent";
import type { ScrollerExampleProps } from "../ScrollerPageReact.types";

const SCROLLER_GAP = 10;
const INDICES = Array.from({ length: GRID_SIZE }, (_, index) => index);

type Props = ScrollerExampleProps;

export const BothWaysExample = (props: Props) => {
    return (
        <div className={styles.bothWaysDemo}>
            <Scroller
                gap={SCROLLER_GAP}
                padding={FOCUS_RING_WIDTH}
                overflowX={props.overflowX}
                overflowY={props.overflowY}
                isAutoHiding={props.isAutoHiding}
                hideDelayMs={props.hideDelayMs}
                isBarOverlaid={props.isBarOverlaid}
                renderButton={(step, stepper, axis) => <PageScrollerButton step={step} stepper={stepper} axis={axis} />}
                renderBar={(renderProps, refs) => <PageScrollerBarContent renderProps={renderProps} refs={refs} />}
            >
                <div className={styles.cellGrid}>
                    {INDICES.flatMap((row) =>
                        INDICES.map((column) => (
                            <div key={getGridCellLabel(row, column)} className={styles.chip}>
                                {getGridCellLabel(row, column)}
                            </div>
                        )),
                    )}
                </div>
            </Scroller>
        </div>
    );
};
