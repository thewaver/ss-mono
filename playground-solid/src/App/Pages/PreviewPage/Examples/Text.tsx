import { For } from "solid-js";

import { Preview, access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground-core/App/Pages/PreviewPage/PreviewPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import type { PreviewExampleProps } from "../PreviewPage.types";

type Props = PreviewExampleProps;

export const TextExample = (props: Props) => {
    return (
        <div class={styles.panel}>
            <Preview
                expandedSignal={props.expandedSignal}
                collapsedHeight={props.collapsedHeight}
                isScrolledIntoViewOnCollapse={props.isScrolledIntoViewOnCollapse}
                renderContent={() => (
                    <div class={styles.paragraphs}>
                        <For each={access(props.paragraphs)}>{(paragraph) => <div>{paragraph}</div>}</For>
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
};
