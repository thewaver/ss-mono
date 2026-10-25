import { createSignal } from "solid-js";

import { Tooltip } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.css";
import { TOOLTIP_HOVER_DELAY_MS } from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.const";

import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";

export const WordDocsExample = () => {
    const [getAnchorRef, setAnchorRef] = createSignal<HTMLElement>();

    return (
        <div class={styles.sentence}>
            {"The keep was raised by masons paid in "}

            <span ref={setAnchorRef} id={"marks"} class={styles.anchorWord} tabIndex={0}>
                marks
            </span>

            {" rather than in coin, which is why the accounts survive at all."}

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
                        A weight of silver, not a coin — eight ounces, counted rather than struck.
                    </PageTooltipContent>
                )}
            />
        </div>
    );
};
