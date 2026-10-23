import { Scroller, access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.css";
import { ScrollerArcContentUtils } from "@thewaver/ss-playground/App/StyledComponents/ScrollerArcContent/ScrollerArcContent.utils";
import { FOCUS_RING_WIDTH } from "@thewaver/ss-playground/App/Theme.css";

import { PageScrollerButton } from "../../../PageComponents/ScrollerButton/ScrollerButton";
import { PageScrollerArcContent } from "../../../StyledComponents/ScrollerArcContent/ScrollerArcContent";
import type { ScrollerExampleProps } from "../ScrollerPageSolid.types";

const SCROLLER_GAP = 10;

type Props = ScrollerExampleProps;

export const ArchedExample = (props: Props) => {
    return (
        <div class={styles.demo}>
            <Scroller
                gap={SCROLLER_GAP}
                barSideX={"start"}
                padding={FOCUS_RING_WIDTH}
                overlapCount={props.overlapCount}
                computeProgressAtPoint={ScrollerArcContentUtils.computeProgressAtPoint}
                renderButton={(getStep, stepper, axis) => (
                    <PageScrollerButton step={getStep} stepper={stepper} axis={axis} />
                )}
                renderBar={(getRenderProps, refs) => (
                    <PageScrollerArcContent renderProps={getRenderProps} refs={refs} />
                )}
            >
                {access(props.labels).map((label) => (
                    <div class={styles.chip}>{label}</div>
                ))}
            </Scroller>
        </div>
    );
};
