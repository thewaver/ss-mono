import { useState } from "react";

import type { SegmentedInputCellRenderProps } from "@thewaver/ss-components";

import { SegmentedInput } from "../../src";

const CELL_WIDTH = 32;
const CELL_HEIGHT = 40;
const CELL_GAP = 8;
const ONE_TIME_CODE_LENGTH = 6;
const RECOVERY_CODE_LENGTH = 8;

const ALPHANUMERIC = /^[A-Za-z0-9]$/;

const Cell = ({ cell }: { cell: SegmentedInputCellRenderProps }) => (
    <div
        data-has-caret={cell.hasCaret || undefined}
        data-selected={cell.isSelected || undefined}
        style={{
            width: CELL_WIDTH,
            height: CELL_HEIGHT,
            border: "1px solid black",
            background: cell.isSelected ? "lightblue" : "white",
        }}
    >
        {cell.char ?? ""}
    </div>
);

const renderCell = (cell: SegmentedInputCellRenderProps) => <Cell cell={cell} />;

const Readout = ({ value }: { value: string }) => <output data-readout="value">{`value: "${value}"`}</output>;

export const OneTimeCode = () => {
    const valueState = useState("");

    return (
        <>
            <SegmentedInput
                id="field"
                valueState={valueState}
                cellCount={ONE_TIME_CODE_LENGTH}
                gap={CELL_GAP}
                ariaLabel="One-time code"
                autoComplete="one-time-code"
                renderCell={renderCell}
            />
            <Readout value={valueState[0]} />
        </>
    );
};

export const RecoveryCode = () => {
    const valueState = useState("");

    return (
        <SegmentedInput
            id="field"
            valueState={valueState}
            cellCount={RECOVERY_CODE_LENGTH}
            gap={CELL_GAP}
            ariaLabel="Recovery code"
            inputMode="text"
            computeIsAllowed={(char) => ALPHANUMERIC.test(char)}
            renderCell={renderCell}
        />
    );
};
