import { useState, useSyncExternalStore } from "react";

import type { PlacementLayoutFn, ProximityEffectFn } from "@thewaver/ss-components";

import { OverheadWheel, type WheelController } from "../../src";

const PRIZES = ["Free spin", "Ten coins", "Nothing", "A hat", "Fifty coins", "A shrug", "Two hats", "Jackpot"];
const FULL_TURN = 360;
const MARKER_DEGREES = -90;
const SECTOR_OFFSET_DEGREES = 10;
const HOST_STYLE = { width: "400px" };
const NO_SUBSCRIPTION = () => () => {};
const LIT_BRIGHTNESS = 1.5;
const LIT_REACH = 1;

const computeRingLayout: PlacementLayoutFn = ({ itemCount }) => {
    const halfSpread = (FULL_TURN / Math.max(itemCount, 1)) * 0.5;

    return {
        heightRatio: 1,
        reachRule: "plane",
        placements: [
            {
                leftShare: 0.5,
                topShare: 0.2,
                widthShare: 0.3,
                heightShare: 0.2,
                sector: {
                    innerRadius: 0,
                    outerRadius: 0.5,
                    fromAngle: MARKER_DEGREES - halfSpread + SECTOR_OFFSET_DEGREES,
                    toAngle: MARKER_DEGREES + halfSpread + SECTOR_OFFSET_DEGREES,
                },
            },
        ],
    };
};

const computeLitEffect: ProximityEffectFn = (defs) => (defs.distance < LIT_REACH ? { brightness: LIT_BRIGHTNESS } : {});

type DefaultProps = {
    spinDurationMs?: number;
    settleDurationMs?: number;
    idleDelayMs?: number;
    hasEffect?: boolean;
};

export const Default = ({
    spinDurationMs = 500,
    settleDurationMs = 500,
    idleDelayMs,
    hasEffect = true,
}: DefaultProps) => {
    const [controller, setController] = useState<WheelController>();

    const isSpinnable = useSyncExternalStore(
        controller?.subscribe ?? NO_SUBSCRIPTION,
        () => controller?.getIsSpinnable() ?? false,
    );

    const phase = useSyncExternalStore(
        controller?.subscribe ?? NO_SUBSCRIPTION,
        () => controller?.getPhase() ?? "still",
    );

    return (
        <>
            <div data-testid="host" style={HOST_STYLE}>
                <OverheadWheel
                    wedges={PRIZES}
                    spinDurationMs={spinDurationMs}
                    settleDurationMs={settleDurationMs}
                    idleDelayMs={idleDelayMs}
                    ariaLabel="Prize wheel"
                    computeLayout={computeRingLayout}
                    computeEffect={hasEffect ? computeLitEffect : undefined}
                    computeSpinTarget={() => 3}
                    computeSpinDefs={() => ({ turns: 1, jitterRatio: 0 })}
                    computeWedgeLabel={(index) => `${PRIZES[index]}, ${index + 1} of ${PRIZES.length}`}
                    renderWedge={(wedge, state) => (
                        <div data-picked={state.isSelected ? "true" : undefined}>{wedge}</div>
                    )}
                    onMount={setController}
                />
            </div>
            <button
                id="overheadSpin"
                type="button"
                aria-disabled={!isSpinnable || undefined}
                onClick={() => {
                    controller?.spin();
                }}
            >
                Spin
            </button>
            <output data-readout="phase">{phase}</output>
        </>
    );
};
