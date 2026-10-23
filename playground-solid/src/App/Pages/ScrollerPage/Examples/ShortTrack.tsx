import { Scroller, access } from "@thewaver/ss-components-solid";
import { SHORT_TRACK_LENGTH } from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.css";
import { FOCUS_RING_WIDTH } from "@thewaver/ss-playground/App/Theme.css";

import { PageScrollerButton } from "../../../PageComponents/ScrollerButton/ScrollerButton";
import { PageScrollerBarContent } from "../../../StyledComponents/ScrollerBarContent/ScrollerBarContent";
import type { ScrollerExampleProps } from "../ScrollerPageSolid.types";

const SCROLLER_GAP = 10;

type Props = ScrollerExampleProps;

export const ShortTrackExample = (props: Props) => {
    return (
        <div class={styles.demo}>
            <Scroller
                gap={SCROLLER_GAP}
                padding={FOCUS_RING_WIDTH}
                overlapCount={props.overlapCount}
                renderButton={(getStep, stepper, axis) => (
                    <PageScrollerButton step={getStep} stepper={stepper} axis={axis} />
                )}
                renderBar={(getRenderProps, refs) => (
                    <PageScrollerBarContent renderProps={getRenderProps} refs={refs} trackLength={SHORT_TRACK_LENGTH} />
                )}
            >
                {access(props.labels).map((label) => (
                    <div class={styles.chip}>{label}</div>
                ))}
            </Scroller>
        </div>
    );
};
