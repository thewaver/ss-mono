import type { Signal } from "solid-js";

import { Scroller, access } from "@thewaver/ss-components";
import type { MaybeAccessor, ScrollerButtonPlacement } from "@thewaver/ss-components";

import { PageScrollerButton } from "../../../StyledComponents/ScrollerButton/ScrollerButton";
import type { ScrollerExampleProps } from "../ScrollerPage.types";

import { FOCUS_RING_WIDTH } from "../../../Theme.css";
import * as styles from "../ScrollerPage.css";

const SCROLLER_GAP = 10;

type Props = ScrollerExampleProps & {
    buttonPlacement?: MaybeAccessor<ScrollerButtonPlacement>;
    progressSignal?: Signal<number>;
};

export const ChipsExample = (props: Props) => {
    return (
        <div class={styles.demo}>
            <Scroller
                gap={() => SCROLLER_GAP}
                padding={() => FOCUS_RING_WIDTH}
                buttonPlacement={props.buttonPlacement}
                progressSignal={props.progressSignal}
                renderButton={(getStep, stepper) => <PageScrollerButton step={getStep} stepper={stepper} />}
            >
                {access(props.labels).map((label) => (
                    <div class={styles.chip}>{label}</div>
                ))}
            </Scroller>
        </div>
    );
};
