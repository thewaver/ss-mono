import { createSignal } from "solid-js";

import { Toggle } from "@thewaver/ss-components-solid";

import { PageToggleContent } from "../../../StyledComponents/ToggleContent/ToggleContent";
import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import type { ToggleTooltipDocsExampleProps } from "../TogglePageSolid.types";

type Props = ToggleTooltipDocsExampleProps;

export const TooltipDocsExample = (props: Props) => {
    const checkedSignal = createSignal(true);

    return (
        <Toggle
            checked={checkedSignal}
            ariaLabel={"Toggle with a tooltip"}
            isDisabled={props.isDisabled}
            isReachableWhenDisabled={props.isReachableWhenDisabled}
            renderContent={(getFlags) => <PageToggleContent flags={getFlags}>Toggle with a tooltip</PageToggleContent>}
            tooltipDefs={() => ({
                placement: () => ({ x: "center", y: "top_out" }),
                offset: () => ({ x: 0, y: 10 }),
                renderContent: (
                    getVisibilityTarget,
                    getTransitionDurationMs,
                    _getPlacement,
                    _getFlags,
                    getArrowAim,
                ) => (
                    <PageTooltipContent
                        visibilityTarget={getVisibilityTarget}
                        transitionDurationMs={getTransitionDurationMs}
                        arrowAim={getArrowAim}
                    >
                        A tooltip on a toggle.
                    </PageTooltipContent>
                ),
            })}
        />
    );
};
