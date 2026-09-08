import { createMemo, createSignal } from "solid-js";

import type { ArcDefs } from "@thewaver/ss-components";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageMeasureBox } from "../../PageComponents/MeasureBox/MeasureBox";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageNumberField } from "../../StyledComponents/Field/Field";
import { MenuExample } from "./Examples/Menu";
import { WheelExample } from "./Examples/Wheel";
import type { PlacementExampleProps } from "./PlacementPage.types";

const FIELD_WIDTH = 130;
const EXAMPLES_ROOT = "/src/App/Pages/PlacementPage/Examples";
const WHEEL_SIZE = 340;

const MIN_HOLE_RADIUS_PX = 0;
const MAX_HOLE_RADIUS_PX = 140;
const HOLE_RADIUS_STEP_PX = 4;
const MIN_BAND_WIDTH_PX = 32;
const MAX_BAND_WIDTH_PX = 160;
const BAND_WIDTH_STEP_PX = 4;
const MIN_LEVEL_GAP_PX = 0;
const MAX_LEVEL_GAP_PX = 40;
const LEVEL_GAP_STEP_PX = 2;
const MIN_WEDGE_GAP_DEGREES = 0;
const MAX_WEDGE_GAP_DEGREES = 20;
const WEDGE_GAP_STEP_DEGREES = 1;
const MIN_LABEL_RADIUS_PERCENT = 0;
const MAX_LABEL_RADIUS_PERCENT = 100;
const LABEL_RADIUS_STEP_PERCENT = 5;
const PERCENT = 100;

const STARTING_HOLE_RADIUS_PX = 64;
const STARTING_BAND_WIDTH_PX = 84;
const STARTING_LEVEL_GAP_PX = 8;
const STARTING_WEDGE_GAP_DEGREES = 3;
const STARTING_LABEL_RADIUS_PERCENT = 50;

export const PlacementPage = () => {
    const [getHoleRadiusPx, setHoleRadiusPx] = createSignal(STARTING_HOLE_RADIUS_PX);
    const [getBandWidthPx, setBandWidthPx] = createSignal(STARTING_BAND_WIDTH_PX);
    const [getLevelGapPx, setLevelGapPx] = createSignal(STARTING_LEVEL_GAP_PX);
    const [getWedgeGapDegrees, setWedgeGapDegrees] = createSignal(STARTING_WEDGE_GAP_DEGREES);
    const [getLabelRadiusPercent, setLabelRadiusPercent] = createSignal(STARTING_LABEL_RADIUS_PERCENT);

    const getLayoutDefs = createMemo<ArcDefs>(() => ({
        holeRadiusPx: getHoleRadiusPx(),
        bandWidthPx: getBandWidthPx(),
        levelGapPx: getLevelGapPx(),
        wedgeGapDegrees: getWedgeGapDegrees(),
        labelRadiusRatio: getLabelRadiusPercent() / PERCENT,
    }));

    const getExamples = createMemo(() => {
        const commonProps: PlacementExampleProps = { getLayoutDefs };

        return [
            {
                key: "menu",
                name: "A menu of wedges",
                readout: () =>
                    "the same layout laid over a Menu — every level is a band, and the hole holds the control that closes it",
                component: () => <MenuExample {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Menu.tsx`,
            },
            {
                key: "wheel",
                name: "A wheel of wedges",
                readout: () =>
                    "and over an OverheadWheel, which asks the same function for the shape of one wedge and turns copies of it",
                component: () => (
                    <PageMeasureBox width={() => WHEEL_SIZE}>
                        <WheelExample {...commonProps} />
                    </PageMeasureBox>
                ),
                path: `${EXAMPLES_ROOT}/Wheel.tsx`,
            },
        ];
    });

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp key={"holeRadiusPx"} label={"Hole radius (px)"}>
                    <PageNumberField
                        value={getHoleRadiusPx}
                        min={() => MIN_HOLE_RADIUS_PX}
                        max={() => MAX_HOLE_RADIUS_PX}
                        step={() => HOLE_RADIUS_STEP_PX}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Hole radius"}
                        onInput={setHoleRadiusPx}
                    />
                </PageProp>

                <PageProp key={"bandWidthPx"} label={"Band width (px)"}>
                    <PageNumberField
                        value={getBandWidthPx}
                        min={() => MIN_BAND_WIDTH_PX}
                        max={() => MAX_BAND_WIDTH_PX}
                        step={() => BAND_WIDTH_STEP_PX}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Band width"}
                        onInput={setBandWidthPx}
                    />
                </PageProp>

                <PageProp key={"levelGapPx"} label={"Gap between levels (px)"}>
                    <PageNumberField
                        value={getLevelGapPx}
                        min={() => MIN_LEVEL_GAP_PX}
                        max={() => MAX_LEVEL_GAP_PX}
                        step={() => LEVEL_GAP_STEP_PX}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Gap between levels"}
                        onInput={setLevelGapPx}
                    />
                </PageProp>

                <PageProp key={"wedgeGapDegrees"} label={"Gap between wedges (°)"}>
                    <PageNumberField
                        value={getWedgeGapDegrees}
                        min={() => MIN_WEDGE_GAP_DEGREES}
                        max={() => MAX_WEDGE_GAP_DEGREES}
                        step={() => WEDGE_GAP_STEP_DEGREES}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Gap between wedges"}
                        onInput={setWedgeGapDegrees}
                    />
                </PageProp>

                <PageProp key={"labelRadiusPercent"} label={"Label across the band (%)"}>
                    <PageNumberField
                        value={getLabelRadiusPercent}
                        min={() => MIN_LABEL_RADIUS_PERCENT}
                        max={() => MAX_LABEL_RADIUS_PERCENT}
                        step={() => LABEL_RADIUS_STEP_PERCENT}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Label across the band"}
                        onInput={setLabelRadiusPercent}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} />
        </>
    );
};
