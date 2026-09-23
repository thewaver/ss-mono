import { Index, createComputed, createMemo, createSignal, on, onCleanup, onMount, untrack } from "solid-js";

import { LiveAnnouncerUtils } from "../../Abstracts/LiveAnnouncer/LiveAnnouncer.utils";
import { SignalMirrorUtils } from "../../Abstracts/SignalMirror/SignalMirror.utils";
import { BarrelUtils } from "../../Primitives/Barrel/Barrel.utils";
import { access } from "../../Utils/propUtils";
import { DIE_DEFAULTS } from "./Die.const";
import type { DieFaceState, DieProps, DieQuaternion } from "./Die.types";
import { DieUtils } from "./Die.utils";

import * as styles from "./Die.css";

const NOTHING = 0;
const SETTLED = 1;
const HALF = 0.5;
const FIRST_FACE = 0;
const TURN = Math.PI * 2;
const EASE_POWER = 3;
const FRAME_STARVATION_SLACK_MS = 100;
const IDENTITY: DieQuaternion = { w: 1, x: 0, y: 0, z: 0 };

const easeOut = (progress: number) => SETTLED - (SETTLED - progress) ** EASE_POWER;

const pickTumbleAxis = () => ({ x: Math.random() - HALF, y: Math.random() - HALF, z: Math.random() * HALF });

