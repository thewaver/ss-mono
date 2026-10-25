import { createSignal } from "solid-js";

import { Button, Scroller } from "@thewaver/ss-components-solid";
import type { ScrollerController } from "@thewaver/ss-components-solid";
import { ITEM_LABELS } from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.css";
import { FOCUS_RING_WIDTH } from "@thewaver/ss-playground/App/Theme.css";

import { PageScrollerButton } from "../../../PageComponents/ScrollerButton/ScrollerButton";
import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";

export const FocusableChildrenDocsExample = () => {
    const [getController, setController] = createSignal<ScrollerController>();

    return (
        <div class={styles.stripLayout}>
            <PageScrollerButton id={"focusableChildrenBack"} controller={getController} step={"previous"} />

            <div class={styles.scrollerCell}>
                <Scroller padding={FOCUS_RING_WIDTH} onMount={setController}>
                    {ITEM_LABELS.map((label) => (
                        <div class={styles.item}>
                            <Button
                                renderContent={(getFlags) => (
                                    <PageButtonContent flags={getFlags}>{label}</PageButtonContent>
                                )}
                            />
                        </div>
                    ))}
                </Scroller>
            </div>

            <PageScrollerButton id={"focusableChildrenForward"} controller={getController} step={"next"} />
        </div>
    );
};
