import { createSignal } from "solid-js";

import { Tooltip } from "@thewaver/ss-components";

import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import type { TooltipExampleProps } from "../TooltipPage.types";

import * as styles from "../TooltipPage.css";

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
                renderContent={(getVisibilityTarget, getTransitionDurationMs) => (
                    <PageTooltipContent
                        visibilityTarget={getVisibilityTarget}
                        transitionDurationMs={getTransitionDurationMs}
                    >
                        Moves the thread out of the inbox.
                    </PageTooltipContent>
                )}
            />
        </div>
    );
};
