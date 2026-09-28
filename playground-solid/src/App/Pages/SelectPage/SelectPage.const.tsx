import type { JSX } from "solid-js";

import type { AnchorPlacement, SelectOption } from "@thewaver/ss-components-solid";

import { PagePopoverSurface } from "../../StyledComponents/PopoverSurface/PopoverSurface";
import { PageTooltipContent } from "../../StyledComponents/TooltipContent/TooltipContent";

export * from "@thewaver/ss-playground/App/Pages/SelectPage/SelectOptions.const";

export const COUNTRIES_WITH_REACHABLE: SelectOption<string>[] = [
    { value: "Belgium" },
    {
        value: "Denmark",
        isDisabled: true,
        isReachableWhenDisabled: true,
        tooltipDefs: {
            placement: () => ({ x: "right-out", y: "center" }),
            offset: () => ({ x: 10, y: 0 }),
            renderContent: (getVisibilityTarget, getTransitionDurationMs) => (
                <PageTooltipContent
                    visibilityTarget={getVisibilityTarget}
                    transitionDurationMs={getTransitionDurationMs}
                >
                    Not shipping here until the new depot opens.
                </PageTooltipContent>
            ),
        },
    },
    { value: "Estonia" },
    {
        value: "Finland",
        isDisabled: true,
        isReachableWhenDisabled: true,
        tooltipDefs: {
            placement: () => ({ x: "right-out", y: "center" }),
            offset: () => ({ x: 10, y: 0 }),
            renderContent: (getVisibilityTarget, getTransitionDurationMs) => (
                <PageTooltipContent
                    visibilityTarget={getVisibilityTarget}
                    transitionDurationMs={getTransitionDurationMs}
                >
                    Out of stock for the rest of the quarter.
                </PageTooltipContent>
            ),
        },
    },
    { value: "Portugal" },
    { value: "Sweden" },
];

export const renderSelectPopup = (
    renderOptions: () => JSX.Element,
    getVisibilityTarget: () => 0 | 1,
    getTransitionDurationMs: () => number,
    getPlacement: () => AnchorPlacement,
) => (
    <PagePopoverSurface
        visibilityTarget={getVisibilityTarget}
        transitionDurationMs={getTransitionDurationMs}
        placement={getPlacement}
    >
        {renderOptions()}
    </PagePopoverSurface>
);
