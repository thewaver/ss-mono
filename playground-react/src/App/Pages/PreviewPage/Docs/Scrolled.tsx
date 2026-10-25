import { Preview } from "@thewaver/ss-components-react";
import { COLLAPSED_HEIGHT, LONG_PARAGRAPHS } from "@thewaver/ss-playground/App/Pages/PreviewPage/PreviewPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/PreviewPage/PreviewPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import type { PreviewScrolledDocsExampleProps } from "../PreviewPageReact.types";

const AFTERWARDS = [
    "The rest of the page carries on below, which is the whole of the problem.",
    "Open the preview, read to the end of it, and close it again: everything under it jumps up by the height that just disappeared, and the control you pressed goes with it.",
    "With the scroll asked for, the box comes back to where you were standing.",
];

type Props = PreviewScrolledDocsExampleProps;

export const ScrolledDocsExample = (props: Props) => (
    <div className={styles.scrollBox} data-scroll-box>
        <div className={styles.panel}>
            <Preview
                collapsedHeight={COLLAPSED_HEIGHT}
                isScrolledIntoViewOnCollapse={props.isScrolledIntoViewOnCollapse}
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

        <div className={styles.afterwards}>
            {AFTERWARDS.map((paragraph) => (
                <div key={paragraph}>{paragraph}</div>
            ))}
        </div>
    </div>
);
