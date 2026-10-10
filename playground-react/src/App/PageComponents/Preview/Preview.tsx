import { Suspense, useRef } from "react";

import { ElementObserverReactUtils, ViewportWrapper } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/PageComponents/Preview/Preview.css";

import { PreviewContextProvider } from "./Preview.context";
import type { PagePreviewProps } from "./Preview.types";

export const PagePreview = (props: PagePreviewProps) => {
    const bodyRef = useRef<HTMLDivElement | null>(null);

    const bodySize = ElementObserverReactUtils.useBorderBoxSize(bodyRef);

    const size = {
        width: styles.PREVIEW_WIDTH,
        height: Math.max(styles.PREVIEW_MIN_HEIGHT, bodySize.height + styles.PREVIEW_PADDING * 2),
    };

    return (
        <ViewportWrapper size={size}>
            <PreviewContextProvider value={true}>
                <div className={styles.previewContent}>
                    <div ref={bodyRef} className={styles.previewBody}>
                        <Suspense>{props.component()}</Suspense>
                    </div>
                </div>
            </PreviewContextProvider>
        </ViewportWrapper>
    );
};
