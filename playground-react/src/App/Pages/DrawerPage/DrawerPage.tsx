import { useState } from "react";

import type { DrawerEdge } from "@thewaver/ss-components-react";
import { DRAWER_EDGES } from "@thewaver/ss-components-react";
import { EXAMPLES_ROOT, FILLERS } from "@thewaver/ss-playground/App/Pages/DrawerPage/DrawerPage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import type { DrawerExampleProps } from "./DrawerPage.types";
import { DefaultExample } from "./Examples/Default";

export const DrawerPage = () => {
    const [visibilityByEdge, setVisibilityByEdge] = useState<Partial<Record<DrawerEdge, boolean>>>({});

    const examples = DRAWER_EDGES.map((edge) => {
        const isVisible = visibilityByEdge[edge] ?? false;

        const commonProps: DrawerExampleProps = {
            edge,
            fillers: FILLERS,
            visibility: [isVisible, (value) => setVisibilityByEdge((previous) => ({ ...previous, [edge]: value }))],
        };

        return {
            key: edge,
            name: `Edge: ${edge}`,
            readout: () => `open: ${isVisible} — the edge is geometry, the slide is paint`,
            component: () => <DefaultExample {...commonProps} />,
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        };
    });

    return <PageExamples items={examples} />;
};
