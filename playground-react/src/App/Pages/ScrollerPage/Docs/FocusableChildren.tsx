import { useState } from "react";

import { Button, Scroller } from "@thewaver/ss-components-react";
import type { ScrollerController } from "@thewaver/ss-components-react";
import { ITEM_LABELS } from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.css";
import { FOCUS_RING_WIDTH } from "@thewaver/ss-playground/App/Theme.css";

import { PageScrollerButton } from "../../../PageComponents/ScrollerButton/ScrollerButton";
import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";

export const FocusableChildrenDocsExample = () => {
    const [controller, setController] = useState<ScrollerController>();

    return (
        <div className={styles.stripLayout}>
            <PageScrollerButton id={"focusableChildrenBack"} controller={controller} step={"previous"} />

            <div className={styles.scrollerCell}>
                <Scroller padding={FOCUS_RING_WIDTH} onMount={setController}>
                    {ITEM_LABELS.map((label) => (
                        <div key={label} className={styles.item}>
                            <Button
                                renderContent={(flags) => <PageButtonContent flags={flags}>{label}</PageButtonContent>}
                            />
                        </div>
                    ))}
                </Scroller>
            </div>

            <PageScrollerButton id={"focusableChildrenForward"} controller={controller} step={"next"} />
        </div>
    );
};
