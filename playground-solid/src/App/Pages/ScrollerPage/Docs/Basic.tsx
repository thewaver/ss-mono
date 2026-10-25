import { For, createSignal } from "solid-js";

import { Scroller, access } from "@thewaver/ss-components-solid";
import type { ScrollerController } from "@thewaver/ss-components-solid";
import { toItemLabels } from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.css";
import { FOCUS_RING_WIDTH } from "@thewaver/ss-playground/App/Theme.css";

import { PageScrollerButton } from "../../../PageComponents/ScrollerButton/ScrollerButton";
import type { ScrollerBasicDocsExampleProps } from "../ScrollerPageSolid.types";

type Props = ScrollerBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const [getController, setController] = createSignal<ScrollerController>();

    return (
        <div class={styles.stripLayout}>
            <PageScrollerButton id={"basicBack"} controller={getController} step={"previous"} />

            <div class={styles.scrollerCell}>
                <Scroller padding={FOCUS_RING_WIDTH} overlapCount={props.overlapCount} onMount={setController}>
                    <For each={toItemLabels(access(props.itemCount))}>
                        {(label) => <div class={styles.chip}>{label}</div>}
                    </For>
                </Scroller>
            </div>

            <PageScrollerButton id={"basicForward"} controller={getController} step={"next"} />
        </div>
    );
};
