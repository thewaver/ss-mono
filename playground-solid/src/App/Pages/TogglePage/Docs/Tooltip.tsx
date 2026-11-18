import { createSignal } from "solid-js";

import { Toggle } from "@thewaver/ss-components-solid";
import { TOGGLE_TOOLTIP_LABEL } from "@thewaver/ss-playground/App/Pages/TogglePage/TogglePage.const";

import { PageToggleContent } from "../../../StyledComponents/ToggleContent/ToggleContent";
import { PageTooltipContent } from "../../../StyledComponents/TooltipContent/TooltipContent";
import type { ToggleTooltipDocsExampleProps } from "../TogglePageSolid.types";

type Props = ToggleTooltipDocsExampleProps;

export const TooltipDocsExample = (props: Props) => {
    const checkedSignal = createSignal(true);

    return (
        <Toggle
            checked={checkedSignal}
            ariaLabel={TOGGLE_TOOLTIP_LABEL}
            isDisabled={props.isDisabled}
            isReachableWhenDisabled={props.isReachableWhenDisabled}
            renderContent={(getFlags) => <PageToggleContent flags={getFlags}>{TOGGLE_TOOLTIP_LABEL}</PageToggleContent>}
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
