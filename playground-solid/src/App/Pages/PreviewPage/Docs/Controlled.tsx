import { For, createSignal } from "solid-js";

import { Button, Preview } from "@thewaver/ss-components-solid";
import { COLLAPSED_HEIGHT, LONG_PARAGRAPHS } from "@thewaver/ss-playground/App/Pages/PreviewPage/PreviewPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/PreviewPage/PreviewPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";

export const ControlledDocsExample = () => {
    const [getIsExpanded, setIsExpanded] = createSignal(false);

    return (
        <>
            <div class={styles.panel}>
                <Preview
                    expanded={[getIsExpanded, setIsExpanded]}
                    collapsedHeight={COLLAPSED_HEIGHT}
                    renderContent={() => (
                        <div class={styles.paragraphs}>
                            <For each={LONG_PARAGRAPHS}>{(paragraph) => <div>{paragraph}</div>}</For>
                        </div>
                    )}
                    renderOverlay={(getVisibilityTarget, getTransitionDurationMs) => (
                        <div
                            class={styles.fade}
                            style={{
                                opacity: getVisibilityTarget(),
                                transition: `opacity ${getTransitionDurationMs()}ms`,
                            }}
                        />
                    )}
                    renderTrigger={(getFlags) => (
                        <PageButtonContent flags={getFlags}>
                            {getFlags().isExpanded ? "Show less" : "Read more"}
                        </PageButtonContent>
                    )}
                />
            </div>

            <Button
                id={"toggleFromHere"}
                renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Toggle from here</PageButtonContent>}
                onClick={() => {
                    setIsExpanded((isExpanded) => !isExpanded);
                }}
            />
        </>
    );
};
