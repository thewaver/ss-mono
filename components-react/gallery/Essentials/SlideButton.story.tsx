import { type ReactNode, useState } from "react";

import type { InteractionFlags, SlideButtonMode, SlideButtonRenderProps } from "@thewaver/ss-components";

import { Button, FormField, SlideButton } from "../../src";

const THUMB_SIZE = 44;
const TRACK_WIDTH = 300;
const PERCENT = 100;
const LONG_HOLD_DURATION_MS = 2000;
const HINT = "Hold the button, or slide it all the way, to send.";

const TOOLTIP_DEFS = {
    placement: { x: "center", y: "top-out" },
    hoverShowDelayMs: 0,
    renderContent: () => <span>Reachable so this can be read, but it cannot be sent.</span>,
} as const;

const travel = (ratio: number) => `calc(${ratio} * (100% - ${THUMB_SIZE}px))`;

const Track = ({ flags, children }: { flags: InteractionFlags<SlideButtonRenderProps>; children: ReactNode }) => {
    const ratio = flags.isPressed ? 1 : flags.progressRatio;

    return (
        <div
            style={{
                position: "relative",
                width: TRACK_WIDTH,
                height: THUMB_SIZE,
                background: "#eee",
                opacity: flags.isDisabled ? 0.5 : 1,
            }}
        >
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    width: `calc(${travel(ratio)} + ${THUMB_SIZE * 0.5}px)`,
                    background: "#9cf",
                }}
            />
            <div style={{ position: "relative", lineHeight: `${THUMB_SIZE}px`, textAlign: "center" }}>{children}</div>
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: travel(ratio),
                    width: THUMB_SIZE,
                    height: THUMB_SIZE,
                    background: "#333",
                    outline: flags.isFocusVisible ? "2px solid blue" : undefined,
                }}
            />
        </div>
    );
};

const Counted = ({
    testId,
    mode,
    holdDurationMs,
    isDisabled = false,
    isReachable = false,
}: {
    testId: string;
    mode?: SlideButtonMode;
    holdDurationMs?: number;
    isDisabled?: boolean;
    isReachable?: boolean;
}) => {
    const [activations, setActivations] = useState(0);

    return (
        <div data-testid={testId}>
            <SlideButton
                mode={mode}
                holdDurationMs={holdDurationMs}
                isDisabled={isDisabled}
                isReachableWhenDisabled={isReachable}
                tooltipDefs={isReachable ? TOOLTIP_DEFS : undefined}
                thumbSize={THUMB_SIZE}
                renderContent={(flags) => <Track flags={flags}>Slide or hold to send</Track>}
                onActivate={() => setActivations((count) => count + 1)}
            />
            <output data-readout="value">{`activations: ${activations}`}</output>
        </div>
    );
};

const Default = () => {
    const [activations, setActivations] = useState(0);
    const progressState = useState(0);

    return (
        <div data-testid="default">
            <SlideButton
                thumbSize={THUMB_SIZE}
                progressState={progressState}
                renderContent={(flags) => <Track flags={flags}>Slide or hold to send</Track>}
                onActivate={() => setActivations((count) => count + 1)}
            />
            <output data-readout="value">
                {`activations: ${activations} — progress ${Math.round(progressState[0] * PERCENT)}%`}
            </output>
        </div>
    );
};

const Held = () => {
    const [isArmed, setIsArmed] = useState(false);

    return (
        <div data-testid="held">
            <SlideButton
                isPressed={isArmed}
                thumbSize={THUMB_SIZE}
                renderContent={(flags) => <Track flags={flags}>Slide or hold to arm</Track>}
                onActivate={() => setIsArmed(true)}
            />
            <Button isDisabled={!isArmed} renderContent={() => <span>Reset</span>} onClick={() => setIsArmed(false)} />
            <output data-readout="value">{`armed: ${isArmed}`}</output>
        </div>
    );
};

const Described = () => (
    <div data-testid="described">
        <FormField
            message={HINT}
            renderCaption={() => <span>Send the report</span>}
            renderMessage={() => <span>{HINT}</span>}
            renderControl={() => (
                <SlideButton
                    ariaLabel={"Send the report"}
                    thumbSize={THUMB_SIZE}
                    renderContent={(flags) => <Track flags={flags}>Slide or hold to send</Track>}
                />
            )}
        />
    </div>
);

export const Page = () => (
    <>
        <Default />
        <Described />
        <Counted testId="slideOnly" mode="slide" />
        <Counted testId="holdOnly" mode="hold" holdDurationMs={LONG_HOLD_DURATION_MS} />
        <Held />
        <Counted testId="disabled" isDisabled />
        <Counted testId="reachable" isDisabled isReachable />
    </>
);
