import { h } from "vue";

import type { SelectOption } from "@thewaver/ss-components-vue";

import PageTooltipContent from "../../StyledComponents/TooltipContent/TooltipContent.vue";

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
            renderContent: ({ visibilityTarget, transitionDurationMs }) =>
                h(
                    PageTooltipContent,
                    { visibilityTarget, transitionDurationMs },
                    () => "Not shipping here until the new depot opens.",
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
            renderContent: ({ visibilityTarget, transitionDurationMs }) =>
                h(
                    PageTooltipContent,
                    { visibilityTarget, transitionDurationMs },
                    () => "Out of stock for the rest of the quarter.",
                ),
        },
    },
    { value: "Portugal" },
    { value: "Sweden" },
];
