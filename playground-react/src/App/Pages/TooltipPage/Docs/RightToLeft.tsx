import { useState } from "react";

import { Tooltip } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.css";
import { TOOLTIP_HOVER_DELAY_MS } from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.const";

import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";

export const RightToLeftDocsExample = () => {
    const [anchorRef, setAnchorRef] = useState<HTMLElement | null>(null);

    return (
        <div className={styles.anchorRow} dir={"rtl"}>
            <button ref={setAnchorRef} id={"publishRightToLeft"} type={"button"} className={styles.anchorButton}>
                Publish
            </button>

            <Tooltip
                anchorRef={anchorRef ?? undefined}
                placement={{ x: "center", y: "top_out" }}
                offset={{ x: 0, y: 10 }}
                hoverShowDelayMs={TOOLTIP_HOVER_DELAY_MS}
                renderContent={(visibilityTarget, transitionDurationMs) => (
                    <PageTooltipContent visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs}>
                        <div className={styles.richTitle}>Everyone with the link</div>

                        <div className={styles.richBody}>
                            The page stays private until you share it. Publishing does not send anything to anybody; it
                            only stops the page refusing visitors.
                        </div>
                    </PageTooltipContent>
                )}
            />
        </div>
    );
};
