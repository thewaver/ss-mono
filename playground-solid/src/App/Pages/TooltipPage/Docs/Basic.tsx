import { createSignal } from "solid-js";

import { Tooltip } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.css";

import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import type { TooltipBasicDocsExampleProps } from "../TooltipPageSolid.types";

type Props = TooltipBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const [getAnchorRef, setAnchorRef] = createSignal<HTMLElement>();

    return (
        <div class={styles.anchorRow}>
            <button ref={setAnchorRef} id={"archive"} type={"button"} class={styles.anchorButton}>
                Archive
            </button>

            <Tooltip
                anchorRef={getAnchorRef}
                placement={props.placement}
                offset={props.offset}
                transitionDurationMs={props.transitionDurationMs}
                focusShowDelayMs={props.focusShowDelayMs}
                hoverShowDelayMs={props.hoverShowDelayMs}
                renderContent={(getVisibilityTarget, getTransitionDurationMs, _getPlacement, getArrowAim) => (
                    <PageTooltipContent
                        visibilityTarget={getVisibilityTarget}
                        transitionDurationMs={getTransitionDurationMs}
                        reveal={props.reveal}
                        arrow={props.arrow}
                        arrowWidth={props.arrowWidth}
                        arrowLength={props.arrowLength}
                        arrowAim={getArrowAim}
                    >
                        Moves the thread out of the inbox.
                    </PageTooltipContent>
                )}
            />
        </div>
    );
};
