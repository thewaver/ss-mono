import { Index, batch, createComputed, createMemo, createSignal, on, onMount, untrack } from "solid-js";

import {
    BarrelUtils,
    CUBOID_DEFAULTS,
    CUBOID_FACES,
    type CuboidFace,
    type CuboidFaceState,
    type CuboidTurns,
    CuboidUtils,
    CuboidStyles as styles,
} from "@thewaver/ss-components";
import type { Matrix3d } from "@thewaver/ss-utils";

import { InteractionTrackerSolidUtils } from "../../Abstracts/InteractionTracker/InteractionTrackerSolid.utils";
import { access, accessSignal } from "../../Utils/propUtils";
import type { CuboidController, CuboidProps } from "./CuboidSolid.types";

const NO_DURATION = 0;
const DRAG_COMMIT_RATIO = 0.5;

const NO_TURNS: CuboidTurns = { yaw: 0, pitch: 0 };

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

    const getFacing = createMemo(() => CuboidUtils.getFacing(getIsUpright(), getOrientation(), getYaw(), getPitch()));

    const getFaceLabel = (face: CuboidFace) => props.computeFaceLabel(face);

    const getFaceState = (face: CuboidFace): CuboidFaceState => ({
        face,
        isShowing: face === getFacing(),
    });

    const readDrawnOrientation = () => CuboidUtils.readDrawnOrientation(getBodyRef());

    const stopSettling = () => CuboidUtils.stopSettling(getBodyRef());

    const settle = (from: Matrix3d | undefined, to: Matrix3d, turns: CuboidTurns) =>
        CuboidUtils.settle(getBodyRef(), from, to, getSize(), turns, getTransitionDurationMs());

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

    const getAcrossSign = () => CuboidUtils.getAcrossSign(getIsUpright(), getPitch());

    const { getIsSwiping } = InteractionTrackerSolidUtils.trackFreeSwipe(getPerspectiveRef, () => !getIsDraggable(), {
        getCommitRatio: () => DRAG_COMMIT_RATIO,
        onSwipe: (travel) => {
            if (getIsUpright()) stopSettling();

            setDragTurns(CuboidUtils.getDragTurns(travel, getAcrossSign()));
        },
        onSwipeEnd: (direction) => {
            const turns = CuboidUtils.getReleaseTurns(direction, getDragTurns());
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
        const yaw = getYaw();
        const pitch = getPitch();
        const turns = CuboidUtils.findTurnsTo(face, getIsUpright(), getOrientation(), yaw, pitch);

        if (!turns) return false;

        batch(() => {
            setYaw(yaw + turns.yaw);
            setPitch(pitch + turns.pitch);
        });

        return true;
    };

    const controller: CuboidController = { getFacing, turnTo };

    const getBodyTransform = () =>
        CuboidUtils.getBodyTransform(getIsUpright(), getOrientation(), getYaw(), getPitch(), getDragTurns(), getSize());

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

                            const getFaceBox = () => CuboidUtils.getFaceBox(getFace(), getSize());

                            return (
                                <div
                                    class={styles.cuboidFace}
                                    style={{
                                        width: `${getFaceBox().width}px`,
                                        height: `${getFaceBox().height}px`,
                                        left: `${getFaceBox().left}px`,
                                        top: `${getFaceBox().top}px`,
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
