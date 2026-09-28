import { Preview } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/PreviewPage/PreviewPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import type { PreviewExampleProps } from "../PreviewPage.types";

type Props = PreviewExampleProps;

export const TextExample = (props: Props) => {
    return (
        <div className={styles.panel}>
            <Preview
                expandedState={props.expandedState}
                collapsedHeight={props.collapsedHeight}
                isScrolledIntoViewOnCollapse={props.isScrolledIntoViewOnCollapse}
                renderContent={() => (
                    <div className={styles.paragraphs}>
                        {props.paragraphs.map((paragraph) => (
                            <div key={paragraph}>{paragraph}</div>
                        ))}
                    </div>
                )}
                renderOverlay={(visibilityTarget, transitionDurationMs) => (
                    <div
                        className={styles.fade}
                        style={{
                            opacity: visibilityTarget,
                            transition: `opacity ${transitionDurationMs}ms`,
                        }}
                    />
                )}
                renderTrigger={(flags) => (
                    <PageButtonContent flags={flags}>{flags.isExpanded ? "Show less" : "Read more"}</PageButtonContent>
                )}
            />
        </div>
    );
};
