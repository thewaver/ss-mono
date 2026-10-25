import { useState } from "react";

import { Scroller } from "@thewaver/ss-components-react";
import type { ScrollerController } from "@thewaver/ss-components-react";
import { ITEM_LABELS } from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.css";
import { FOCUS_RING_WIDTH } from "@thewaver/ss-playground/App/Theme.css";

import { PageScrollerButton } from "../../../PageComponents/ScrollerButton/ScrollerButton";
import type { ScrollerDrivenDocsExampleProps } from "../ScrollerPageReact.types";

type Props = ScrollerDrivenDocsExampleProps;

export const DrivenDocsExample = (props: Props) => {
    const [controller, setController] = useState<ScrollerController>();

    return (
        <div className={styles.stripLayout}>
            <PageScrollerButton id={"drivenBack"} controller={controller} step={"previous"} />

            <div className={styles.scrollerCell}>
                <Scroller padding={FOCUS_RING_WIDTH} progress={props.progress} onMount={setController}>
                    {ITEM_LABELS.map((label) => (
                        <div key={label} className={styles.chip}>
                            {label}
                        </div>
                    ))}
                </Scroller>
            </div>

            <PageScrollerButton id={"drivenForward"} controller={controller} step={"next"} />
        </div>
    );
};
