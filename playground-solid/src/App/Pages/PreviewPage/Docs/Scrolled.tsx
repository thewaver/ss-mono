import { For } from "solid-js";

import { Preview } from "@thewaver/ss-components-solid";
import {
    AFTERWARDS,
    COLLAPSED_HEIGHT,
    LONG_PARAGRAPHS,
} from "@thewaver/ss-playground/App/Pages/PreviewPage/PreviewPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/PreviewPage/PreviewPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import type { PreviewScrolledDocsExampleProps } from "../PreviewPageSolid.types";

type Props = PreviewScrolledDocsExampleProps;

export const ScrolledDocsExample = (props: Props) => (
    <div class={styles.scrollBox} data-scroll-box>
        <div class={styles.panel}>
            <Preview
                collapsedHeight={COLLAPSED_HEIGHT}
                isScrolledIntoViewOnCollapse={props.isScrolledIntoViewOnCollapse}
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

        <div class={styles.afterwards}>
            <For each={AFTERWARDS}>{(paragraph) => <div>{paragraph}</div>}</For>
        </div>
    </div>
);
