import { useState } from "react";

import { Button, Preview } from "@thewaver/ss-components-react";
import { COLLAPSED_HEIGHT, LONG_PARAGRAPHS } from "@thewaver/ss-playground/App/Pages/PreviewPage/PreviewPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/PreviewPage/PreviewPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";

export const ControlledDocsExample = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <>
            <div className={styles.panel}>
                <Preview
                    expanded={[isExpanded, setIsExpanded]}
                    collapsedHeight={COLLAPSED_HEIGHT}
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
                        <PageButtonContent flags={flags}>
                            {flags.isExpanded ? "Show less" : "Read more"}
                        </PageButtonContent>
                    )}
                />
            </div>

            <Button
                id={"toggleFromHere"}
                renderContent={(flags) => <PageButtonContent flags={flags}>Toggle from here</PageButtonContent>}
                onClick={() => {
                    setIsExpanded((wasExpanded) => !wasExpanded);
                }}
            />
        </>
    );
};
