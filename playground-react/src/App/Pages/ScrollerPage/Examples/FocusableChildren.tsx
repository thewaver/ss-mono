import { Button, Scroller } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground-core/App/Pages/ScrollerPage/ScrollerPage.css";
import { FOCUS_RING_WIDTH } from "@thewaver/ss-playground-core/App/Theme.css";

import { PageScrollerButton } from "../../../PageComponents/ScrollerButton/ScrollerButton";
import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import type { ScrollerExampleProps } from "../ScrollerPage.types";

const SCROLLER_GAP = 10;

type Props = ScrollerExampleProps;

export const FocusableChildrenExample = (props: Props) => {
    return (
        <div className={styles.demo}>
            <Scroller
                gap={SCROLLER_GAP}
                padding={FOCUS_RING_WIDTH}
                renderButton={(step, stepper) => <PageScrollerButton step={step} stepper={stepper} />}
            >
                {props.labels.map((label) => (
                    <div key={label} className={styles.item}>
                        <Button
                            renderContent={(flags) => <PageButtonContent flags={flags}>{label}</PageButtonContent>}
                        />
                    </div>
                ))}
            </Scroller>
        </div>
    );
};
