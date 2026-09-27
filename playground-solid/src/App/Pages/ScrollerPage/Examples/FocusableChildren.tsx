import { Button, Scroller, access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground-core/App/Pages/ScrollerPage/ScrollerPage.css";
import { FOCUS_RING_WIDTH } from "@thewaver/ss-playground-core/App/Theme.css";

import { PageScrollerButton } from "../../../PageComponents/ScrollerButton/ScrollerButton";
import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import type { ScrollerExampleProps } from "../ScrollerPage.types";

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
