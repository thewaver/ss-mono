import { useState } from "react";

import { Scroller } from "@thewaver/ss-components-react";
import type { ScrollerController } from "@thewaver/ss-components-react";
import { toItemLabels } from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.css";
import { FOCUS_RING_WIDTH } from "@thewaver/ss-playground/App/Theme.css";

import { PageScrollerButton } from "../../../PageComponents/ScrollerButton/ScrollerButton";
import type { ScrollerBasicDocsExampleProps } from "../ScrollerPageReact.types";

type Props = ScrollerBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const [controller, setController] = useState<ScrollerController>();

    return (
        <div className={styles.stripLayout}>
            <PageScrollerButton id={"basicBack"} controller={controller} step={"previous"} />

            <div className={styles.scrollerCell}>
                <Scroller padding={FOCUS_RING_WIDTH} overlapCount={props.overlapCount} onMount={setController}>
                    {toItemLabels(props.itemCount).map((label) => (
                        <div key={label} className={styles.chip}>
                            {label}
                        </div>
                    ))}
                </Scroller>
            </div>

            <PageScrollerButton id={"basicForward"} controller={controller} step={"next"} />
        </div>
    );
};
