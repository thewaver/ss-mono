import { createMemo } from "solid-js";

import { access } from "@thewaver/ss-components";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { MOSAIC_EXTENT, TILES } from "../Mosaics.const";
import type { MosaicSharedProps } from "../Mosaics.types";
import { createMosaicsControls } from "../Mosaics.utils";
import { PageMosaicsPanel } from "../MosaicsPanel";
import { ElementsExample } from "./Examples/Elements";

const EXAMPLES_ROOT = "/src/App/Pages/Mosaics/ElementMosaicPage/Examples";

const ElementsExampleWrapper = (props: MosaicSharedProps) => {
    const getItems = createMemo(() => TILES.slice(0, access(props.itemCount)));

    return (
        <PageMeasureBox
            width={access(props.sizeAnchor) === "width" ? () => MOSAIC_EXTENT : undefined}
            height={access(props.sizeAnchor) === "height" ? () => MOSAIC_EXTENT : undefined}
        >
            <ElementsExample items={getItems} gap={props.gap} sizeAnchor={props.sizeAnchor} />
        </PageMeasureBox>
    );
};

export const ElementMosaicPage = () => {
    const controls = createMosaicsControls();

    const getExamples = createMemo(() => [
        {
            key: "elements",
            name: "Elements the consumer sizes",
            readout: () =>
                "every tile is handed its own width and height, and the arrangement only decides where each one goes",
            component: () => <ElementsExampleWrapper {...controls.getSharedProps()} />,
            path: `${EXAMPLES_ROOT}/Elements.tsx`,
        },
    ]);

    return (
        <>
            <PageMosaicsPanel controls={controls} />

            <PageExamples items={getExamples} layout={"flow"} />
        </>
    );
};
