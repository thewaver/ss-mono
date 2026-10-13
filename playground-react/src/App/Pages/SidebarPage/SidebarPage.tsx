import { useState } from "react";

import { EXAMPLES_ROOT, VARIANTS } from "@thewaver/ss-playground/App/Pages/SidebarPage/SidebarPage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { DefaultExample } from "./Examples/Default";

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
                    expanded={[isExpanded, setIsExpanded]}
                />
            ),
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        };
    });

    return <PageExamples items={examples} />;
};
