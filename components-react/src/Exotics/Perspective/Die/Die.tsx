import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { BarrelUtils, DIE_DEFAULTS, DieStyles, DieUtils, type RollerPhase } from "@thewaver/ss-components";
import { StoreUtils } from "@thewaver/ss-utils";

import { RollerReactUtils } from "../../../Abstracts/Roller/RollerReact.utils";
import type { DieController, DieProps } from "./Die.types";

const HALF = 0.5;

type DieSnapshot = {
    currentFace: number;
    phase: RollerPhase;
    isRollable: boolean;
    isRolling: boolean;
    isAutoSpinning: boolean;
};

const getIsSameSnapshot = (a: DieSnapshot, b: DieSnapshot) =>
    a.currentFace === b.currentFace &&
    a.phase === b.phase &&
    a.isRollable === b.isRollable &&
    a.isRolling === b.isRolling &&
    a.isAutoSpinning === b.isAutoSpinning;

export const Die = (props: DieProps) => {
    const size = props.size;
    const isMovable = props.isMovable ?? DIE_DEFAULTS.isMovable;
    const isSeeThrough = props.isSeeThrough ?? DIE_DEFAULTS.isSeeThrough;

    const rootRef = useRef<HTMLDivElement | null>(null);
    const reservedSize = DieUtils.getReservedSize(size);
    const geometry = useMemo(() => DieUtils.computeFaceGeometry(props.shape, size * HALF), [props.shape, size]);

    const roller = RollerReactUtils.useRoller(rootRef, false, {
        faces: geometry,
        radius: size * HALF,
        targetFace: props.face,
        isAutoSpinEnabled: props.autoSpin?.[0],
        rollDurationMs: props.rollDurationMs,
        settleDurationMs: props.settleDurationMs,
        restDurationMs: props.restDurationMs,
        tumbleCount: props.tumbleCount,
        momentumMs: props.momentumMs,
        idleDelayMs: props.idleDelayMs,
        driftAxis: props.driftAxis,
        isMovable,
        computeRollTarget: props.computeRollTarget,
        computeFaceLabel: props.computeFaceLabel,
        onRollEnd: props.onRollEnd,
    });

    const snapshot: DieSnapshot = {
        currentFace: roller.currentFace,
        phase: roller.phase,
        isRollable: roller.isRollable,
        isRolling: roller.isAwaitingTarget || roller.phase === "rolling",
        isAutoSpinning: roller.phase === "idling",
    };

    const [controllerStore] = useState(() => StoreUtils.create(snapshot, { isEqual: getIsSameSnapshot }));

    useLayoutEffect(() => {
        controllerStore.set(snapshot);
    });

    const [controller] = useState<DieController>(() => ({
        getCurrentFace: () => controllerStore.get().currentFace,
        getPhase: () => controllerStore.get().phase,
        getIsRollable: () => controllerStore.get().isRollable,
        getIsRolling: () => controllerStore.get().isRolling,
        getIsAutoSpinning: () => controllerStore.get().isAutoSpinning,
        roll: roller.roll,
        step: roller.step,
        subscribe: controllerStore.subscribe,
    }));

    useEffect(() => {
        props.onMount?.(controller);
    }, [controller]);

    const faceRoleDescription = props.faceRoleDescription ?? DIE_DEFAULTS.faceRoleDescription;

    return (
        <div
            ref={rootRef}
            className={[DieStyles.dieRoot, isMovable && DieStyles.dieRootMovable].filter(Boolean).join(" ")}
            style={{ width: `${reservedSize.width}px`, height: `${reservedSize.height}px` }}
            role="group"
            tabIndex={isMovable ? 0 : undefined}
            aria-roledescription={props.roleDescription ?? DIE_DEFAULTS.roleDescription}
            aria-label={props.ariaLabel}
            aria-busy={roller.isBusy ? "true" : undefined}
        >
            <div
                className={DieStyles.diePerspective}
                style={{ width: `${size}px`, height: `${size}px`, perspective: `${BarrelUtils.PERSPECTIVE_PX}px` }}
            >
                <div
                    className={DieStyles.dieBody}
                    style={{ transform: DieUtils.getBodyTransform(roller.orientation, size) }}
                >
                    {geometry.map((faceGeometry, index) => {
                        const isTarget = index === roller.targetFace;
                        const faceBox = DieUtils.getFaceBox(faceGeometry, size);

                        return (
                            <div
                                key={index}
                                className={[DieStyles.dieFace, isSeeThrough && DieStyles.dieFaceSeeThrough]
                                    .filter(Boolean)
                                    .join(" ")}
                                style={{
                                    width: `${faceGeometry.size.width}px`,
                                    height: `${faceGeometry.size.height}px`,
                                    left: `${faceBox.left}px`,
                                    top: `${faceBox.top}px`,
                                    transform: DieUtils.computeFaceTransform(faceGeometry),
                                    clipPath: faceBox.clipPath,
                                }}
                                role="group"
                                aria-roledescription={faceRoleDescription}
                                aria-label={props.computeFaceLabel(index)}
                                aria-hidden={isTarget ? undefined : "true"}
                                inert={!isTarget}
                            >
                                {props.renderFace(index, DieUtils.getFaceState(geometry, index, roller.restingFace))}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
