import type { Accessor } from "solid-js";
import { Index, createEffect, createMemo, createSignal, on, onCleanup, untrack } from "solid-js";

import {
    ODOMETER_DEFAULTS,
    type OdometerDigitSlot,
    type OdometerFixedSlot,
    type OdometerShownSlot,
    type OdometerSlotPhase,
    OdometerUtils,
    OdometerStyles as styles,
} from "@thewaver/ss-components";

import { MediaQueryMonitorSolidUtils } from "../../../Abstracts/MediaQueryMonitor/MediaQueryMonitorSolid.utils";
import { Barrel } from "../../../Primitives/Barrel/Barrel";
import { access } from "../../../Utils/propUtils";
import type { OdometerProps } from "./OdometerSolid.types";

const RESTING_ANGLE = 0;
const NO_DELAY = 0;
const FIRST = 0;

export const Odometer = (props: OdometerProps) => {
    const getSlots = createMemo(() => OdometerUtils.getSlots(access(props.text)));

    const getDigits = createMemo(() => OdometerUtils.getDigits(getSlots()));

    const getPrefersReducedMotion = MediaQueryMonitorSolidUtils.createReducedMotion();

    let shownDigits = untrack(getDigits);
    let columnDigits = shownDigits;

    const [getAngles, setAngles] = createSignal(shownDigits.map(OdometerUtils.getRestingAngle));
    const [getDelays, setDelays] = createSignal<number[]>([]);
    const [getDurations, setDurations] = createSignal<(number | undefined)[]>([]);

    const getDigitSize = createMemo(() => access(props.digitSize));

    const getCascadeDelayMs = createMemo(() => access(props.cascadeDelayMs) ?? ODOMETER_DEFAULTS.cascadeDelayMs);

    const getTurnDurationMs = createMemo(() => access(props.turnDurationMs) ?? ODOMETER_DEFAULTS.turnDurationMs);

    const getFixedSlots = createMemo(() => OdometerUtils.getFixedSlots(getSlots()));

    const getDigitSlots = createMemo(() => OdometerUtils.getDigitSlots(getSlots()));

    const [getShownFixed, setShownFixed] = createSignal<OdometerShownSlot<OdometerFixedSlot>[]>(
        OdometerUtils.computeShownSlots([], untrack(getFixedSlots), true),
    );
    const [getShownDigits, setShownDigits] = createSignal<OdometerShownSlot<OdometerDigitSlot>[]>(
        OdometerUtils.computeShownSlots([], untrack(getDigitSlots), true),
    );

    createEffect(
        on(
            getFixedSlots,
            (slots) => {
                setShownFixed((shown) => OdometerUtils.computeShownSlots(shown, slots, getPrefersReducedMotion()));
            },
            { defer: true },
        ),
    );

    createEffect(
        on(
            getDigitSlots,
            (slots) => {
                setShownDigits((shown) => OdometerUtils.computeShownSlots(shown, slots, getPrefersReducedMotion()));
            },
            { defer: true },
        ),
    );

    createEffect(
        on(
            getDigits,
            (digits) => {
                const computeReel = props.computeReel;
                const turn = OdometerUtils.computeTurn({
                    shownDigits,
                    columnDigits,
                    angles: getAngles(),
                    digits,
                    isInstant: getPrefersReducedMotion(),
                    reels: computeReel && digits.map((_digit, index) => computeReel(index, digits.length)),
                    cascadeDelayMs: getCascadeDelayMs(),
                });

                setDelays(turn.delays);
                setDurations(turn.durations);
                setAngles(turn.angles);

                columnDigits = turn.columnDigits;
                shownDigits = digits;
            },
            { defer: true },
        ),
    );

    const getAngle = (digitIndex: number) => getAngles()[digitIndex] ?? RESTING_ANGLE;

    const getDelay = (digitIndex: number) => getDelays()[digitIndex] ?? NO_DELAY;

    const getDuration = (digitIndex: number) => getDurations()[digitIndex] ?? getTurnDurationMs();

    const dropDigitColumn = (index: number) => {
        setShownDigits((shown) => OdometerUtils.dropShownSlot(shown, index));

        if (index < shownDigits.length) return;

        setAngles((angles) => angles.slice(FIRST, index));
        columnDigits = columnDigits.slice(FIRST, index);
    };

    const trackSlotWidth = (
        getElement: () => HTMLElement | undefined,
        getPhase: Accessor<OdometerSlotPhase>,
        onGrown: () => void,
        onShrunk: () => void,
    ) => {
        let animation: Animation | undefined;

        createEffect(
            on(getPhase, (phase) => {
                const element = getElement();

                if (!element) return;

                animation = OdometerUtils.animateSlotWidth(
                    element,
                    phase,
                    animation,
                    getDigitSize().width,
                    getTurnDurationMs(),
                    () => {
                        animation = undefined;

                        if (phase === "entering") onGrown();
                        else onShrunk();
                    },
                );
            }),
        );

        onCleanup(() => {
            animation?.cancel();
        });
    };

    return (
        <div class={styles.odometerRoot} role="group" aria-label={access(props.ariaLabel)}>
            <span class={styles.odometerValue}>{access(props.text)}</span>

            <Index each={getShownFixed()}>
                {(getShown, index) => {
                    let element: HTMLDivElement | undefined;

                    const getFlags = createMemo(() => OdometerUtils.getSlotFlags(getShown().phase));

                    trackSlotWidth(
                        () => element,
                        () => getShown().phase,
                        () => setShownFixed((shown) => OdometerUtils.settleShownSlot(shown, index)),
                        () => setShownFixed((shown) => OdometerUtils.dropShownSlot(shown, index)),
                    );

                    return (
                        <div
                            ref={(node) => (element = node)}
                            class={styles.odometerFixed}
                            classList={{ [styles.odometerFixedClipped]: getShown().phase !== "shown" }}
                            style={{
                                order: getShown().slot.order,
                                width: `${getDigitSize().width}px`,
                                height: `${getDigitSize().height}px`,
                            }}
                            aria-hidden="true"
                        >
                            {props.renderFixed?.(() => getShown().slot.character, getFlags) ??
                                getShown().slot.character}
                        </div>
                    );
                }}
            </Index>

            <Index each={getShownDigits()}>
                {(getShown, index) => {
                    let element: HTMLDivElement | undefined;

                    const getFlags = createMemo(() => OdometerUtils.getSlotFlags(getShown().phase));

                    const getDigitIndex = () => getShown().slot.digitIndex;

                    trackSlotWidth(
                        () => element,
                        () => getShown().phase,
                        () => setShownDigits((shown) => OdometerUtils.settleShownSlot(shown, index)),
                        () => dropDigitColumn(index),
                    );

                    return (
                        <div
                            ref={(node) => (element = node)}
                            class={styles.odometerWindow}
                            style={{
                                order: getShown().slot.order,
                                width: `${getDigitSize().width}px`,
                                height: `${getDigitSize().height}px`,
                            }}
                        >
                            <div class={styles.odometerBarrel}>
                                <Barrel
                                    faces={OdometerUtils.DIGITS}
                                    axis={"column"}
                                    hasBacks={false}
                                    faceSize={getDigitSize}
                                    angle={() => getAngle(getDigitIndex())}
                                    transitionDurationMs={() => getDuration(getDigitIndex())}
                                    transitionDelayMs={() => getDelay(getDigitIndex())}
                                    faceRoleDescription={""}
                                    computeFaceDefs={() => ({ ariaLabel: "", isHidden: true })}
                                    renderFace={(getFace) => (
                                        <div class={styles.odometerDigitFace}>
                                            {props.renderDigit?.(getFace, getFlags) ?? getFace()}
                                        </div>
                                    )}
                                />
                            </div>
                        </div>
                    );
                }}
            </Index>
        </div>
    );
};
