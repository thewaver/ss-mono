import { useState } from "react";

import { RotatorReactUtils } from "../../src";

export const Default = ({ idleDelayMs }: { idleDelayMs?: number }) => {
    const targetIndexState = useState(0);
    const [landed, setLanded] = useState("none");

    const rotator = RotatorReactUtils.useRotator(false, {
        stepCount: 4,
        targetIndexState,
        spinDurationMs: 300,
        settleDurationMs: 100,
        restDurationMs: 200,
        idleDelayMs,
        computeSpinTarget: () => 2,
        computeSpinDefs: () => ({ turns: 1, jitterRatio: 0 }),
        computeStepLabel: (index) => `Step ${index}`,
        onSpinEnd: (index) => setLanded(String(index)),
    });

    return (
        <>
            <button type="button" data-testid="spin" disabled={!rotator.isSpinnable} onClick={rotator.spin}>
                Spin
            </button>
            <button type="button" data-testid="toOne" onClick={() => targetIndexState[1](1)}>
                To one
            </button>
            <output data-readout="phase">{rotator.phase}</output>
            <output data-readout="current">{rotator.currentIndex}</output>
            <output data-readout="target">{rotator.targetIndex}</output>
            <output data-readout="landed">{landed}</output>
        </>
    );
};
