import { createMemo, createSignal } from "solid-js";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageMeasureBox } from "../../PageComponents/MeasureBox/MeasureBox";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageNumberField } from "../../StyledComponents/Field/Field";
import { TicketExample } from "./Examples/Ticket";
import type { ScratchCardExampleProps } from "./ScratchCardPage.types";

import { MEASURE_BOX_PADDING } from "../../PageComponents/MeasureBox/MeasureBox.css";

const EXAMPLES_ROOT = "/src/App/Pages/ScratchCardPage/Examples";

const STARTING_COLUMNS = 24;
const STARTING_ROWS = 12;
const MIN_CELLS = 2;
const MAX_CELLS = 60;
const CELL_STEP = 1;
const STARTING_BRUSH_RADIUS = 20;
const MIN_BRUSH_RADIUS = 2;
const MAX_BRUSH_RADIUS = 90;
const BRUSH_STEP = 2;
const STARTING_THRESHOLD = 0.6;
const MIN_THRESHOLD = 0.05;
const MAX_THRESHOLD = 1;
const THRESHOLD_STEP = 0.05;
const RATIO_DIGITS = 2;
const CARD_WIDTH = 360;
const CARD_HEIGHT = 180;
const NOTHING_SCRATCHED = 0;

export const ScratchCardPage = () => {
    const [getColumns, setColumns] = createSignal(STARTING_COLUMNS);
    const [getRows, setRows] = createSignal(STARTING_ROWS);
    const [getBrushRadius, setBrushRadius] = createSignal(STARTING_BRUSH_RADIUS);
    const [getThreshold, setThreshold] = createSignal(STARTING_THRESHOLD);
    const [getClearedRatio, setClearedRatio] = createSignal(NOTHING_SCRATCHED);
    const [getHasCleared, setHasCleared] = createSignal(false);

    const getExamples = createMemo(() => {
        const commonProps: ScratchCardExampleProps = {
            cellCount: () => ({ x: getColumns(), y: getRows() }),
            brushRadius: getBrushRadius,
            clearThreshold: getThreshold,
            onScratch: (ratio) => {
                setClearedRatio(ratio);

                if (ratio === NOTHING_SCRATCHED) setHasCleared(false);
            },
            onClear: () => setHasCleared(true),
        };

        return [
            {
                key: "ticket",
                name: "Ticket",
                readout: () =>
                    `${(getClearedRatio() * MAX_THRESHOLD * 100).toFixed(RATIO_DIGITS)}% rubbed off — ${
                        getHasCleared() ? "the rest went by itself once the threshold was crossed" : "keep going"
                    }`,
                component: () => (
                    <PageMeasureBox
                        width={() => CARD_WIDTH}
                        height={() => CARD_HEIGHT}
                        padding={() => MEASURE_BOX_PADDING}
                    >
                        <TicketExample {...commonProps} />
                    </PageMeasureBox>
                ),
                path: `${EXAMPLES_ROOT}/Ticket.tsx`,
            },
        ];
    });

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp key={"columns"} label={"Columns"}>
                    <PageNumberField
                        value={getColumns}
                        min={() => MIN_CELLS}
                        max={() => MAX_CELLS}
                        step={() => CELL_STEP}
                        ariaLabel={"Columns"}
                        onInput={setColumns}
                    />
                </PageProp>

                <PageProp key={"rows"} label={"Rows"}>
                    <PageNumberField
                        value={getRows}
                        min={() => MIN_CELLS}
                        max={() => MAX_CELLS}
                        step={() => CELL_STEP}
                        ariaLabel={"Rows"}
                        onInput={setRows}
                    />
                </PageProp>

                <PageProp key={"brushRadius"} label={"Brush radius (px)"}>
                    <PageNumberField
                        value={getBrushRadius}
                        min={() => MIN_BRUSH_RADIUS}
                        max={() => MAX_BRUSH_RADIUS}
                        step={() => BRUSH_STEP}
                        ariaLabel={"Brush radius in pixels"}
                        onInput={setBrushRadius}
                    />
                </PageProp>

                <PageProp key={"clearThreshold"} label={"Clear threshold"}>
                    <PageNumberField
                        value={getThreshold}
                        min={() => MIN_THRESHOLD}
                        max={() => MAX_THRESHOLD}
                        step={() => THRESHOLD_STEP}
                        ariaLabel={"Clear threshold"}
                        onInput={setThreshold}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} layout={"flow"} />
        </>
    );
};
