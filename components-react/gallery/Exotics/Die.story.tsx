import { useState, useSyncExternalStore } from "react";

import { DieShapes } from "@thewaver/ss-components";

import { Die, type DieController } from "../../src";

const DIE_SIZE = 160;
const FIRST_NUMBER = 1;
const NO_SUBSCRIPTION = () => () => {};

export const Tabletop = ({ rollDurationMs = 0 }: { rollDurationMs?: number }) => {
    const [shapeKey, setShapeKey] = useState<DieShapes.SampleKey>("d6");
    const [controller, setController] = useState<DieController>();
    const faceState = useState(0);
    const [face] = faceState;
    const shape = DieShapes.SAMPLE_SHAPES[shapeKey];

    const isRolling = useSyncExternalStore(
        controller?.subscribe ?? NO_SUBSCRIPTION,
        () => controller?.getIsRolling() ?? true,
    );

    return (
        <>
            <Die
                shape={shape}
                size={DIE_SIZE}
                rollDurationMs={rollDurationMs}
                faceState={faceState}
                ariaLabel="A die"
                computeFaceLabel={(index) => `${index + FIRST_NUMBER}`}
                computeRollTarget={() => Math.floor(Math.random() * shape.faces.length)}
                renderFace={(index, state) => (
                    <div style={{ width: "100%", height: "100%", background: state.isShowing ? "#fc6" : "#ddd" }}>
                        {index + FIRST_NUMBER}
                    </div>
                )}
                onMount={setController}
            />
            <button
                id="dieRoll"
                type="button"
                aria-disabled={isRolling ? "true" : undefined}
                onClick={() => {
                    controller?.roll();
                }}
            >
                Roll
            </button>
            <select
                data-testid="shape"
                value={shapeKey}
                onChange={(event) => setShapeKey(event.currentTarget.value as DieShapes.SampleKey)}
            >
                {DieShapes.SAMPLE_KEYS.map((key) => (
                    <option key={key} value={key}>
                        {key}
                    </option>
                ))}
            </select>
            <output data-readout="die">{`showing ${face + FIRST_NUMBER} of ${shape.faces.length}`}</output>
        </>
    );
};
