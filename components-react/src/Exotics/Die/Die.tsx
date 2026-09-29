import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { BarrelUtils, DIE_DEFAULTS, DieStyles, DieUtils, LiveAnnouncerUtils } from "@thewaver/ss-components";
import { StoreUtils } from "@thewaver/ss-utils";

import { SignalMirrorReactUtils } from "../../Abstracts/SignalMirror/SignalMirrorReact.utils";
import { useLatest } from "../../Utils/refUtils";
import { useStore } from "../../Utils/storeUtils";
import type { DieController, DieProps } from "./Die.types";

const HALF = 0.5;
const FIRST_FACE = 0;

export const Die = (props: DieProps) => {
    const [face, setFace] = SignalMirrorReactUtils.useOptionalState(props.face, FIRST_FACE);
    const size = props.size;

    const reservedSize = DieUtils.getReservedSize(size);
    const geometry = useMemo(() => DieUtils.computeFaceGeometry(props.shape, size * HALF), [props.shape, size]);
    const shownFace = DieUtils.clampFace(face, geometry.length);

    const latest = useLatest({ props, geometry, shownFace, setFace });

    const [roller] = useState(() =>
        DieUtils.createRoller({
            getGeometry: () => latest.current.geometry,
            getShownFace: () => latest.current.shownFace,
            getRollDurationMs: () => latest.current.props.rollDurationMs ?? DIE_DEFAULTS.rollDurationMs,
            getTumbleCount: () => latest.current.props.tumbleCount ?? DIE_DEFAULTS.tumbleCount,
            computeRollTarget: () => latest.current.props.computeRollTarget(),
            computeFaceLabel: (index) => latest.current.props.computeFaceLabel(index),
            writeFace: (index) => latest.current.setFace(index),
            onRollEnd: (index) => latest.current.props.onRollEnd?.(index),
        }),
    );

    useEffect(() => () => roller.stop(), [roller]);

    const orientation = useStore(roller, (state) => state.orientation);
    const isRolling = useStore(roller, (state) => state.isRolling);
    const restingFace = useStore(roller, (state) => state.restingFace);

    const previousShownFaceRef = useRef<number>(undefined);

    useLayoutEffect(() => {
        const previous = previousShownFaceRef.current;

        previousShownFaceRef.current = shownFace;

        if (previous === undefined) {
            roller.rest(shownFace);
        } else if (previous !== shownFace) {
            roller.turnTo(shownFace);
        }
    }, [shownFace]);

    useLayoutEffect(() => {
        roller.reshape(latest.current.shownFace);
    }, [geometry]);

    const [rollingStore] = useState(() => StoreUtils.create(roller.get().isRolling));

    useEffect(() => roller.subscribe(() => rollingStore.set(roller.get().isRolling)), [roller]);

    const [controller] = useState<DieController>(() => ({
        getIsRolling: rollingStore.get,
        roll: roller.roll,
        subscribe: rollingStore.subscribe,
    }));

    useEffect(() => {
        LiveAnnouncerUtils.reserve("polite");
        props.onMount?.(controller);
    }, [controller]);

    const faceRoleDescription = props.faceRoleDescription ?? DIE_DEFAULTS.faceRoleDescription;

    return (
        <div
            className={DieStyles.dieRoot}
            style={{ width: `${reservedSize.width}px`, height: `${reservedSize.height}px` }}
            role="group"
            aria-roledescription={props.roleDescription ?? DIE_DEFAULTS.roleDescription}
            aria-label={props.ariaLabel}
            aria-busy={isRolling ? "true" : undefined}
        >
            <div
                className={DieStyles.diePerspective}
                style={{ width: `${size}px`, height: `${size}px`, perspective: `${BarrelUtils.PERSPECTIVE_PX}px` }}
            >
                <div className={DieStyles.dieBody} style={{ transform: DieUtils.getBodyTransform(orientation, size) }}>
                    {geometry.map((faceGeometry, index) => {
                        const isShowing = index === restingFace;
                        const faceBox = DieUtils.getFaceBox(faceGeometry, size);

                        return (
                            <div
                                key={index}
                                className={DieStyles.dieFace}
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
                                aria-hidden={isShowing ? undefined : "true"}
                                inert={!isShowing}
                            >
                                {props.renderFace(index, DieUtils.getFaceState(geometry, index, restingFace))}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
