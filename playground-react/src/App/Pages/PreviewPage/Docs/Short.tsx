import { Preview } from "@thewaver/ss-components-react";
import { COLLAPSED_HEIGHT, SHORT_PARAGRAPHS } from "@thewaver/ss-playground/App/Pages/PreviewPage/PreviewPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/PreviewPage/PreviewPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";

export const ShortDocsExample = () => (
    <div className={styles.panel}>
        <Preview
            collapsedHeight={COLLAPSED_HEIGHT}
            renderContent={() => (
                <div className={styles.paragraphs}>
                    {SHORT_PARAGRAPHS.map((paragraph) => (
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
