import { Scroller } from "@thewaver/ss-components-react";
import type { ScrollerButtonPlacement } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground-core/App/Pages/ScrollerPage/ScrollerPage.css";
import { FOCUS_RING_WIDTH } from "@thewaver/ss-playground-core/App/Theme.css";

import { PageScrollerButton } from "../../../PageComponents/ScrollerButton/ScrollerButton";
import type { ScrollerExampleProps } from "../ScrollerPage.types";

const SCROLLER_GAP = 10;

type Props = ScrollerExampleProps & {
    buttonPlacement?: ScrollerButtonPlacement;
    progressState?: readonly [number, (ratio: number) => void];
};

export const ChipsExample = (props: Props) => {
    return (
        <div className={styles.demo}>
            <Scroller
                gap={SCROLLER_GAP}
                padding={FOCUS_RING_WIDTH}
                buttonPlacement={props.buttonPlacement}
                progressState={props.progressState}
                renderButton={(step, stepper) => <PageScrollerButton step={step} stepper={stepper} />}
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
