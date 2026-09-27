import { useState, useSyncExternalStore } from "react";

import type { WheelAxis } from "@thewaver/ss-components";

import { DrumWheel, type WheelController } from "../../src";

const PRIZES = [
    "Free spin",
    "Ten coins",
    "Nothing",
    "A hat",
    "Fifty coins",
    "A shrug",
    "Two hats",
    "Jackpot",
    "A sticker",
    "Half a coin",
    "A rumor",
    "Another go",
];
const WEDGE_SIZE = { width: 160, height: 64 };
const FETCH_MS = 400;
const NO_SUBSCRIPTION = () => () => {};

const pickPrizeIndex = (wedgeCount: number) =>
    new Promise<number>((resolve) => {
        setTimeout(() => resolve(Math.floor(Math.random() * wedgeCount)), FETCH_MS);
    });

type DefaultProps = {
    axis?: WheelAxis;
    wedgeCount?: number;
    isDisabled?: boolean;
    spinDurationMs?: number;
    settleDurationMs?: number;
    restDurationMs?: number;
    idleDelayMs?: number;
    turns?: number;
};

export const Default = ({
    axis,
    wedgeCount = 8,
    isDisabled,
    spinDurationMs = 500,
    settleDurationMs = 500,
    restDurationMs = 6000,
    idleDelayMs,
    turns = 2,
}: DefaultProps) => {
    const [controller, setController] = useState<WheelController>();
    const [landed, setLanded] = useState("none");

    const isSpinnable = useSyncExternalStore(
        controller?.subscribe ?? NO_SUBSCRIPTION,
        () => controller?.getIsSpinnable() ?? false,
    );

    const wedges = PRIZES.slice(0, wedgeCount);

    return (
        <>
            <div data-testid="host">
                <DrumWheel
                    wedges={wedges}
                    axis={axis}
                    wedgeSize={WEDGE_SIZE}
                    isDisabled={isDisabled}
                    spinDurationMs={spinDurationMs}
                    settleDurationMs={settleDurationMs}
                    restDurationMs={restDurationMs}
                    idleDelayMs={idleDelayMs}
                    ariaLabel="Prize drum"
                    computeSpinTarget={() => pickPrizeIndex(wedges.length)}
                    computeSpinDefs={() => ({ turns, jitterRatio: 0 })}
                    computeWedgeLabel={(index) => `${wedges[index]}, ${index + 1} of ${wedges.length}`}
                    renderWedge={(wedge, state) => (
                        <div data-card="front" data-picked={state.isSelected ? "true" : undefined}>
                            {wedge}
                        </div>
                    )}
                    renderWedgeBack={() => <div data-card="back" />}
                    onSpinEnd={(index) => setLanded(String(index))}
                    onMount={setController}
                />
            </div>
            <button
                id="spin"
                type="button"
                aria-disabled={!isSpinnable || undefined}
                onClick={() => {
                    controller?.spin();
                }}
            >
                Spin
            </button>
            <output data-readout="landed">{landed}</output>
        </>
    );
};