export const Die = (props: DieProps) => {
    let frameId: number | undefined;
    let starvationHandle: ReturnType<typeof setTimeout> | undefined;
    let isWritingRollResult = false;

    const [getOrientation, setOrientation] = createSignal<DieQuaternion>(IDENTITY);
    const [getIsRolling, setIsRolling] = createSignal(false);
    const [getRestingFace, setRestingFace] = createSignal<number>();

    const [getFace, setFace] = SignalMirrorUtils.createOptional(() => props.faceSignal, FIRST_FACE);

    const getShape = createMemo(() => access(props.shape));

    const getSize = createMemo(() => access(props.size));

    const getReservedSize = createMemo(() => DieUtils.getReservedSize(getSize()));

    const getGeometry = createMemo(() => DieUtils.computeFaceGeometry(getShape(), getSize() * HALF));

    const getFaceCount = createMemo(() => getGeometry().length);

    const getShownFace = createMemo(() =>
        Math.min(Math.max(FIRST_FACE, Math.trunc(getFace())), getFaceCount() - SETTLED),
    );

    const getFacingQuaternion = (index: number) => {
        const face = getGeometry()[index];

        return face ? DieUtils.toQuaternion(DieUtils.computeFacingRotation(face)) : IDENTITY;
    };

    const stopTurn = () => {
        if (frameId !== undefined) cancelAnimationFrame(frameId);
        if (starvationHandle !== undefined) clearTimeout(starvationHandle);

        frameId = undefined;
        starvationHandle = undefined;
    };

    const land = (index: number, isRoll: boolean) => {
        stopTurn();
        setOrientation(getFacingQuaternion(index));
        setRestingFace(index);
        setIsRolling(false);
        LiveAnnouncerUtils.announce(props.computeFaceLabel(index));

        if (isRoll) props.onRollEnd?.(index);
    };

    const startTurn = (index: number, tumbleCount: number, isRoll: boolean) => {
        stopTurn();
        setRestingFace(undefined);

        const durationMs = access(props.rollDurationMs) ?? DIE_DEFAULTS.rollDurationMs;
        const from = getOrientation();
        const to = getFacingQuaternion(index);
        const axis = pickTumbleAxis();

        if (durationMs <= NOTHING) {
            land(index, isRoll);

            return;
        }

        const startedAt = performance.now();

        const advance = (now: number) => {
            const progress = easeOut(Math.min(SETTLED, (now - startedAt) / durationMs));

            if (progress >= SETTLED) {
                land(index, isRoll);

                return;
            }

            const tumble = DieUtils.fromAxisAngle(axis, TURN * tumbleCount * progress);

            setOrientation(DieUtils.multiply(tumble, DieUtils.slerp(from, to, progress)));
            frameId = requestAnimationFrame(advance);
        };

        starvationHandle = setTimeout(() => land(index, isRoll), durationMs + FRAME_STARVATION_SLACK_MS);
        frameId = requestAnimationFrame(advance);
    };

    createComputed(
        on(getShownFace, (index, previous) => {
            if (previous === undefined) {
                setOrientation(getFacingQuaternion(index));
                setRestingFace(index);

                return;
            }

            if (isWritingRollResult) return;

            startTurn(index, NOTHING, false);
        }),
    );

    createComputed(
        on(getGeometry, () => {
            if (untrack(getIsRolling)) return;

            setOrientation(getFacingQuaternion(untrack(getShownFace)));
            setRestingFace(untrack(getShownFace));
        }),
    );

    const roll = () => {
        if (getIsRolling()) return false;

        setIsRolling(true);

        void Promise.resolve(props.computeRollTarget()).then((target) => {
            const index = Math.min(Math.max(FIRST_FACE, Math.trunc(target)), getFaceCount() - SETTLED);

            isWritingRollResult = true;
            setFace(index);
            isWritingRollResult = false;

            startTurn(index, access(props.tumbleCount) ?? DIE_DEFAULTS.tumbleCount, true);
        });

        return true;
    };

    onMount(() => {
        LiveAnnouncerUtils.reserve("polite");
        props.onMount?.({ getIsRolling, roll });
    });

    onCleanup(stopTurn);

    const getFaceState = (index: number): DieFaceState => ({
        index,
        isShowing: index === getRestingFace(),
        normal: getGeometry()[index]?.normal ?? { x: 0, y: 0, z: 1 },
        size: getGeometry()[index]?.size ?? { width: 0, height: 0 },
    });

    return (
        <div
            class={styles.dieRoot}
            style={{ width: `${getReservedSize().width}px`, height: `${getReservedSize().height}px` }}
            role="group"
            aria-roledescription={access(props.roleDescription) ?? DIE_DEFAULTS.roleDescription}
            aria-label={access(props.ariaLabel)}
            aria-busy={getIsRolling() || undefined}
        >
            <div
                class={styles.diePerspective}
                style={{
                    width: `${getSize()}px`,
                    height: `${getSize()}px`,
                    perspective: `${BarrelUtils.PERSPECTIVE_PX}px`,
                }}
            >
                <div
                    class={styles.dieBody}
                    style={{
                        transform: `translateZ(${-getSize() * HALF}px) ${DieUtils.toTransform(DieUtils.toRotation(getOrientation()))}`,
                    }}
                >
                    <Index each={getGeometry()}>
                        {(getFaceGeometry, index) => {
                            const getIsShowing = () => index === getRestingFace();

                            return (
                                <div
                                    class={styles.dieFace}
                                    style={{
                                        "width": `${getFaceGeometry().size.width}px`,
                                        "height": `${getFaceGeometry().size.height}px`,
                                        "left": `${(getSize() - getFaceGeometry().size.width) * HALF}px`,
                                        "top": `${(getSize() - getFaceGeometry().size.height) * HALF}px`,
                                        "transform": DieUtils.computeFaceTransform(getFaceGeometry()),
                                        "clip-path": `polygon(${getFaceGeometry()
                                            .outline.map(
                                                (point) =>
                                                    `${point.x + getFaceGeometry().size.width * HALF}px ${point.y + getFaceGeometry().size.height * HALF}px`,
                                            )
                                            .join(",")})`,
                                    }}
                                    role="group"
                                    aria-roledescription={
                                        access(props.faceRoleDescription) ?? DIE_DEFAULTS.faceRoleDescription
                                    }
                                    aria-label={props.computeFaceLabel(index)}
                                    aria-hidden={!getIsShowing() || undefined}
                                    inert={!getIsShowing()}
                                >
                                    {props.renderFace(
                                        () => index,
                                        () => getFaceState(index),
                                    )}
                                </div>
                            );
                        }}
                    </Index>
                </div>
            </div>
        </div>
    );
};
