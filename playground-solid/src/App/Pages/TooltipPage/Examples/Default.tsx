import { createSignal } from "solid-js";

import { Tooltip } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/TooltipPage/TooltipPage.css";

import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import type { TooltipExampleProps } from "../TooltipPage.types";

type Props = TooltipExampleProps;

export const DefaultExample = (props: Props) => {
    const [getAnchorRef, setAnchorRef] = createSignal<HTMLElement>();

    return (
        <div class={styles.anchorRow}>
            <button ref={setAnchorRef} type={"button"} class={styles.anchorButton}>
                Archive
            </button>

            <Tooltip
                anchorRef={getAnchorRef}
                placement={props.placement}
                offset={props.offset}
                transitionDurationMs={props.transitionDurationMs}
                focusShowDelayMs={props.focusShowDelayMs}
                hoverShowDelayMs={props.hoverShowDelayMs}
                skipDelayWindowMs={props.skipDelayWindowMs}
                renderContent={(getVisibilityTarget, getTransitionDurationMs) => (
                    <PageTooltipContent
                        visibilityTarget={getVisibilityTarget}
                        transitionDurationMs={getTransitionDurationMs}
                        reveal={props.reveal}
                    >
                        Moves the thread out of the inbox.
                    </PageTooltipContent>
                )}
            />
        </div>
    );
};
