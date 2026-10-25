import { useState } from "react";

import { Scroller } from "@thewaver/ss-components-react";
import type { ScrollerController } from "@thewaver/ss-components-react";
import { ITEM_LABELS } from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.css";
import { ScrollerArcContentUtils } from "@thewaver/ss-playground/App/StyledComponents/ScrollerArcContent/ScrollerArcContent.utils";
import { FOCUS_RING_WIDTH } from "@thewaver/ss-playground/App/Theme.css";

import { PageScrollerButton } from "../../../PageComponents/ScrollerButton/ScrollerButton";
import { PageScrollerArcContent } from "../../../StyledComponents/ScrollerArcContent/ScrollerArcContent";

export const ArchedDocsExample = () => {
    const [controller, setController] = useState<ScrollerController>();

    return (
        <div className={styles.stripLayout}>
            <PageScrollerButton id={"archedBack"} controller={controller} step={"previous"} />

            <div className={styles.scrollerCell}>
                <Scroller
                    barSideX={"start"}
                    padding={FOCUS_RING_WIDTH}
                    computeProgressAtPoint={ScrollerArcContentUtils.computeProgressAtPoint}
                    renderBar={(renderProps, refs) => <PageScrollerArcContent renderProps={renderProps} refs={refs} />}
                    onMount={setController}
                >
                    {ITEM_LABELS.map((label) => (
                        <div key={label} className={styles.chip}>
                            {label}
                        </div>
                    ))}
                </Scroller>
            </div>

            <PageScrollerButton id={"archedForward"} controller={controller} step={"next"} />
        </div>
    );
};
