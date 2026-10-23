import { Scroller } from "@thewaver/ss-components-solid";
import { GRID_SIZE, getGridCellLabel } from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.css";
import { FOCUS_RING_WIDTH } from "@thewaver/ss-playground/App/Theme.css";

import { PageScrollerButton } from "../../../PageComponents/ScrollerButton/ScrollerButton";
import { PageScrollerBarContent } from "../../../StyledComponents/ScrollerBarContent/ScrollerBarContent";
import type { ScrollerExampleProps } from "../ScrollerPageSolid.types";

const SCROLLER_GAP = 10;
const INDICES = Array.from({ length: GRID_SIZE }, (_, index) => index);

type Props = ScrollerExampleProps;

export const BothWaysExample = (props: Props) => {
    return (
        <div class={styles.bothWaysDemo}>
            <Scroller
                gap={SCROLLER_GAP}
                padding={FOCUS_RING_WIDTH}
                overflowX={props.overflowX}
                overflowY={props.overflowY}
                isAutoHiding={props.isAutoHiding}
                hideDelayMs={props.hideDelayMs}
                isBarOverlaid={props.isBarOverlaid}
                renderButton={(getStep, stepper, axis) => (
                    <PageScrollerButton step={getStep} stepper={stepper} axis={axis} />
                )}
                renderBar={(getRenderProps, refs) => (
                    <PageScrollerBarContent renderProps={getRenderProps} refs={refs} />
                )}
            >
                <div class={styles.cellGrid}>
                    {INDICES.flatMap((row) =>
                        INDICES.map((column) => <div class={styles.chip}>{getGridCellLabel(row, column)}</div>),
                    )}
                </div>
            </Scroller>
        </div>
    );
};
