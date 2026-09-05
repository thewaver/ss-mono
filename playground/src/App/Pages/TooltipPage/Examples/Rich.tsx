import { createSignal } from "solid-js";

import { Tooltip } from "@thewaver/ss-components";

import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import type { TooltipExampleProps } from "../TooltipPage.types";

import * as styles from "../TooltipPage.css";

type Props = TooltipExampleProps;

export const RichExample = (props: Props) => {
    const [getAnchorRef, setAnchorRef] = createSignal<HTMLElement>();

    return (
        <div class={styles.anchorRow}>
            <button ref={setAnchorRef} type={"button"} class={styles.anchorButton}>
                Publish
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
