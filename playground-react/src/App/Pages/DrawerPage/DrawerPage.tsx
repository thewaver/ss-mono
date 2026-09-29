import { useState } from "react";

import type { DrawerEdge } from "@thewaver/ss-components-react";
import { DRAWER_EDGES } from "@thewaver/ss-components-react";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import type { DrawerExampleProps } from "./DrawerPage.types";
import { DefaultExample } from "./Examples/Default";

const FILLER_NAMES = ["Alder", "Birch", "Cedar", "Elm", "Hazel", "Larch", "Maple", "Rowan", "Willow", "Yew"];
const FILLER_COUNT = 60;
const EXAMPLES_ROOT = "/src/App/Pages/DrawerPage/Examples";

const FILLERS = Array.from(
    { length: FILLER_COUNT },
    (_, index) => `${FILLER_NAMES[index % FILLER_NAMES.length]} ${index + 1}`,
);

export const DrawerPage = () => {
    const [visibilityByEdge, setVisibilityByEdge] = useState<Partial<Record<DrawerEdge, boolean>>>({});

    const examples = DRAWER_EDGES.map((edge) => {
        const isVisible = visibilityByEdge[edge] ?? false;

        const commonProps: DrawerExampleProps = {
            edge,
            fillers: FILLERS,
            visibility: [
                isVisible,
                (value) => setVisibilityByEdge((previous) => ({ ...previous, [edge]: value })),
            ],
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
