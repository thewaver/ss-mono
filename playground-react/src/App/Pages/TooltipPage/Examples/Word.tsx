import { useState } from "react";

import { Tooltip } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground-core/App/Pages/TooltipPage/TooltipPage.css";

import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import type { TooltipExampleProps } from "../TooltipPage.types";

type Props = TooltipExampleProps;

export const WordExample = (props: Props) => {
    const [anchorRef, setAnchorRef] = useState<HTMLElement | null>(null);

    return (
        <div className={styles.sentence}>
            {"The keep was raised by masons paid in "}

            <span ref={setAnchorRef} className={styles.anchorWord} tabIndex={0}>
                marks
            </span>

            {" rather than in coin, which is why the accounts survive at all."}

            <Tooltip
                anchorRef={anchorRef ?? undefined}
                placement={props.placement}
                offset={props.offset}
                transitionDurationMs={props.transitionDurationMs}
                focusShowDelayMs={props.focusShowDelayMs}
                hoverShowDelayMs={props.hoverShowDelayMs}
                skipDelayWindowMs={props.skipDelayWindowMs}
                renderContent={(visibilityTarget, transitionDurationMs) => (
                    <PageTooltipContent visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs}>
                        A weight of silver, not a coin — eight ounces, counted rather than struck.
                    </PageTooltipContent>
                )}
            />
        </div>
    );
};
