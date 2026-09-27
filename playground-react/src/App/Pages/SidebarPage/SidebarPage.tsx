import { useState } from "react";

import type { SidebarEdge, SidebarLayout } from "@thewaver/ss-components-react";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { DefaultExample } from "./Examples/Default";

const EXAMPLES_ROOT = "/src/App/Pages/SidebarPage/Examples";

const VARIANTS: {
    key: string;
    name: string;
    edge: SidebarEdge;
    layout: SidebarLayout;
    isExpandedOnHover: boolean;
    note: string;
}[] = [
    {
        key: "push",
        name: "Pushing its neighbor",
        edge: "left",
        layout: "push",
        isExpandedOnHover: false,
        note: "the content beside it narrows as it grows",
    },
    {
        key: "overlay",
        name: "Over its neighbor, from the right",
        edge: "right",
        layout: "overlay",
        isExpandedOnHover: false,
        note: "it only ever takes its collapsed width, and grows over the content",
    },
    {
        key: "hover",
        name: "Expanding on hover",
        edge: "left",
        layout: "overlay",
        isExpandedOnHover: true,
        note: "resting on it expands it without touching the state; the button still pins it open",
    },
];

export const SidebarPage = () => {
    const [expandedByKey, setExpandedByKey] = useState<Record<string, boolean>>(() =>
        Object.fromEntries(VARIANTS.map((variant) => [variant.key, false])),
    );

    const examples = VARIANTS.map((variant) => {
        const isExpanded = expandedByKey[variant.key];

        const setIsExpanded = (value: boolean) =>
            setExpandedByKey((previous) => ({ ...previous, [variant.key]: value }));

        return {
            key: variant.key,
            name: variant.name,
            readout: () => `expanded: ${isExpanded} — ${variant.note}`,
            component: () => (
                <DefaultExample
                    edge={variant.edge}
                    layout={variant.layout}
                    isExpandedOnHover={variant.isExpandedOnHover}
                    expandedState={[isExpanded, setIsExpanded]}
                />
            ),
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        };
    });

    return <PageExamples items={examples} />;
};
