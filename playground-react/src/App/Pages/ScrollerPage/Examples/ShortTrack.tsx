import { Scroller } from "@thewaver/ss-components-react";
import { SHORT_TRACK_LENGTH } from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.css";
import { FOCUS_RING_WIDTH } from "@thewaver/ss-playground/App/Theme.css";

import { PageScrollerButton } from "../../../PageComponents/ScrollerButton/ScrollerButton";
import { PageScrollerBarContent } from "../../../StyledComponents/ScrollerBarContent/ScrollerBarContent";
import type { ScrollerExampleProps } from "../ScrollerPageReact.types";

const SCROLLER_GAP = 10;

type Props = ScrollerExampleProps;

export const ShortTrackExample = (props: Props) => {
    return (
        <div className={styles.demo}>
            <Scroller
                gap={SCROLLER_GAP}
                padding={FOCUS_RING_WIDTH}
                overlapCount={props.overlapCount}
                renderButton={(step, stepper, axis) => <PageScrollerButton step={step} stepper={stepper} axis={axis} />}
                renderBar={(renderProps, refs) => (
                    <PageScrollerBarContent renderProps={renderProps} refs={refs} trackLength={SHORT_TRACK_LENGTH} />
                )}
            >
                {props.labels.map((label) => (
                    <div key={label} className={styles.chip}>
                        {label}
                    </div>
                ))}
            </Scroller>
        </div>
    );
};
