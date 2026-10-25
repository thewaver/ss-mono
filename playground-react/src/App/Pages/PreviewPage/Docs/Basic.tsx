import { Preview } from "@thewaver/ss-components-react";
import { LONG_PARAGRAPHS } from "@thewaver/ss-playground/App/Pages/PreviewPage/PreviewPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/PreviewPage/PreviewPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import type { PreviewBasicDocsExampleProps } from "../PreviewPageReact.types";

type Props = PreviewBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => (
    <div className={styles.panel}>
        <Preview
            collapsedHeight={props.collapsedHeight}
            renderContent={() => (
                <div className={styles.paragraphs}>
                    {LONG_PARAGRAPHS.map((paragraph) => (
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
