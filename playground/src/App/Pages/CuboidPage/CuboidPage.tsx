import { createMemo, createSignal } from "solid-js";

import type { CuboidController } from "@thewaver/ss-components";
import { CUBOID_DEFAULTS, CuboidUtils, MediaQueryMonitorUtils } from "@thewaver/ss-components";

import { CuboidKnobs } from "../../Knobs/Cuboids.const";
import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageCheckField, PageNumberField } from "../../StyledComponents/Field/Field";
import type { CuboidExampleProps, CuboidUprightExampleProps } from "./CuboidPage.types";
import { DefaultExample } from "./Examples/Default";
import { UprightExample } from "./Examples/Upright";
import { WanderingExample } from "./Examples/Wandering";

const NO_MOTION_DURATION_MS = 0;

const FIELD_WIDTH = 110;
const EXAMPLES_ROOT = "/src/App/Pages/CuboidPage/Examples";

const WanderingExampleWrapper = (props: CuboidExampleProps) => {
    const [getTurnIntervalMs, setTurnIntervalMs] = createSignal(CuboidKnobs.STARTING_TURN_INTERVAL_MS);
    const [getIsTurning, setIsTurning] = createSignal(CuboidKnobs.STARTING_IS_TURNING);

    return (
        <>
            <WanderingExample {...props} turnIntervalMs={() => (getIsTurning() ? getTurnIntervalMs() : undefined)} />

            <PagePropsPanel scope={"local"}>
                <PageProp
                    key={"isTurning"}
                    label={"Turns by itself"}
                    hint={"Lets the box turn to a new face on its own, without anybody clicking it."}
                >
                    <PageCheckField value={getIsTurning} ariaLabel={"Turns by itself"} onChange={setIsTurning} />
                </PageProp>

                <PageProp
                    key={"turnIntervalMs"}
                    label={"Turn every (ms)"}
                    hint={
                        "How long the box rests on a face before turning to the next one. It only applies while the box turns by itself."
                    }
                >
                    <PageNumberField
                        value={getTurnIntervalMs}
                        min={() => CuboidKnobs.MIN_TURN_INTERVAL_MS}
                        max={() => CuboidKnobs.MAX_TURN_INTERVAL_MS}
                        step={() => CuboidKnobs.TURN_INTERVAL_STEP_MS}
                        width={() => FIELD_WIDTH}
                        isDisabled={() => !getIsTurning()}
                        ariaLabel={"Turn interval in milliseconds"}
                        onInput={setTurnIntervalMs}
                    />
                </PageProp>
            </PagePropsPanel>
        </>
    );
};

const UprightExampleWrapper = (props: Omit<CuboidUprightExampleProps, "isUpright" | "isDraggable">) => {
    const [getIsUpright, setIsUpright] = createSignal(CuboidKnobs.STARTING_IS_UPRIGHT);
    const [getIsDraggable, setIsDraggable] = createSignal(CuboidKnobs.STARTING_IS_DRAGGABLE);

    return (
        <>
            <UprightExample {...props} isUpright={getIsUpright} isDraggable={getIsDraggable} />

            <PagePropsPanel scope={"local"}>
                <PageProp
                    key={"isUpright"}
                    label={"Stays upright"}
                    hint={
                        "Every press turns the box a quarter turn about the screen's own axis, as you see it, and the face it lands on is then spun until it reads the right way up. Off, the box goes back to reading the two counts as a pose, where the far side shows upside down once it has been tipped over the top."
                    }
                >
                    <PageCheckField value={getIsUpright} ariaLabel={"Stays upright"} onChange={setIsUpright} />
                </PageProp>

                <PageProp
                    key={"isDraggable"}
                    label={"Draggable"}
                    hint={
                        "Lets the box be turned by dragging it. It follows the pointer, and on release settles on the nearest face, writing the turns to the same two counts the buttons do."
                    }
                >
                    <PageCheckField value={getIsDraggable} ariaLabel={"Draggable"} onChange={setIsDraggable} />
                </PageProp>
            </PagePropsPanel>
        </>
    );
};

