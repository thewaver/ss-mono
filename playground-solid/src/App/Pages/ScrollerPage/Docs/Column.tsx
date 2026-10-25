import { createSignal } from "solid-js";

import { Scroller } from "@thewaver/ss-components-solid";
import type { ScrollerController } from "@thewaver/ss-components-solid";
import { ITEM_LABELS } from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.css";
import { FOCUS_RING_WIDTH } from "@thewaver/ss-playground/App/Theme.css";

import { PageScrollerButton } from "../../../PageComponents/ScrollerButton/ScrollerButton";
import { PageScrollerBarContent } from "../../../StyledComponents/ScrollerBarContent/ScrollerBarContent";

export const ColumnDocsExample = () => {
    const [getController, setController] = createSignal<ScrollerController>();

    return (
        <div class={styles.columnLayout}>
            <PageScrollerButton id={"columnUp"} controller={getController} step={"previous"} axis={"y"} />

            <div class={styles.scrollerCell}>
                <Scroller
                    padding={FOCUS_RING_WIDTH}
                    overflowX={"hidden"}
                    overflowY={"auto"}
                    renderBar={(getRenderProps, refs) => (
                        <PageScrollerBarContent renderProps={getRenderProps} refs={refs} />
                    )}
                    onMount={setController}
                >
                    {ITEM_LABELS.map((label) => (
                        <div class={styles.row}>{label}</div>
                    ))}
                </Scroller>
            </div>

            <PageScrollerButton id={"columnDown"} controller={getController} step={"next"} axis={"y"} />
        </div>
    );
};
