import { useState, useSyncExternalStore } from "react";

import { CUBOID_FACES, type CuboidFace } from "@thewaver/ss-components";

import { Cuboid, type CuboidController } from "../../src";

const QUARTER_TURN = 1;
const NO_SUBSCRIPTION = () => () => {};

const computeFaceLabel = (face: CuboidFace) => `${face[0]!.toUpperCase()}${face.slice(1)}`;

const renderFace = (face: CuboidFace, state: { isShowing: boolean }) => (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#ddd" }}>
        <div>{face}</div>
        <div>{state.isShowing ? "facing you" : "turned away"}</div>
    </div>
);

const SizeField = ({ id, value, onChange }: { id: string; value: number; onChange: (value: number) => void }) => (
    <input id={id} type="number" value={value} onChange={(event) => onChange(Number(event.currentTarget.value))} />
);

type StoryProps = { transitionDurationMs?: number; isUpright?: boolean; isDraggable?: boolean };

export const Default = ({ transitionDurationMs: startingDurationMs = 600, ...props }: StoryProps) => {
    const yawState = useState(0);
    const pitchState = useState(0);
    const [yaw, setYaw] = yawState;
    const [pitch, setPitch] = pitchState;
    const [width, setWidth] = useState(200);
    const [height, setHeight] = useState(260);
    const [depth, setDepth] = useState(120);
    const [transitionDurationMs, setTransitionDurationMs] = useState(startingDurationMs);
    const [isUpright, setIsUpright] = useState(props.isUpright ?? false);
    const [controller, setController] = useState<CuboidController>();

    const facing = useSyncExternalStore(controller?.subscribe ?? NO_SUBSCRIPTION, () => controller?.getFacing());

    return (
        <>
            <div data-testid="host">
                <Cuboid
                    yawState={yawState}
                    pitchState={pitchState}
                    size={{ width, height, depth }}
                    transitionDurationMs={transitionDurationMs}
                    isUpright={isUpright}
                    isDraggable={props.isDraggable}
                    ariaLabel="Six faces"
                    computeFaceLabel={computeFaceLabel}
                    renderFace={renderFace}
                    onMount={setController}
                />
            </div>
            <button id="pitchUp" type="button" onClick={() => setPitch(pitch + QUARTER_TURN)}>
                up
            </button>
            <button id="yawLeft" type="button" onClick={() => setYaw(yaw - QUARTER_TURN)}>
                left
            </button>
            <button id="yawRight" type="button" onClick={() => setYaw(yaw + QUARTER_TURN)}>
                right
            </button>
            <button id="pitchDown" type="button" onClick={() => setPitch(pitch - QUARTER_TURN)}>
                down
            </button>
            {CUBOID_FACES.map((face) => (
                <button
                    key={face}
                    id={`turnTo${computeFaceLabel(face)}`}
                    type="button"
                    onClick={() => controller?.turnTo(face)}
                >
                    {face}
                </button>
            ))}
            <SizeField id="width" value={width} onChange={setWidth} />
            <SizeField id="height" value={height} onChange={setHeight} />
            <SizeField id="depth" value={depth} onChange={setDepth} />
            <SizeField id="transitionDurationMs" value={transitionDurationMs} onChange={setTransitionDurationMs} />
            <input
                id="isUpright"
                type="checkbox"
                checked={isUpright}
                onChange={(event) => setIsUpright(event.currentTarget.checked)}
            />
            <output data-readout="cuboid">{`${facing ?? "front"} — across ${yaw}, up ${pitch}`}</output>
        </>
    );
};
