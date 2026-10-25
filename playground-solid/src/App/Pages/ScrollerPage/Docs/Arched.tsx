import { createSignal } from "solid-js";

import { Scroller } from "@thewaver/ss-components-solid";
import type { ScrollerController } from "@thewaver/ss-components-solid";
import { ITEM_LABELS } from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.css";
import { ScrollerArcContentUtils } from "@thewaver/ss-playground/App/StyledComponents/ScrollerArcContent/ScrollerArcContent.utils";
import { FOCUS_RING_WIDTH } from "@thewaver/ss-playground/App/Theme.css";

import { PageScrollerButton } from "../../../PageComponents/ScrollerButton/ScrollerButton";
import { PageScrollerArcContent } from "../../../StyledComponents/ScrollerArcContent/ScrollerArcContent";

export const ArchedDocsExample = () => {
    const [getController, setController] = createSignal<ScrollerController>();

    return (
        <div class={styles.stripLayout}>
            <PageScrollerButton id={"archedBack"} controller={getController} step={"previous"} />

            <div class={styles.scrollerCell}>
                <Scroller
                    barSideX={"start"}
                    padding={FOCUS_RING_WIDTH}
                    computeProgressAtPoint={ScrollerArcContentUtils.computeProgressAtPoint}
                    renderBar={(getRenderProps, refs) => (
                        <PageScrollerArcContent renderProps={getRenderProps} refs={refs} />
                    )}
                    onMount={setController}
                >
                    {ITEM_LABELS.map((label) => (
                        <div class={styles.chip}>{label}</div>
                    ))}
                </Scroller>
            </div>

            <PageScrollerButton id={"archedForward"} controller={getController} step={"next"} />
        </div>
    );
};
