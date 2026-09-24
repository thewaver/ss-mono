import { createMemo, createSignal } from "solid-js";

import { DRAWER_EDGES } from "@thewaver/ss-components";

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
    const visibilityByEdge = new Map(DRAWER_EDGES.map((edge) => [edge, createSignal(false)]));

    const getExamples = createMemo(() =>
        DRAWER_EDGES.map((edge) => {
            const commonProps: DrawerExampleProps = {
                edge: () => edge,
                fillers: () => FILLERS,
                visibilitySignal: visibilityByEdge.get(edge)!,
            };

            return {
                key: edge,
                name: `Edge: ${edge}`,
                readout: () => `open: ${visibilityByEdge.get(edge)![0]()} — the edge is geometry, the slide is paint`,
                component: () => <DefaultExample {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Default.tsx`,
            };
        }),
    );

    return <PageExamples items={getExamples} />;
};
