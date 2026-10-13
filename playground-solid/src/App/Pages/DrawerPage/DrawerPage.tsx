import { createMemo, createSignal } from "solid-js";

import { DRAWER_EDGES } from "@thewaver/ss-components-solid";
import { EXAMPLES_ROOT, FILLERS } from "@thewaver/ss-playground/App/Pages/DrawerPage/DrawerPage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import type { DrawerExampleProps } from "./DrawerPage.types";
import { DefaultExample } from "./Examples/Default";

export const DrawerPage = () => {
    const visibilityByEdge = new Map(DRAWER_EDGES.map((edge) => [edge, createSignal(false)]));

    const getExamples = createMemo(() =>
        DRAWER_EDGES.map((edge) => {
            const commonProps: DrawerExampleProps = {
                edge: () => edge,
                fillers: () => FILLERS,
                visibility: visibilityByEdge.get(edge)!,
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
