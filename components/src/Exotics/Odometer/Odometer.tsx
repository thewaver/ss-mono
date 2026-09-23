import type { Accessor } from "solid-js";
import { Index, createEffect, createMemo, createSignal, on, onCleanup, untrack } from "solid-js";

import { MediaQueryMonitorUtils } from "../../Abstracts/MediaQueryMonitor/MediaQueryMonitor.utils";
import { Barrel } from "../../Primitives/Barrel/Barrel";
import { access } from "../../Utils/propUtils";
import { ODOMETER_DEFAULTS } from "./Odometer.const";
import type { OdometerProps, OdometerShownSlot, OdometerSlotPhase } from "./Odometer.types";
import { OdometerUtils } from "./Odometer.utils";

import * as styles from "./Odometer.css";

const RESTING_ANGLE = 0;
const NO_DELAY = 0;
const NO_TURNS = 0;
const FIRST = 0;
const ZERO_WIDTH = "0px";

type FixedSlot = { character: string; order: number };

type DigitSlot = { order: number; digitIndex: number };

export const Odometer = (props: OdometerProps) => {
    const getSlots = createMemo(() => OdometerUtils.getSlots(access(props.text)));

    const getDigits = createMemo(() => OdometerUtils.getDigits(getSlots()));

    const getPrefersReducedMotion = MediaQueryMonitorUtils.createReducedMotion();

    let shownDigits = untrack(getDigits);
    let columnDigits = shownDigits;

    const [getAngles, setAngles] = createSignal(shownDigits.map(OdometerUtils.getRestingAngle));
    const [getDelays, setDelays] = createSignal<number[]>([]);
    const [getDurations, setDurations] = createSignal<(number | undefined)[]>([]);

    const getDigitSize = createMemo(() => access(props.digitSize));

    const getCascadeDelayMs = createMemo(() => access(props.cascadeDelayMs) ?? ODOMETER_DEFAULTS.cascadeDelayMs);

    const getTurnDurationMs = createMemo(() => access(props.turnDurationMs) ?? ODOMETER_DEFAULTS.turnDurationMs);

    const getFixedSlots = createMemo(() =>
        getSlots().flatMap((slot, order): FixedSlot[] =>
            slot.kind === "fixed" ? [{ character: slot.character, order }] : [],
        ),
    );

    const getDigitSlots = createMemo(() =>
        getSlots().flatMap((slot, order): DigitSlot[] =>
            slot.kind === "digit" ? [{ order, digitIndex: slot.digitIndex }] : [],
        ),
    );

    const [getShownFixed, setShownFixed] = createSignal<OdometerShownSlot<FixedSlot>[]>(
        OdometerUtils.computeShownSlots([], untrack(getFixedSlots), true),
    );
    const [getShownDigits, setShownDigits] = createSignal<OdometerShownSlot<DigitSlot>[]>(
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
                const direction = OdometerUtils.compareDigits(shownDigits, digits);
                const previous = getAngles();
                const isInstant = getPrefersReducedMotion();
                const reels = digits.map((_digit, index) => props.computeReel?.(index, digits.length));
                const isReeling = props.computeReel !== undefined;

                setDelays(
                    direction === "same" || isReeling
                        ? digits.map(() => NO_DELAY)
                        : OdometerUtils.computeCascadeDelays(shownDigits, digits, getCascadeDelayMs()),
                );

                setDurations(reels.map((reel) => reel?.durationMs));

                setAngles([
                    ...digits.map((digit, index) => {
                        const wasShowing = columnDigits[index];

                        if (wasShowing === undefined) return OdometerUtils.getRestingAngle(digit);

                        const extraTurns = isInstant ? NO_TURNS : (reels[index]?.extraTurns ?? NO_TURNS);

                        return (
                            (previous[index] ?? RESTING_ANGLE) +
                            OdometerUtils.computeAngleDelta(wasShowing, digit, direction) +
                            OdometerUtils.computeReelAngle(extraTurns, direction)
                        );
                    }),
                    ...(isInstant ? [] : previous.slice(digits.length)),
                ]);

                columnDigits = isInstant ? digits : [...digits, ...columnDigits.slice(digits.length)];
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

                if (phase === "shown" || !element) return;

                const fullWidth = `${getDigitSize().width}px`;
                const startWidth =
                    animation === undefined
                        ? phase === "entering"
                            ? ZERO_WIDTH
                            : fullWidth
                        : getComputedStyle(element).width;

                animation?.cancel();
                animation = element.animate(
                    [{ width: startWidth }, { width: phase === "entering" ? fullWidth : ZERO_WIDTH }],
                    { duration: getTurnDurationMs(), fill: phase === "leaving" ? "forwards" : "none" },
                );
                animation.onfinish = () => {
                    animation = undefined;

                    if (phase === "entering") onGrown();
                    else onShrunk();
                };
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
