import { For } from "solid-js";

import { Preview } from "@thewaver/ss-components-solid";
import { COLLAPSED_HEIGHT, LONG_PARAGRAPHS } from "@thewaver/ss-playground/App/Pages/PreviewPage/PreviewPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/PreviewPage/PreviewPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";

export const RightToLeftDocsExample = () => (
    <div dir={"rtl"} class={styles.panel}>
        <Preview
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
);
