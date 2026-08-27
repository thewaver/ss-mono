import { Button, Scroller, access } from "@thewaver/ss-components";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageScrollerButton } from "../../../StyledComponents/ScrollerButton/ScrollerButton";
import type { ScrollerExampleProps } from "../ScrollerPage.types";

import { FOCUS_RING_WIDTH } from "../../../Theme.css";
import * as styles from "../ScrollerPage.css";

const SCROLLER_GAP = 10;

type Props = ScrollerExampleProps;

export const FocusableChildrenExample = (props: Props) => {
    return (
        <div class={styles.demo}>
            <Scroller
                gap={() => SCROLLER_GAP}
                padding={() => FOCUS_RING_WIDTH}
                renderButton={(getStep, stepper) => <PageScrollerButton step={getStep} stepper={stepper} />}
            >
                {access(props.labels).map((label) => (
                    <div class={styles.item}>
                        <Button
                            renderContent={(getFlags) => (
                                <PageButtonContent flags={getFlags}>{label}</PageButtonContent>
                            )}
                        />
                    </div>
                ))}
            </Scroller>
        </div>
    );
};
