import type { TreeNode } from "@thewaver/ss-components-react";

import { PageTooltipContent } from "../../StyledComponents/TooltipContent/TooltipContent";

export * from "@thewaver/ss-playground/App/Pages/TreePage/TreeNodes.const";

const toDisabledNode = (
    value: string,
    reason: string,
    isReachable: boolean,
    children?: TreeNode<string>[],
): TreeNode<string> => ({
    value,
    children,
    isDisabled: true,
    isReachableWhenDisabled: isReachable,
    tooltipDefs: {
        placement: { x: "right_out", y: "center" },
        offset: { x: 10, y: 0 },
        renderContent: (visibilityTarget, transitionDurationMs) => (
            <PageTooltipContent visibilityTarget={visibilityTarget} transitionDurationMs={transitionDurationMs}>
                {reason}
            </PageTooltipContent>
        ),
    },
});

export const createFilesWithDisabled = (isReachable: boolean): TreeNode<string>[] => [
    {
        value: "src",
        children: [
            toDisabledNode("index.ts", "Generated on build, so it cannot be picked.", isReachable),
            toDisabledNode("Lib", "Locked while a release is cut. What is inside stays open to browse.", isReachable, [
                { value: "Tree.tsx" },
                { value: "Tree.utils.ts" },
            ]),
            { value: "Playground", children: [{ value: "App.tsx" }] },
        ],
    },
    { value: "package.json" },
];
