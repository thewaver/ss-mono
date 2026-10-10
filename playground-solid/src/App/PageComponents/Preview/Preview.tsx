import { createSignal } from "solid-js";

import { ElementObserverSolidUtils, ViewportWrapper } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/PageComponents/Preview/Preview.css";

import { PreviewContextProvider } from "./Preview.context";
import type { PagePreviewProps } from "./Preview.types";

export const PagePreview = (props: PagePreviewProps) => {
    const [getBodyRef, setBodyRef] = createSignal<HTMLElement>();

    const getBodySize = ElementObserverSolidUtils.createBorderBoxSizeObserver(getBodyRef);

    const getSize = () => ({
        width: styles.PREVIEW_WIDTH,
        height: Math.max(styles.PREVIEW_MIN_HEIGHT, getBodySize().height + styles.PREVIEW_PADDING * 2),
    });

    return (
        <ViewportWrapper size={getSize}>
            <PreviewContextProvider value={true}>
                <div class={styles.previewContent}>
                    <div ref={setBodyRef} class={styles.previewBody}>
                        {props.component()}
                    </div>
                </div>
            </PreviewContextProvider>
        </ViewportWrapper>
    );
};
