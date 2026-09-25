import { createMemo, createSignal } from "solid-js";

import type { SidebarEdge, SidebarLayout } from "@thewaver/ss-components";

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
    const expandedByKey = new Map(VARIANTS.map((variant) => [variant.key, createSignal(false)]));

    const getExamples = createMemo(() =>
        VARIANTS.map((variant) => ({
            key: variant.key,
            name: variant.name,
            readout: () => `expanded: ${expandedByKey.get(variant.key)![0]()} — ${variant.note}`,
            component: () => (
                <DefaultExample
                    edge={() => variant.edge}
                    layout={() => variant.layout}
                    isExpandedOnHover={() => variant.isExpandedOnHover}
                    expandedSignal={expandedByKey.get(variant.key)!}
                />
            ),
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        })),
    );

    return <PageExamples items={getExamples} />;
};
