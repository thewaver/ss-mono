import { Scroller } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.css";
import { FOCUS_RING_WIDTH } from "@thewaver/ss-playground/App/Theme.css";

import { PageScrollerButton } from "../../../PageComponents/ScrollerButton/ScrollerButton";
import { PageScrollerBarContent } from "../../../StyledComponents/ScrollerBarContent/ScrollerBarContent";
import type { ScrollerExampleProps } from "../ScrollerPageReact.types";

const SCROLLER_GAP = 10;

type Props = ScrollerExampleProps;

export const VerticalStripExample = (props: Props) => {
    return (
        <div className={styles.verticalDemo}>
            <Scroller
                gap={SCROLLER_GAP}
                padding={FOCUS_RING_WIDTH}
                overlapCount={props.overlapCount}
                overflowX={"hidden"}
                overflowY={"auto"}
                isAutoHiding={props.isAutoHiding}
                hideDelayMs={props.hideDelayMs}
                isBarOverlaid={props.isBarOverlaid}
                renderButton={(step, stepper, axis) => <PageScrollerButton step={step} stepper={stepper} axis={axis} />}
                renderBar={(renderProps, refs) => <PageScrollerBarContent renderProps={renderProps} refs={refs} />}
            >
                {props.labels.map((label) => (
                    <div key={label} className={styles.row}>
                        {label}
                    </div>
                ))}
            </Scroller>
        </div>
    );
};
