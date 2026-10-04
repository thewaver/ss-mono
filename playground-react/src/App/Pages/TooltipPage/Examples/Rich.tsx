import { useState } from "react";

import { Tooltip } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.css";

import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import type { TooltipExampleProps } from "../TooltipPage.types";

type Props = TooltipExampleProps;

export const RichExample = (props: Props) => {
    const [anchorRef, setAnchorRef] = useState<HTMLElement | null>(null);

    return (
        <div className={styles.anchorRow}>
            <button ref={setAnchorRef} type={"button"} className={styles.anchorButton}>
                Publish
            </button>

            <Tooltip
                anchorRef={anchorRef ?? undefined}
                placement={props.placement}
                offset={props.offset}
                transitionDurationMs={props.transitionDurationMs}
                focusShowDelayMs={props.focusShowDelayMs}
                hoverShowDelayMs={props.hoverShowDelayMs}
                skipDelayWindowMs={props.skipDelayWindowMs}
                renderContent={(visibilityTarget, transitionDurationMs) => (
                    <PageTooltipContent
                        visibilityTarget={visibilityTarget}
                        transitionDurationMs={transitionDurationMs}
                        reveal={props.reveal}
                    >
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
