import { Index, batch, createComputed, createMemo, createSignal, on, onMount, untrack } from "solid-js";

import type { Matrix3d } from "@thewaver/ss-utils";
import { MathUtils } from "@thewaver/ss-utils";

import { InteractionTrackerUtils } from "../../Abstracts/InteractionTracker/InteractionTracker.utils";
import { BarrelUtils } from "../../Primitives/Barrel/Barrel.utils";
import { access, accessSignal } from "../../Utils/propUtils";
import { CUBOID_DEFAULTS, CUBOID_FACES } from "./Cuboid.const";
import type { CuboidController, CuboidFace, CuboidFaceState, CuboidProps, CuboidTurns } from "./Cuboid.types";
import { CuboidUtils } from "./Cuboid.utils";

import * as styles from "./Cuboid.css";

const HALF = 0.5;
const NO_DURATION = 0;
const QUARTER_TURN_COUNT = 4;
const INVERTED_PITCH = 2;
const FLIPPED = -1;
const UNFLIPPED = 1;
const DRAG_COMMIT_RATIO = 0.5;
const SETTLE_EASING = "ease";

const NO_TURNS: CuboidTurns = { yaw: 0, pitch: 0 };

const roundTurn = (turn: number) => Math.sign(turn) * Math.round(Math.abs(turn)) + 0;

