import { useMemo, useState } from "react";

import { MOSAIC_EXTENT, TILES } from "@thewaver/ss-playground-core/App/Pages/Mosaics/Mosaics.const";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import type { MosaicSharedProps } from "../Mosaics.types";
import { useMosaicsControls } from "../Mosaics.utils";
import { PageMosaicsPanel } from "../MosaicsPanel";
import type { WalkedExampleWrapperProps } from "./ElementMosaicPage.types";
import { ElementsExample } from "./Examples/Elements";
import { WalkedExample } from "./Examples/Walked";

const EXAMPLES_ROOT = "/src/App/Pages/Mosaics/ElementMosaicPage/Examples";

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
            name: "Elements the consumer sizes",
            readout: () =>
                "every tile is handed its own width and height, and the arrangement only decides where each one goes",
            component: () => <ElementsExampleWrapper {...controls.sharedProps} />,
            path: `${EXAMPLES_ROOT}/Elements.tsx`,
        },
        {
            key: "walked",
            name: "One tab stop, walked by the arrow keys",
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
