import { Scroller } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.css";
import { ScrollerArcContentUtils } from "@thewaver/ss-playground/App/StyledComponents/ScrollerArcContent/ScrollerArcContent.utils";
import { FOCUS_RING_WIDTH } from "@thewaver/ss-playground/App/Theme.css";

import { PageScrollerButton } from "../../../PageComponents/ScrollerButton/ScrollerButton";
import { PageScrollerArcContent } from "../../../StyledComponents/ScrollerArcContent/ScrollerArcContent";
import type { ScrollerExampleProps } from "../ScrollerPageReact.types";

const SCROLLER_GAP = 10;

type Props = ScrollerExampleProps;

export const ArchedExample = (props: Props) => {
    return (
        <div className={styles.demo}>
            <Scroller
                gap={SCROLLER_GAP}
                barSideX={"start"}
                padding={FOCUS_RING_WIDTH}
                overlapCount={props.overlapCount}
                computeProgressAtPoint={ScrollerArcContentUtils.computeProgressAtPoint}
                renderButton={(step, stepper, axis) => <PageScrollerButton step={step} stepper={stepper} axis={axis} />}
                renderBar={(renderProps, refs) => <PageScrollerArcContent renderProps={renderProps} refs={refs} />}
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
