import { useState } from "react";

import { Tooltip } from "@thewaver/ss-components-react";
import { KEEP_WAS_RAISED_MASONS_TEXT } from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.css";
import { TOOLTIP_HOVER_DELAY_MS } from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.const";

import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";

export const WordDocsExample = () => {
    const [anchorRef, setAnchorRef] = useState<HTMLElement | null>(null);

    return (
        <div className={styles.sentence}>
            {KEEP_WAS_RAISED_MASONS_TEXT}

            <span ref={setAnchorRef} id={"marks"} className={styles.anchorWord} tabIndex={0}>
                marks
            </span>

            {" rather than in coin, which is why the accounts survive at all."}

            <Tooltip
                anchorRef={anchorRef ?? undefined}
                placement={{ x: "center", y: "top_out" }}
                offset={{ x: 0, y: 10 }}
                hoverShowDelayMs={TOOLTIP_HOVER_DELAY_MS}
                renderContent={(visibilityTarget, transitionDurationMs, _placement, arrowAim) => (
                    <PageTooltipContent visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs}>
                        A weight of silver, not a coin — eight ounces, counted rather than struck.
                    </PageTooltipContent>
                )}
            />
        </div>
    );
};
