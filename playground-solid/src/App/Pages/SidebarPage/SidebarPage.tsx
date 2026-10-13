import { createMemo, createSignal } from "solid-js";

import { EXAMPLES_ROOT, VARIANTS } from "@thewaver/ss-playground/App/Pages/SidebarPage/SidebarPage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { DefaultExample } from "./Examples/Default";

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
                    expanded={expandedByKey.get(variant.key)!}
                />
            ),
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        })),
    );

    return <PageExamples items={getExamples} />;
};
