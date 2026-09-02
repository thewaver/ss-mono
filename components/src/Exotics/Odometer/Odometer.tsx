import { Index, createEffect, createMemo, createSignal, on, untrack } from "solid-js";

import { Barrel } from "../../Abstracts/Barrel/Barrel";
import { access } from "../../Utils/propUtils";
import type { OdometerProps } from "./Odometer.types";
import { ODOMETER_DIGITS, OdometerUtils } from "./Odometer.utils";

import * as styles from "./Odometer.css";

const DEFAULT_TURN_DURATION_MS = 600;
const DEFAULT_CASCADE_DELAY_MS = 90;
const RESTING_ANGLE = 0;
const NO_DELAY = 0;

export const Odometer = (props: OdometerProps) => {
    const getSlots = createMemo(() => OdometerUtils.getSlots(access(props.text)));

    const getDigits = createMemo(() => OdometerUtils.getDigits(getSlots()));

    let shownDigits = untrack(getDigits);

    const [getAngles, setAngles] = createSignal(shownDigits.map(OdometerUtils.getRestingAngle));
    const [getDelays, setDelays] = createSignal<number[]>([]);

    const getDigitSize = createMemo(() => access(props.digitSize));

    const getCascadeDelayMs = createMemo(() => access(props.cascadeDelayMs) ?? DEFAULT_CASCADE_DELAY_MS);

    createEffect(
        on(
            getDigits,
            (digits) => {
                const direction = OdometerUtils.compareDigits(shownDigits, digits);
                const previous = getAngles();

                setDelays(
                    direction === "same"
                        ? digits.map(() => NO_DELAY)
                        : OdometerUtils.computeCascadeDelays(shownDigits, digits, getCascadeDelayMs()),
                );

                setAngles(
                    digits.map((digit, index) => {
                        const wasShowing = shownDigits[index];

                        if (wasShowing === undefined) return OdometerUtils.getRestingAngle(digit);

                        return (
                            (previous[index] ?? RESTING_ANGLE) +
                            OdometerUtils.computeAngleDelta(wasShowing, digit, direction)
                        );
                    }),
                );

                shownDigits = digits;
            },
            { defer: true },
        ),
    );

    const getAngle = (digitIndex: number) => getAngles()[digitIndex] ?? RESTING_ANGLE;

    const getDelay = (digitIndex: number) => getDelays()[digitIndex] ?? NO_DELAY;

    const getFixedSlots = createMemo(() =>
        getSlots().flatMap((slot, order) => (slot.kind === "fixed" ? [{ character: slot.character, order }] : [])),
    );

    const getDigitOrders = createMemo(() =>
        getSlots().flatMap((slot, order) => (slot.kind === "digit" ? [order] : [])),
    );

    return (
        <div class={styles.odometerRoot} aria-label={access(props.ariaLabel)}>
            <span class={styles.odometerValue}>{access(props.text)}</span>

            <Index each={getFixedSlots()}>
                {(getSlot) => (
                    <div
                        class={styles.odometerFixed}
                        style={{
                            order: getSlot().order,
                            width: `${getDigitSize().width}px`,
                            height: `${getDigitSize().height}px`,
                        }}
                        aria-hidden="true"
                    >
                        {props.renderFixed?.(() => getSlot().character) ?? getSlot().character}
                    </div>
                )}
            </Index>

            <Index each={getDigitOrders()}>
                {(getOrder, digitIndex) => (
                    <div
                        class={styles.odometerWindow}
                        style={{
                            order: getOrder(),
                            width: `${getDigitSize().width}px`,
                            height: `${getDigitSize().height}px`,
                        }}
                    >
                        <div class={styles.odometerBarrel}>
                            <Barrel
                                faces={ODOMETER_DIGITS}
                                axis={"column"}
                                hasBacks={false}
                                faceSize={getDigitSize}
                                angle={() => getAngle(digitIndex)}
                                transitionDurationMs={() => access(props.turnDurationMs) ?? DEFAULT_TURN_DURATION_MS}
                                transitionDelayMs={() => getDelay(digitIndex)}
                                faceRoleDescription={""}
                                computeFaceDefs={() => ({ ariaLabel: "", isHidden: true })}
                                renderFace={(getFace) => (
                                    <div class={styles.odometerDigitFace}>
                                        {props.renderDigit?.(getFace) ?? getFace()}
                                    </div>
                                )}
                            />
                        </div>
                    </div>
                )}
            </Index>
        </div>
    );
};