export const Cuboid = (props: CuboidProps) => {
    const [getYaw, setYaw] = accessSignal(() => props.yawSignal);
    const [getPitch, setPitch] = accessSignal(() => props.pitchSignal);

    const [getPerspectiveRef, setPerspectiveRef] = createSignal<HTMLElement>();
    const [getBodyRef, setBodyRef] = createSignal<HTMLElement>();
    const [getDragTurns, setDragTurns] = createSignal(NO_TURNS);
    const [getOrientation, setOrientation] = createSignal(
        CuboidUtils.standUpright(CuboidUtils.getCountedOrientation(untrack(getYaw), untrack(getPitch))),
    );

    const getSize = createMemo(() => access(props.size));

    const getReservedSize = createMemo(() => CuboidUtils.getReservedSize(getSize()));

    const getTransitionDurationMs = createMemo(
        () => access(props.transitionDurationMs) ?? CUBOID_DEFAULTS.transitionDurationMs,
    );

    const getIsUpright = createMemo(() => access(props.isUpright) ?? CUBOID_DEFAULTS.isUpright);

    const getIsDraggable = createMemo(() => access(props.isDraggable) ?? CUBOID_DEFAULTS.isDraggable);

    const getFacing = createMemo(() =>
        getIsUpright()
            ? CuboidUtils.getFacingFromOrientation(getOrientation())
            : CuboidUtils.getFacingFromTurns(getYaw(), getPitch()),
    );

    const getFaceLabel = (face: CuboidFace) => props.computeFaceLabel(face);

    const getFaceState = (face: CuboidFace): CuboidFaceState => ({
        face,
        isShowing: face === getFacing(),
    });

    const readDrawnOrientation = () => {
        const body = getBodyRef();

        return body && CuboidUtils.readOrientation(getComputedStyle(body).transform);
    };

    const stopSettling = () => {
        for (const animation of getBodyRef()?.getAnimations() ?? []) animation.cancel();
    };

    const settle = (from: Matrix3d | undefined, to: Matrix3d, turns: CuboidTurns) => {
        stopSettling();

        const durationMs = getTransitionDurationMs();

        if (!from || durationMs <= NO_DURATION) return;

        const keyframes = CuboidUtils.getSettleKeyframes(from, to, getSize(), turns);

        if (keyframes.length > 0) getBodyRef()?.animate(keyframes, { duration: durationMs, easing: SETTLE_EASING });
    };

    const turnUprightBy = (turns: CuboidTurns) => {
        const from = readDrawnOrientation();
        const to = CuboidUtils.turnUpright(getOrientation(), turns);

        setOrientation(to);
        settle(from, to, turns);
    };

    createComputed(
        on([getYaw, getPitch], ([yaw, pitch], previous) => {
            if (!previous || !getIsUpright()) return;

            turnUprightBy({ yaw: yaw - previous[0], pitch: pitch - previous[1] });
        }),
    );

    createComputed(
        on(
            getIsUpright,
            (isUpright) => {
                const from = readDrawnOrientation();
                const counted = CuboidUtils.getCountedOrientation(getYaw(), getPitch());
                const to = isUpright ? CuboidUtils.standUpright(counted) : counted;

                setOrientation(CuboidUtils.standUpright(counted));
                settle(from, to, NO_TURNS);
            },
            { defer: true },
        ),
    );

    const getAcrossSign = () =>
        !getIsUpright() && MathUtils.wrapIndex(getPitch(), QUARTER_TURN_COUNT) === INVERTED_PITCH ? FLIPPED : UNFLIPPED;

    const { getIsSwiping } = InteractionTrackerUtils.trackFreeSwipe(getPerspectiveRef, () => !getIsDraggable(), {
        getCommitRatio: () => DRAG_COMMIT_RATIO,
        onSwipe: (travel) => {
            if (getIsUpright()) stopSettling();

            setDragTurns({ yaw: -travel.x * getAcrossSign(), pitch: travel.y });
        },
        onSwipeEnd: (direction) => {
            const dragged = getDragTurns();
            const turns =
                direction === undefined ? NO_TURNS : { yaw: roundTurn(dragged.yaw), pitch: roundTurn(dragged.pitch) };
            const from = getIsUpright() ? readDrawnOrientation() : undefined;
            const yaw = getYaw();
            const pitch = getPitch();

            batch(() => {
                setDragTurns(NO_TURNS);
                setYaw(yaw + turns.yaw);
                setPitch(pitch + turns.pitch);
            });

            if (from && getYaw() === yaw && getPitch() === pitch) settle(from, getOrientation(), NO_TURNS);
        },
    });

    const turnTo = (face: CuboidFace) => {
        const orientation = getOrientation();
        const yaw = getYaw();
        const pitch = getPitch();
        const turns = CuboidUtils.getTurnsTo(face, (candidate) =>
            getIsUpright()
                ? CuboidUtils.getFacingFromOrientation(CuboidUtils.turnUpright(orientation, candidate))
                : CuboidUtils.getFacingFromTurns(yaw + candidate.yaw, pitch + candidate.pitch),
        );

        if (!turns || (turns.yaw === 0 && turns.pitch === 0)) return false;

        batch(() => {
            setYaw(yaw + turns.yaw);
            setPitch(pitch + turns.pitch);
        });

        return true;
    };

    const controller: CuboidController = { getFacing, turnTo };

    const getBodyTransform = () =>
        getIsUpright()
            ? CuboidUtils.getOrientationTransform(getOrientation(), getSize(), getDragTurns())
            : CuboidUtils.getTurnTransform(getYaw() + getDragTurns().yaw, getPitch() + getDragTurns().pitch, getSize());

    const getBodyTransitionDurationMs = () =>
        getIsUpright() || getIsSwiping() ? NO_DURATION : getTransitionDurationMs();

    onMount(() => {
        props.onMount?.(controller);
    });

    return (
        <div
            class={styles.cuboidRoot}
            style={{
                width: `${getReservedSize().width}px`,
                height: `${getReservedSize().height}px`,
            }}
            role="group"
            aria-roledescription={access(props.roleDescription) ?? CUBOID_DEFAULTS.roleDescription}
            aria-label={access(props.ariaLabel)}
        >
            <div
                ref={setPerspectiveRef}
                class={styles.cuboidPerspective}
                style={{
                    width: `${getSize().width}px`,
                    height: `${getSize().height}px`,
                    perspective: `${BarrelUtils.PERSPECTIVE_PX}px`,
                }}
            >
                <div
                    ref={setBodyRef}
                    class={styles.cuboidBody}
                    style={{
                        "transform": getBodyTransform(),
                        "transition-duration": `${getBodyTransitionDurationMs()}ms`,
                    }}
                >
                    <Index each={CUBOID_FACES}>
                        {(getFace) => {
                            const getIsShowing = () => getFace() === getFacing();

                            const getFaceSize = () => CuboidUtils.getFaceSize(getFace(), getSize());

                            return (
                                <div
                                    class={styles.cuboidFace}
                                    style={{
                                        width: `${getFaceSize().width}px`,
                                        height: `${getFaceSize().height}px`,
                                        left: `${(getSize().width - getFaceSize().width) * HALF}px`,
                                        top: `${(getSize().height - getFaceSize().height) * HALF}px`,
                                        transform: CuboidUtils.getFaceTransform(getFace(), getSize()),
                                    }}
                                    role="group"
                                    aria-roledescription={
                                        access(props.faceRoleDescription) ?? CUBOID_DEFAULTS.faceRoleDescription
                                    }
                                    aria-label={getFaceLabel(getFace())}
                                    aria-hidden={!getIsShowing() || undefined}
                                    inert={!getIsShowing()}
                                >
                                    {props.renderFace(getFace, () => getFaceState(getFace()))}
                                </div>
                            );
                        }}
                    </Index>
                </div>
            </div>
        </div>
    );
};
