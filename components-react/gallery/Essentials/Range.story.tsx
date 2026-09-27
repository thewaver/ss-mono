import { useState } from "react";

import { type InteractionFlags, type RangeRenderProps, RangeUtils, type RangeValues } from "@thewaver/ss-components";

import { Range } from "../../src";

const THUMB_SIZE = 18;
const TRACK_LENGTH = 220;
const VERTICAL_LENGTH = 160;
const KNOB_SIZE = 120;
const ERROR_ABOVE = 80;
const STEPPED_MIN = 1;
const STEPPED_MAX = 5;
const KNOB_MIN = 0;
const KNOB_MAX = 100;
const KNOB_START_ANGLE = 135;
const KNOB_SWEEP_ANGLE = 270;
const KNOB_TRAVEL = { min: KNOB_MIN, max: KNOB_MAX, startAngle: KNOB_START_ANGLE, sweepAngle: KNOB_SWEEP_ANGLE };

const TOOLTIP_DEFS = {
    placement: { x: "center", y: "top-out" },
    hoverShowDelayMs: 0,
    renderContent: () => <span>Focusable so this can be read, but the value stays where it is.</span>,
} as const;

const travel = (ratio: number) => `calc(${ratio} * (100% - ${THUMB_SIZE}px))`;

const Track = ({ flags, length = TRACK_LENGTH }: { flags: InteractionFlags<RangeRenderProps>; length?: number }) => {
    const isVertical = flags.orientation === "vertical";

    return (
        <div
            style={{
                position: "relative",
                width: isVertical ? THUMB_SIZE : length,
                height: isVertical ? length : THUMB_SIZE,
                background: flags.hasError ? "#fdd" : "#eee",
                opacity: flags.isDisabled ? 0.5 : 1,
            }}
        >
            {flags.ratios.map((ratio, index) => (
                <div
                    key={index}
                    data-thumb={index}
                    style={{
                        position: "absolute",
                        width: THUMB_SIZE,
                        height: THUMB_SIZE,
                        borderRadius: "50%",
                        background: "#333",
                        outline: flags.focusVisibleThumb === index ? "2px solid blue" : undefined,
                        ...(isVertical ? { bottom: travel(ratio), left: 0 } : { left: travel(ratio), top: 0 }),
                    }}
                />
            ))}
        </div>
    );
};

const Knob = ({ flags }: { flags: InteractionFlags<RangeRenderProps> }) => (
    <div style={{ position: "relative", width: KNOB_SIZE, height: KNOB_SIZE, borderRadius: "50%", background: "#eee" }}>
        <div
            style={{
                position: "absolute",
                inset: 0,
                transform: `rotate(${KNOB_START_ANGLE + (flags.ratios[0] ?? 0) * KNOB_SWEEP_ANGLE}deg)`,
            }}
        >
            <div
                style={{ position: "absolute", left: "50%", top: "50%", width: "50%", height: 2, background: "#333" }}
            />
        </div>
    </div>
);

const Single = ({
    testId,
    initial,
    ariaLabel,
    isDisabled = false,
    isReachable = false,
    hasErrorAbove,
}: {
    testId: string;
    initial: number;
    ariaLabel: string;
    isDisabled?: boolean;
    isReachable?: boolean;
    hasErrorAbove?: number;
}) => {
    const valueState = useState(initial);

    return (
        <div data-testid={testId}>
            <Range
                valueState={valueState}
                ariaLabel={ariaLabel}
                isDisabled={isDisabled}
                isReachableWhenDisabled={isReachable}
                hasError={hasErrorAbove !== undefined && valueState[0] > hasErrorAbove}
                thumbSize={THUMB_SIZE}
                tooltipDefs={isReachable ? TOOLTIP_DEFS : undefined}
                renderContent={(flags) => <Track flags={flags} />}
            />
            <output data-readout="value">{`value: ${valueState[0]}`}</output>
        </div>
    );
};

const Pair = ({
    testId,
    initial,
    ariaLabel,
    thumbLabels,
    isDisabled = false,
}: {
    testId: string;
    initial: RangeValues;
    ariaLabel: string;
    thumbLabels?: string[];
    isDisabled?: boolean;
}) => {
    const rangeState = useState(initial);

    return (
        <div data-testid={testId}>
            <Range
                rangeState={rangeState}
                ariaLabel={ariaLabel}
                thumbLabels={thumbLabels}
                isDisabled={isDisabled}
                thumbSize={THUMB_SIZE}
                renderContent={(flags) => <Track flags={flags} />}
            />
            <output data-readout="value">{`start: ${rangeState[0].start} | end: ${rangeState[0].end}`}</output>
        </div>
    );
};

const Price = () => {
    const rangeState = useState<RangeValues>({ start: 100, end: 350 });
    const [settled, setSettled] = useState("not yet");

    return (
        <div data-testid="price">
            <Range
                rangeState={rangeState}
                ariaLabel="Budget"
                min={0}
                max={500}
                thumbSize={THUMB_SIZE}
                computeValueText={(value) => `$${value}`}
                renderContent={(flags) => <Track flags={flags} />}
                onChangeEnd={(values) => setSettled(values.join("–"))}
            />
            <output data-readout="value">{`settled: ${settled}`}</output>
        </div>
    );
};

export const Page = () => {
    const steppedState = useState(3);
    const verticalState = useState(60);
    const knobState = useState(30);

    return (
        <>
            <Single testId="default" initial={40} ariaLabel="Volume" />

            <div data-testid="stepped">
                <Range
                    valueState={steppedState}
                    ariaLabel="Difficulty"
                    min={STEPPED_MIN}
                    max={STEPPED_MAX}
                    step={1}
                    thumbSize={THUMB_SIZE}
                    renderContent={(flags) => <Track flags={flags} />}
                />
                <output data-readout="value">{`value: ${steppedState[0]} of ${STEPPED_MAX}`}</output>
            </div>

            <Pair
                testId="pair"
                initial={{ start: 20, end: 80 }}
                ariaLabel="Price range"
                thumbLabels={["Lowest price", "Highest price"]}
            />

            <div data-testid="vertical">
                <Range
                    valueState={verticalState}
                    id="verticalVolume"
                    ariaLabel="Vertical volume"
                    orientation="vertical"
                    thumbSize={THUMB_SIZE}
                    renderContent={(flags) => <Track flags={flags} length={VERTICAL_LENGTH} />}
                />
            </div>

            <div data-testid="knob">
                <Range
                    valueState={knobState}
                    min={KNOB_MIN}
                    max={KNOB_MAX}
                    ariaLabel="Gain"
                    computeValueAtPoint={(point, rect) => RangeUtils.computeAngularValue(point, rect, KNOB_TRAVEL)}
                    renderContent={(flags) => <Knob flags={flags} />}
                />
                <output data-readout="value">{`value: ${knobState[0]}`}</output>
            </div>

            <Single testId="disabled" initial={25} ariaLabel="Disabled range" isDisabled />

            <Pair testId="disabledPair" initial={{ start: 35, end: 65 }} ariaLabel="Disabled band" isDisabled />

            <Single testId="reachable" initial={75} ariaLabel="Reachable range" isDisabled isReachable />

            <Single testId="errored" initial={90} ariaLabel="Errored range" hasErrorAbove={ERROR_ABOVE} />

            <Price />
        </>
    );
};
