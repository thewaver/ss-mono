import { useCallback, useMemo, useState, useSyncExternalStore } from "react";

import type { CuboidController } from "@thewaver/ss-components-react";
import { CUBOID_DEFAULTS, CuboidUtils, MediaQueryMonitorReactUtils } from "@thewaver/ss-components-react";
import { CuboidKnobs } from "@thewaver/ss-playground/App/Knobs/Cuboids.const";

import { PageExampleKnobs } from "../../PageComponents/ExampleKnobs/ExampleKnobs";
import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageCheckField, PageNumberField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import type { CuboidExampleProps, CuboidUprightExampleProps } from "./CuboidPage.types";
import { DefaultExample } from "./Examples/Default";
import { UprightExample } from "./Examples/Upright";
import { WanderingExample } from "./Examples/Wandering";

const NO_MOTION_DURATION_MS = 0;

const FIELD_WIDTH = 110;
const EXAMPLES_ROOT = "/src/App/Pages/CuboidPage/Examples";

const WanderingExampleWrapper = (props: CuboidExampleProps) => {
    const [turnIntervalMs, setTurnIntervalMs] = useState(CuboidKnobs.STARTING_TURN_INTERVAL_MS);
    const [isTurning, setIsTurning] = useState(CuboidKnobs.STARTING_IS_TURNING);

    return (
        <>
            <WanderingExample {...props} turnIntervalMs={isTurning ? turnIntervalMs : undefined} />

            <PageExampleKnobs>
                <PageProp
                    itemKey={"isTurning"}
                    label={"Turns by itself"}
                    hint={"Lets the box turn to a new face on its own, without anybody clicking it."}
                >
                    <PageCheckField value={isTurning} ariaLabel={"Turns by itself"} onChange={setIsTurning} />
                </PageProp>

                <PageProp
                    itemKey={"turnIntervalMs"}
                    label={"Turn every (ms)"}
                    hint={
                        "How long the box rests on a face before turning to the next one. It only applies while the box turns by itself."
                    }
                >
                    <PageNumberField
                        value={turnIntervalMs}
                        min={CuboidKnobs.MIN_TURN_INTERVAL_MS}
                        max={CuboidKnobs.MAX_TURN_INTERVAL_MS}
                        step={CuboidKnobs.TURN_INTERVAL_STEP_MS}
                        width={FIELD_WIDTH}
                        isDisabled={!isTurning}
                        ariaLabel={"Turn interval in milliseconds"}
                        onInput={setTurnIntervalMs}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};

const UprightExampleWrapper = (props: Omit<CuboidUprightExampleProps, "isUpright" | "isDraggable">) => {
    const [isUpright, setIsUpright] = useState(CuboidKnobs.STARTING_IS_UPRIGHT);
    const [isDraggable, setIsDraggable] = useState(CuboidKnobs.STARTING_IS_DRAGGABLE);

    return (
        <>
            <UprightExample {...props} isUpright={isUpright} isDraggable={isDraggable} />

            <PageExampleKnobs>
                <PageProp
                    itemKey={"isUpright"}
                    label={"Stays upright"}
                    hint={
                        "Every press turns the box a quarter turn about the screen's own axis, as you see it, and the face it lands on is then spun until it reads the right way up. Off, the box goes back to reading the two counts as a pose, where the far side shows upside down once it has been tipped over the top."
                    }
                >
                    <PageCheckField value={isUpright} ariaLabel={"Stays upright"} onChange={setIsUpright} />
                </PageProp>

                <PageProp
                    itemKey={"isDraggable"}
                    label={"Draggable"}
                    hint={
                        "Lets the box be turned by dragging it. It follows the pointer, and on release settles on the nearest face, writing the turns to the same two counts the buttons do."
                    }
                >
                    <PageCheckField value={isDraggable} ariaLabel={"Draggable"} onChange={setIsDraggable} />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};

const NO_SUBSCRIPTION = () => {};

export const CuboidPage = () => {
    const [width, setWidth] = useState(CuboidKnobs.STARTING_WIDTH);
    const [height, setHeight] = useState(CuboidKnobs.STARTING_HEIGHT);
    const [depth, setDepth] = useState(CuboidKnobs.STARTING_DEPTH);
    const [transitionDurationMs, setTransitionDurationMs] = useState(CUBOID_DEFAULTS.transitionDurationMs);

    const yawState = useState(0);
    const pitchState = useState(0);
    const wanderingYawState = useState(0);
    const wanderingPitchState = useState(0);
    const uprightYawState = useState(0);
    const uprightPitchState = useState(0);
    const uprightControllerState = useState<CuboidController>();
    const [uprightController] = uprightControllerState;

    const subscribeToUpright = useCallback(
        (listener: () => void) => uprightController?.subscribe(listener) ?? NO_SUBSCRIPTION,
        [uprightController],
    );

    const uprightFacing = useSyncExternalStore(subscribeToUpright, () => uprightController?.getFacing());

    const prefersReducedMotion = MediaQueryMonitorReactUtils.useReducedMotion();

    const turnDurationMs = prefersReducedMotion ? NO_MOTION_DURATION_MS : transitionDurationMs;

    const size = useMemo(() => ({ width, height, depth }), [width, height, depth]);

    const examples = [
        {
            key: "default",
            name: "Six faces, two turns",
            readout: () =>
                `${CuboidUtils.getFacingFromTurns(yawState[0], pitchState[0])} — across ${yawState[0]}, up ${pitchState[0]}; the two counts are quarter turns rather than a face, so the box always takes the way it was pushed`,
            component: () => (
                <DefaultExample yaw={yawState} pitch={pitchState} size={size} transitionDurationMs={turnDurationMs} />
            ),
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "wandering",
            name: "Turning to a neighbor on its own",
            readout: () =>
                `${CuboidUtils.getFacingFromTurns(wanderingYawState[0], wanderingPitchState[0])} — every tick takes one quarter turn at random, discarding the ones that would leave the same face in view or turn back to the face it just left, so the box only ever moves on to a new face sharing an edge with this one`,
            component: () => (
                <WanderingExampleWrapper
                    yaw={wanderingYawState}
                    pitch={wanderingPitchState}
                    size={size}
                    transitionDurationMs={turnDurationMs}
                />
            ),
            path: `${EXAMPLES_ROOT}/Wandering.tsx`,
        },
        {
            key: "upright",
            name: "Upright, by name, and by hand",
            readout: () =>
                `${uprightFacing ?? "front"} — across ${uprightYawState[0]}, up ${uprightPitchState[0]}; the counts only record the presses here, so the box keeps its own orientation and the face names ask it for the shortest way round`,
            component: () => (
                <UprightExampleWrapper
                    yaw={uprightYawState}
                    pitch={uprightPitchState}
                    controller={uprightControllerState}
                    size={size}
                    transitionDurationMs={turnDurationMs}
                />
            ),
            path: `${EXAMPLES_ROOT}/Upright.tsx`,
        },
    ];

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp itemKey={"width"} label={"Width (px)"} hint={"How wide the box is."}>
                    <PageNumberField
                        value={width}
                        min={CuboidKnobs.MIN_EXTENT}
                        max={CuboidKnobs.MAX_EXTENT}
                        step={CuboidKnobs.EXTENT_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Width in pixels"}
                        onInput={setWidth}
                    />
                </PageProp>

                <PageProp itemKey={"height"} label={"Height (px)"} hint={"How tall the box is."}>
                    <PageNumberField
                        value={height}
                        min={CuboidKnobs.MIN_EXTENT}
                        max={CuboidKnobs.MAX_EXTENT}
                        step={CuboidKnobs.EXTENT_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Height in pixels"}
                        onInput={setHeight}
                    />
                </PageProp>

                <PageProp itemKey={"depth"} label={"Depth (px)"} hint={"How deep the box is, front face to back face."}>
                    <PageNumberField
                        value={depth}
                        min={CuboidKnobs.MIN_EXTENT}
                        max={CuboidKnobs.MAX_EXTENT}
                        step={CuboidKnobs.EXTENT_STEP}
                        width={FIELD_WIDTH}
                        ariaLabel={"Depth in pixels"}
                        onInput={setDepth}
                    />
                </PageProp>

                <PageProp
                    itemKey={"transitionDurationMs"}
                    label={"Turn duration (ms)"}
                    hint={
                        "How long one turn from face to face takes, and how long the box takes to settle after a drag. It is off while the visitor has asked for reduced motion."
                    }
                >
                    <PageNumberField
                        value={transitionDurationMs}
                        min={CuboidKnobs.MIN_DURATION_MS}
                        max={CuboidKnobs.MAX_DURATION_MS}
                        step={CuboidKnobs.DURATION_STEP_MS}
                        width={FIELD_WIDTH}
                        isDisabled={prefersReducedMotion}
                        ariaLabel={"Turn duration in milliseconds"}
                        onInput={setTransitionDurationMs}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} />
        </>
    );
};
