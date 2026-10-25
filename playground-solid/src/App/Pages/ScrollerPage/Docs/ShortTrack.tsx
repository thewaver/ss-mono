import { createSignal } from "solid-js";

import { Scroller } from "@thewaver/ss-components-solid";
import type { ScrollerController } from "@thewaver/ss-components-solid";
import { ITEM_LABELS, SHORT_TRACK_LENGTH } from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.css";
import { FOCUS_RING_WIDTH } from "@thewaver/ss-playground/App/Theme.css";

import { PageScrollerButton } from "../../../PageComponents/ScrollerButton/ScrollerButton";
import { PageScrollerBarContent } from "../../../StyledComponents/ScrollerBarContent/ScrollerBarContent";

export const ShortTrackDocsExample = () => {
    const [getController, setController] = createSignal<ScrollerController>();

    return (
        <div class={styles.stripLayout}>
            <PageScrollerButton id={"shortTrackBack"} controller={getController} step={"previous"} />

            <div class={styles.scrollerCell}>
                <Scroller
                    padding={FOCUS_RING_WIDTH}
                    renderBar={(getRenderProps, refs) => (
                        <PageScrollerBarContent
                            renderProps={getRenderProps}
                            refs={refs}
                            trackLength={SHORT_TRACK_LENGTH}
                        />
                    )}
                    onMount={setController}
                >
                    {ITEM_LABELS.map((label) => (
                        <div class={styles.chip}>{label}</div>
                    ))}
                </Scroller>
            </div>

            <PageScrollerButton id={"shortTrackForward"} controller={getController} step={"next"} />
        </div>
    );
};
