import type { ReactNode } from "react";

import type { AnchorPlacement, SelectOption } from "@thewaver/ss-components-react";

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
            placement: { x: "right-out", y: "center" },
            offset: { x: 10, y: 0 },
            renderContent: (visibilityTarget, transitionDurationMs) => (
                <PageTooltipContent visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs}>
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
            placement: { x: "right-out", y: "center" },
            offset: { x: 10, y: 0 },
            renderContent: (visibilityTarget, transitionDurationMs) => (
                <PageTooltipContent visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs}>
                    Out of stock for the rest of the quarter.
                </PageTooltipContent>
            ),
        },
    },
    { value: "Portugal" },
    { value: "Sweden" },
];

export const renderSelectPopup = (
    renderOptions: () => ReactNode,
    visibilityTarget: 0 | 1,
    transitionDurationMs: number,
    placement: AnchorPlacement,
) => (
    <PagePopoverSurface
        visibilityTarget={visibilityTarget}
        transitionDurationMs={transitionDurationMs}
        placement={placement}
    >
        {renderOptions()}
    </PagePopoverSurface>
);
