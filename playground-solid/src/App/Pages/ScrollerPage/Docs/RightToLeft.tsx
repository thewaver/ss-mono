import { createSignal } from "solid-js";

import { Scroller } from "@thewaver/ss-components-solid";
import type { ScrollerController } from "@thewaver/ss-components-solid";
import { ITEM_LABELS } from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.css";
import { FOCUS_RING_WIDTH } from "@thewaver/ss-playground/App/Theme.css";

import { PageScrollerButton } from "../../../PageComponents/ScrollerButton/ScrollerButton";
import { PageScrollerBarContent } from "../../../StyledComponents/ScrollerBarContent/ScrollerBarContent";

export const RightToLeftDocsExample = () => {
    const [getController, setController] = createSignal<ScrollerController>();

    return (
        <div class={styles.stripLayout} dir={"rtl"}>
            <PageScrollerButton id={"rightToLeftBack"} controller={getController} step={"previous"} />

            <div class={styles.scrollerCell}>
                <Scroller
                    padding={FOCUS_RING_WIDTH}
                    renderBar={(getRenderProps, refs) => (
                        <PageScrollerBarContent renderProps={getRenderProps} refs={refs} />
                    )}
                    onMount={setController}
                >
                    {ITEM_LABELS.map((label) => (
                        <div class={styles.chip}>{label}</div>
                    ))}
                </Scroller>
            </div>

            <PageScrollerButton id={"rightToLeftForward"} controller={getController} step={"next"} />
        </div>
    );
};
