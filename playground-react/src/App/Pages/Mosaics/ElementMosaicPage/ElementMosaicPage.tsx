import { useMemo, useState } from "react";

import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
} from "@thewaver/ss-playground/App/Pages/Mosaics/ElementMosaicPage/ElementMosaicPage.const";
import { MOSAIC_EXTENT, TILES } from "@thewaver/ss-playground/App/Pages/Mosaics/Mosaics.const";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { useMosaicsControls } from "../Mosaics.utils";
import { PageMosaicsPanel } from "../MosaicsPanel";
import type { MosaicSharedProps } from "../MosaicsReact.types";
import type { WalkedExampleWrapperProps } from "./ElementMosaicPageReact.types";
import { ElementsExample } from "./Examples/Elements";
import { WalkedExample } from "./Examples/Walked";

const ElementsExampleWrapper = (props: MosaicSharedProps) => {
    const items = useMemo(() => TILES.slice(0, props.itemCount), [props.itemCount]);

    return (
        <PageMeasureBox
            width={props.sizeAnchor === "width" ? MOSAIC_EXTENT : undefined}
            height={props.sizeAnchor === "height" ? MOSAIC_EXTENT : undefined}
        >
            <ElementsExample
                items={items}
                gap={props.gap}
                sizeAnchor={props.sizeAnchor}
                transitionDurationMs={props.transitionDurationMs}
            />
        </PageMeasureBox>
    );
};

const WalkedExampleWrapper = (props: WalkedExampleWrapperProps) => {
    const items = useMemo(() => TILES.slice(0, props.itemCount), [props.itemCount]);

    return (
        <PageMeasureBox
            width={props.sizeAnchor === "width" ? MOSAIC_EXTENT : undefined}
            height={props.sizeAnchor === "height" ? MOSAIC_EXTENT : undefined}
        >
            <WalkedExample
                items={items}
                gap={props.gap}
                sizeAnchor={props.sizeAnchor}
                transitionDurationMs={props.transitionDurationMs}
                pickedNames={props.pickedNames}
                onActivate={(index) => props.onActivate(index)}
            />
        </PageMeasureBox>
    );
};

export const ElementMosaicPage = () => {
    const controls = useMosaicsControls();

    const [pickedNames, setPickedNames] = useState<string[]>([]);

    const togglePicked = (index: number) => {
        const name = TILES[index]?.name;

        if (name === undefined) return;

        setPickedNames((names) =>
            names.includes(name) ? names.filter((picked) => picked !== name) : [...names, name],
        );
    };

    const examples = [
        {
            key: "elements",
            name: EXAMPLE_NAMES.elements,
            readout: () =>
                "every tile is handed its own width and height, and the arrangement only decides where each one goes",
            component: () => <ElementsExampleWrapper {...controls.sharedProps} />,
            path: `${EXAMPLES_ROOT}/Elements.tsx`,
        },
        {
            key: "walked",
            name: EXAMPLE_NAMES.walked,
            readout: () =>
                `${pickedNames.length ? `grown: ${pickedNames.join(", ")}` : "nothing grown"} — Tab in, then Left and Right follow the reading order, Up and Down go to the tile below or above, and Enter, Space or a press grows or shrinks a tile so the rest re-pack around it`,
            component: () => (
                <WalkedExampleWrapper {...controls.sharedProps} pickedNames={pickedNames} onActivate={togglePicked} />
            ),
            path: `${EXAMPLES_ROOT}/Walked.tsx`,
        },
    ];

    return (
        <>
            <PageMosaicsPanel controls={controls} />

            <PageExamples items={examples} layout={"flow"} />
        </>
    );
};
