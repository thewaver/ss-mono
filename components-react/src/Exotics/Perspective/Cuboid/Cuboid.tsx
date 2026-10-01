import { useEffect, useLayoutEffect, useRef, useState } from "react";

import {
    BarrelUtils,
    CUBOID_DEFAULTS,
    CUBOID_FACES,
    CuboidStyles,
    type CuboidTurns,
    CuboidUtils,
} from "@thewaver/ss-components";
import { type Matrix3d, StoreUtils } from "@thewaver/ss-utils";

import { InteractionTrackerReactUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerReact.utils";
import { useLatest } from "../../../Utils/refUtils";
import type { CuboidController, CuboidProps } from "./Cuboid.types";

const NO_DURATION = 0;
const DRAG_COMMIT_RATIO = 0.5;

const NO_TURNS: CuboidTurns = { yaw: 0, pitch: 0 };

type PendingSettle = { from: Matrix3d | undefined; to: Matrix3d; turns: CuboidTurns };

export const Cuboid = (props: CuboidProps) => {
    const [yaw, setYaw] = props.yaw;
    const [pitch, setPitch] = props.pitch;
    const size = props.size;
    const transitionDurationMs = props.transitionDurationMs ?? CUBOID_DEFAULTS.transitionDurationMs;
    const isUpright = props.isUpright ?? CUBOID_DEFAULTS.isUpright;
    const isDraggable = props.isDraggable ?? CUBOID_DEFAULTS.isDraggable;

    const perspectiveRef = useRef<HTMLDivElement | null>(null);
    const bodyRef = useRef<HTMLDivElement | null>(null);
    const pendingSettleRef = useRef<PendingSettle>(undefined);

    const [dragTurns, setDragTurns] = useState(NO_TURNS);
    const [tracked, setTracked] = useState(() => ({
        yaw,
        pitch,
        isUpright,
        orientation: CuboidUtils.standUpright(CuboidUtils.getCountedOrientation(yaw, pitch)),
    }));

    if (tracked.yaw !== yaw || tracked.pitch !== pitch || tracked.isUpright !== isUpright) {
        const from = CuboidUtils.readDrawnOrientation(bodyRef.current ?? undefined);
        let orientation = tracked.orientation;

        if (tracked.isUpright !== isUpright) {
            const counted = CuboidUtils.getCountedOrientation(yaw, pitch);

            orientation = CuboidUtils.standUpright(counted);
            pendingSettleRef.current = { from, to: isUpright ? orientation : counted, turns: NO_TURNS };
        } else if (isUpright) {
            const turns = { yaw: yaw - tracked.yaw, pitch: pitch - tracked.pitch };

            orientation = CuboidUtils.turnUpright(tracked.orientation, turns);
            pendingSettleRef.current = { from, to: orientation, turns };
        }

        setTracked({ yaw, pitch, isUpright, orientation });
    }

    const orientation = tracked.orientation;
    const facing = CuboidUtils.getFacing(isUpright, orientation, yaw, pitch);

    useLayoutEffect(() => {
        const pending = pendingSettleRef.current;

        if (!pending) return;

        pendingSettleRef.current = undefined;
        CuboidUtils.settle(
            bodyRef.current ?? undefined,
            pending.from,
            pending.to,
            size,
            pending.turns,
            transitionDurationMs,
        );
    });

    const latest = useLatest({ yaw, pitch, isUpright, orientation, dragTurns, setYaw, setPitch });

    const { isSwiping } = InteractionTrackerReactUtils.useFreeSwipe(perspectiveRef, !isDraggable, {
        commitRatio: DRAG_COMMIT_RATIO,
        onSwipe: (travel) => {
            if (isUpright) CuboidUtils.stopSettling(bodyRef.current ?? undefined);

            setDragTurns(CuboidUtils.getDragTurns(travel, CuboidUtils.getAcrossSign(isUpright, pitch)));
        },
        onSwipeEnd: (direction) => {
            const turns = CuboidUtils.getReleaseTurns(direction, dragTurns);
            const from = isUpright ? CuboidUtils.readDrawnOrientation(bodyRef.current ?? undefined) : undefined;

            setDragTurns(NO_TURNS);

            if (turns.yaw === 0 && turns.pitch === 0) {
                if (from) pendingSettleRef.current = { from, to: orientation, turns: NO_TURNS };

                return;
            }

            setYaw(yaw + turns.yaw);
            setPitch(pitch + turns.pitch);
        },
    });

    const [facingStore] = useState(() => StoreUtils.create(facing));

    useLayoutEffect(() => {
        facingStore.set(facing);
    });

    const [controller] = useState<CuboidController>(() => ({
        getFacing: facingStore.get,
        turnTo: (face) => {
            const current = latest.current;
            const turns = CuboidUtils.findTurnsTo(
                face,
                current.isUpright,
                current.orientation,
                current.yaw,
                current.pitch,
            );

            if (!turns) return false;

            current.setYaw(current.yaw + turns.yaw);
            current.setPitch(current.pitch + turns.pitch);

            return true;
        },
        subscribe: facingStore.subscribe,
    }));

    useEffect(() => {
        props.onMount?.(controller);
    }, [controller]);

    const reservedSize = CuboidUtils.getReservedSize(size);
    const faceRoleDescription = props.faceRoleDescription ?? CUBOID_DEFAULTS.faceRoleDescription;

    return (
        <div
            className={CuboidStyles.cuboidRoot}
            style={{ width: `${reservedSize.width}px`, height: `${reservedSize.height}px` }}
            role="group"
            aria-roledescription={props.roleDescription ?? CUBOID_DEFAULTS.roleDescription}
            aria-label={props.ariaLabel}
        >
            <div
                ref={perspectiveRef}
                className={CuboidStyles.cuboidPerspective}
                style={{
                    width: `${size.width}px`,
                    height: `${size.height}px`,
                    perspective: `${BarrelUtils.PERSPECTIVE_PX}px`,
                }}
            >
                <div
                    ref={bodyRef}
                    className={CuboidStyles.cuboidBody}
                    style={{
                        transform: CuboidUtils.getBodyTransform(isUpright, orientation, yaw, pitch, dragTurns, size),
                        transitionDuration: `${isUpright || isSwiping ? NO_DURATION : transitionDurationMs}ms`,
                    }}
                >
                    {CUBOID_FACES.map((face) => {
                        const isShowing = face === facing;
                        const faceBox = CuboidUtils.getFaceBox(face, size);

                        return (
                            <div
                                key={face}
                                className={CuboidStyles.cuboidFace}
                                style={{
                                    width: `${faceBox.width}px`,
                                    height: `${faceBox.height}px`,
                                    left: `${faceBox.left}px`,
                                    top: `${faceBox.top}px`,
                                    transform: CuboidUtils.getFaceTransform(face, size),
                                }}
                                role="group"
                                aria-roledescription={faceRoleDescription}
                                aria-label={props.computeFaceLabel(face)}
                                aria-hidden={isShowing ? undefined : "true"}
                                inert={!isShowing}
                            >
                                {props.renderFace(face, { face, isShowing })}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
