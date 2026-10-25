import { useState } from "react";

import { Tooltip } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.css";

import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import type { TooltipBasicDocsExampleProps } from "../TooltipPageReact.types";

type Props = TooltipBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const [anchorRef, setAnchorRef] = useState<HTMLElement | null>(null);

    return (
        <div className={styles.anchorRow}>
            <button ref={setAnchorRef} id={"archive"} type={"button"} className={styles.anchorButton}>
                Archive
            </button>

            <Tooltip
                anchorRef={anchorRef ?? undefined}
                placement={props.placement}
                offset={props.offset}
                transitionDurationMs={props.transitionDurationMs}
                focusShowDelayMs={props.focusShowDelayMs}
                hoverShowDelayMs={props.hoverShowDelayMs}
                renderContent={(visibilityTarget, transitionDurationMs, _placement, arrowAim) => (
                    <PageTooltipContent
                        visibilityTarget={visibilityTarget}
                        transitionDurationMs={transitionDurationMs}
                        reveal={props.reveal}
                        arrow={props.arrow}
                        arrowWidth={props.arrowWidth}
                        arrowLength={props.arrowLength}
                        arrowAim={arrowAim}
                    >
                        Moves the thread out of the inbox.
                    </PageTooltipContent>
                )}
            />
        </div>
    );
};
