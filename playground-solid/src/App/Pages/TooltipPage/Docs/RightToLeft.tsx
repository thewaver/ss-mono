import { createSignal } from "solid-js";

import { Tooltip } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.css";
import { TOOLTIP_HOVER_DELAY_MS } from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.const";

import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";

export const RightToLeftDocsExample = () => {
    const [getAnchorRef, setAnchorRef] = createSignal<HTMLElement>();

    return (
        <div class={styles.anchorRow} dir={"rtl"}>
            <button ref={setAnchorRef} id={"publishRightToLeft"} type={"button"} class={styles.anchorButton}>
                Publish
            </button>

            <Tooltip
                anchorRef={getAnchorRef}
                placement={{ x: "center", y: "top_out" }}
                offset={{ x: 0, y: 10 }}
                hoverShowDelayMs={TOOLTIP_HOVER_DELAY_MS}
                renderContent={(getVisibilityTarget, getTransitionDurationMs) => (
                    <PageTooltipContent
                        visibilityTarget={getVisibilityTarget}
                        transitionDurationMs={getTransitionDurationMs}
                    >
                        <div class={styles.richTitle}>Everyone with the link</div>

                        <div class={styles.richBody}>
                            The page stays private until you share it. Publishing does not send anything to anybody; it
                            only stops the page refusing visitors.
                        </div>
                    </PageTooltipContent>
                )}
            />
        </div>
    );
};