export const CuboidPage = () => {
    const [getWidth, setWidth] = createSignal(CuboidKnobs.STARTING_WIDTH);
    const [getHeight, setHeight] = createSignal(CuboidKnobs.STARTING_HEIGHT);
    const [getDepth, setDepth] = createSignal(CuboidKnobs.STARTING_DEPTH);
    const [getTransitionDurationMs, setTransitionDurationMs] = createSignal(CUBOID_DEFAULTS.transitionDurationMs);

    const yawSignal = createSignal(0);
    const pitchSignal = createSignal(0);
    const wanderingYawSignal = createSignal(0);
    const wanderingPitchSignal = createSignal(0);
    const uprightYawSignal = createSignal(0);
    const uprightPitchSignal = createSignal(0);
    const uprightControllerSignal = createSignal<CuboidController>();

    const getPrefersReducedMotion = MediaQueryMonitorUtils.createReducedMotion();

    const getTurnDurationMs = () => (getPrefersReducedMotion() ? NO_MOTION_DURATION_MS : getTransitionDurationMs());

    const getSize = createMemo(() => ({ width: getWidth(), height: getHeight(), depth: getDepth() }));

    const getExamples = createMemo(() => [
        {
            key: "default",
            name: "Six faces, two turns",
            readout: () =>
                `${CuboidUtils.getFacingFromTurns(yawSignal[0](), pitchSignal[0]())} — across ${yawSignal[0]()}, up ${pitchSignal[0]()}; the two counts are quarter turns rather than a face, so the box always takes the way it was pushed`,
            component: () => (
                <DefaultExample
                    yawSignal={yawSignal}
                    pitchSignal={pitchSignal}
                    size={getSize}
                    transitionDurationMs={getTurnDurationMs}
                />
            ),
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "wandering",
            name: "Turning to a neighbor on its own",
            readout: () =>
                `${CuboidUtils.getFacingFromTurns(wanderingYawSignal[0](), wanderingPitchSignal[0]())} — every tick takes one quarter turn at random, discarding the ones that would leave the same face in view or turn back to the face it just left, so the box only ever moves on to a new face sharing an edge with this one`,
            component: () => (
                <WanderingExampleWrapper
                    yawSignal={wanderingYawSignal}
                    pitchSignal={wanderingPitchSignal}
                    size={getSize}
                    transitionDurationMs={getTurnDurationMs}
                />
            ),
            path: `${EXAMPLES_ROOT}/Wandering.tsx`,
        },
        {
            key: "upright",
            name: "Upright, by name, and by hand",
            readout: () =>
                `${uprightControllerSignal[0]()?.getFacing() ?? "front"} — across ${uprightYawSignal[0]()}, up ${uprightPitchSignal[0]()}; the counts only record the presses here, so the box keeps its own orientation and the face names ask it for the shortest way round`,
            component: () => (
                <UprightExampleWrapper
                    yawSignal={uprightYawSignal}
                    pitchSignal={uprightPitchSignal}
                    controllerSignal={uprightControllerSignal}
                    size={getSize}
                    transitionDurationMs={getTurnDurationMs}
                />
            ),
            path: `${EXAMPLES_ROOT}/Upright.tsx`,
        },
    ]);

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp key={"width"} label={"Width (px)"} hint={"How wide the box is."}>
                    <PageNumberField
                        value={getWidth}
                        min={() => CuboidKnobs.MIN_EXTENT}
                        max={() => CuboidKnobs.MAX_EXTENT}
                        step={() => CuboidKnobs.EXTENT_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Width in pixels"}
                        onInput={setWidth}
                    />
                </PageProp>

                <PageProp key={"height"} label={"Height (px)"} hint={"How tall the box is."}>
                    <PageNumberField
                        value={getHeight}
                        min={() => CuboidKnobs.MIN_EXTENT}
                        max={() => CuboidKnobs.MAX_EXTENT}
                        step={() => CuboidKnobs.EXTENT_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Height in pixels"}
                        onInput={setHeight}
                    />
                </PageProp>

                <PageProp key={"depth"} label={"Depth (px)"} hint={"How deep the box is, front face to back face."}>
                    <PageNumberField
                        value={getDepth}
                        min={() => CuboidKnobs.MIN_EXTENT}
                        max={() => CuboidKnobs.MAX_EXTENT}
                        step={() => CuboidKnobs.EXTENT_STEP}
                        width={() => FIELD_WIDTH}
                        ariaLabel={"Depth in pixels"}
                        onInput={setDepth}
                    />
                </PageProp>

                <PageProp
                    key={"transitionDurationMs"}
                    label={"Turn duration (ms)"}
                    hint={
                        "How long one turn from face to face takes, and how long the box takes to settle after a drag. It is off while the visitor has asked for reduced motion."
                    }
                >
                    <PageNumberField
                        value={getTransitionDurationMs}
                        min={() => CuboidKnobs.MIN_DURATION_MS}
                        max={() => CuboidKnobs.MAX_DURATION_MS}
                        step={() => CuboidKnobs.DURATION_STEP_MS}
                        width={() => FIELD_WIDTH}
                        isDisabled={getPrefersReducedMotion}
                        ariaLabel={"Turn duration in milliseconds"}
                        onInput={setTransitionDurationMs}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} />
        </>
    );
};
