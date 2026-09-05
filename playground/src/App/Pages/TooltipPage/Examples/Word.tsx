import { createSignal } from "solid-js";

import { Tooltip } from "@thewaver/ss-components";

import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import type { TooltipExampleProps } from "../TooltipPage.types";

import * as styles from "../TooltipPage.css";

type Props = TooltipExampleProps;

export const WordExample = (props: Props) => {
    const [getAnchorRef, setAnchorRef] = createSignal<HTMLElement>();

    return (
        <div class={styles.sentence}>
            {"The keep was raised by masons paid in "}

            <span ref={setAnchorRef} class={styles.anchorWord} tabIndex={0}>
                marks
            </span>

            {" rather than in coin, which is why the accounts survive at all."}

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
                        A weight of silver, not a coin — eight ounces, counted rather than struck.
                    </PageTooltipContent>
                )}
            />
        </div>
    );
};
