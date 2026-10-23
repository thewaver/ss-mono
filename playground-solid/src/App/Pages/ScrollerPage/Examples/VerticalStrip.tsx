import { Scroller, access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.css";
import { FOCUS_RING_WIDTH } from "@thewaver/ss-playground/App/Theme.css";

import { PageScrollerButton } from "../../../PageComponents/ScrollerButton/ScrollerButton";
import { PageScrollerBarContent } from "../../../StyledComponents/ScrollerBarContent/ScrollerBarContent";
import type { ScrollerExampleProps } from "../ScrollerPageSolid.types";

const SCROLLER_GAP = 10;

type Props = ScrollerExampleProps;

export const VerticalStripExample = (props: Props) => {
    return (
        <div class={styles.verticalDemo}>
            <Scroller
                gap={SCROLLER_GAP}
                padding={FOCUS_RING_WIDTH}
                overlapCount={props.overlapCount}
                overflowX={"hidden"}
                overflowY={"auto"}
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
                {access(props.labels).map((label) => (
                    <div class={styles.row}>{label}</div>
                ))}
            </Scroller>
        </div>
    );
};
