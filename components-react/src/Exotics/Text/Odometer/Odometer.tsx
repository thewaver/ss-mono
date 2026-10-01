import { type CSSProperties, type ReactNode, useLayoutEffect, useMemo, useRef, useState } from "react";

import {
    ODOMETER_DEFAULTS,
    type OdometerDigitSlot,
    type OdometerFixedSlot,
    type OdometerSlotPhase,
    OdometerStyles,
    OdometerUtils,
} from "@thewaver/ss-components";

import { MediaQueryMonitorReactUtils } from "../../../Abstracts/MediaQueryMonitor/MediaQueryMonitorReact.utils";
import { Barrel } from "../../../Primitives/Barrel/Barrel";
import { useLatest } from "../../../Utils/refUtils";
import type { OdometerProps } from "./Odometer.types";

const RESTING_ANGLE = 0;
const NO_DELAY = 0;
const FIRST = 0;

type SlotProps = {
    phase: OdometerSlotPhase;
    widthPx: number;
    durationMs: number;
    className: string;
    style: CSSProperties;
    isHidden?: boolean;
    onGrown: () => void;
    onShrunk: () => void;
    children: ReactNode;
};

const OdometerSlot = (props: SlotProps) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const animationRef = useRef<Animation>(undefined);
    const latest = useLatest(props);

    useLayoutEffect(() => {
        const element = ref.current;

        if (!element) return;

        const phase = props.phase;

        animationRef.current = OdometerUtils.animateSlotWidth(
            element,
            phase,
            animationRef.current,
            latest.current.widthPx,
            latest.current.durationMs,
            () => {
                animationRef.current = undefined;

                if (phase === "entering") latest.current.onGrown();
                else latest.current.onShrunk();
            },
        );
    }, [props.phase]);

    useLayoutEffect(
        () => () => {
            animationRef.current?.cancel();
            animationRef.current = undefined;
        },
        [],
    );

    return (
        <div
            ref={ref}
            className={props.className}
            style={props.style}
            aria-hidden={props.isHidden ? "true" : undefined}
        >
            {props.children}
        </div>
    );
};

export const Odometer = (props: OdometerProps) => {
    const slots = useMemo(() => OdometerUtils.getSlots(props.text), [props.text]);
    const digits = useMemo(() => OdometerUtils.getDigits(slots), [slots]);
    const prefersReducedMotion = MediaQueryMonitorReactUtils.useReducedMotion();

    const digitSize = props.digitSize;
    const cascadeDelayMs = props.cascadeDelayMs ?? ODOMETER_DEFAULTS.cascadeDelayMs;
    const turnDurationMs = props.turnDurationMs ?? ODOMETER_DEFAULTS.turnDurationMs;

    const [board, setBoard] = useState(() => ({
        slots,
        shownDigits: digits,
        columnDigits: digits,
        angles: digits.map(OdometerUtils.getRestingAngle),
        delays: [] as number[],
        durations: [] as (number | undefined)[],
        fixed: OdometerUtils.computeShownSlots<OdometerFixedSlot>([], OdometerUtils.getFixedSlots(slots), true),
        digitSlots: OdometerUtils.computeShownSlots<OdometerDigitSlot>([], OdometerUtils.getDigitSlots(slots), true),
    }));

    if (board.slots !== slots) {
        const computeReel = props.computeReel;
        const turn = OdometerUtils.computeTurn({
            shownDigits: board.shownDigits,
            columnDigits: board.columnDigits,
            angles: board.angles,
            digits,
            isInstant: prefersReducedMotion,
            reels: computeReel && digits.map((_digit, index) => computeReel(index, digits.length)),
            cascadeDelayMs,
        });

        setBoard({
            slots,
            shownDigits: digits,
            columnDigits: turn.columnDigits,
            angles: turn.angles,
            delays: turn.delays,
            durations: turn.durations,
            fixed: OdometerUtils.computeShownSlots(
                board.fixed,
                OdometerUtils.getFixedSlots(slots),
                prefersReducedMotion,
            ),
            digitSlots: OdometerUtils.computeShownSlots(
                board.digitSlots,
                OdometerUtils.getDigitSlots(slots),
                prefersReducedMotion,
            ),
        });
    }

    const settleFixed = (index: number) =>
        setBoard((current) => ({ ...current, fixed: OdometerUtils.settleShownSlot(current.fixed, index) }));

    const dropFixed = (index: number) =>
        setBoard((current) => ({ ...current, fixed: OdometerUtils.dropShownSlot(current.fixed, index) }));

    const settleDigit = (index: number) =>
        setBoard((current) => ({ ...current, digitSlots: OdometerUtils.settleShownSlot(current.digitSlots, index) }));

    const dropDigitColumn = (index: number) =>
        setBoard((current) => {
            const digitSlots = OdometerUtils.dropShownSlot(current.digitSlots, index);

            if (index < current.shownDigits.length) return { ...current, digitSlots };

            return {
                ...current,
                digitSlots,
                angles: current.angles.slice(FIRST, index),
                columnDigits: current.columnDigits.slice(FIRST, index),
            };
        });

    const slotSize = { width: `${digitSize.width}px`, height: `${digitSize.height}px` };

    return (
        <div className={OdometerStyles.odometerRoot} role="group" aria-label={props.ariaLabel}>
            <span className={OdometerStyles.odometerValue}>{props.text}</span>

            {board.fixed.map((shown, index) => {
                const flags = OdometerUtils.getSlotFlags(shown.phase);

                return (
                    <OdometerSlot
                        key={index}
                        phase={shown.phase}
                        widthPx={digitSize.width}
                        durationMs={turnDurationMs}
                        className={[
                            OdometerStyles.odometerFixed,
                            shown.phase === "shown" ? undefined : OdometerStyles.odometerFixedClipped,
                        ]
                            .filter(Boolean)
                            .join(" ")}
                        style={{ order: shown.slot.order, ...slotSize }}
                        isHidden={true}
                        onGrown={() => settleFixed(index)}
                        onShrunk={() => dropFixed(index)}
                    >
                        {props.renderFixed?.(shown.slot.character, flags) ?? shown.slot.character}
                    </OdometerSlot>
                );
            })}

            {board.digitSlots.map((shown, index) => {
                const flags = OdometerUtils.getSlotFlags(shown.phase);
                const digitIndex = shown.slot.digitIndex;

                return (
                    <OdometerSlot
                        key={index}
                        phase={shown.phase}
                        widthPx={digitSize.width}
                        durationMs={turnDurationMs}
                        className={OdometerStyles.odometerWindow}
                        style={{ order: shown.slot.order, ...slotSize }}
                        onGrown={() => settleDigit(index)}
                        onShrunk={() => dropDigitColumn(index)}
                    >
                        <div className={OdometerStyles.odometerBarrel}>
                            <Barrel
                                faces={OdometerUtils.DIGITS}
                                axis="column"
                                hasBacks={false}
                                faceSize={digitSize}
                                angle={board.angles[digitIndex] ?? RESTING_ANGLE}
                                transitionDurationMs={board.durations[digitIndex] ?? turnDurationMs}
                                transitionDelayMs={board.delays[digitIndex] ?? NO_DELAY}
                                faceRoleDescription=""
                                computeFaceDefs={() => ({ ariaLabel: "", isHidden: true })}
                                renderFace={(face) => (
                                    <div className={OdometerStyles.odometerDigitFace}>
                                        {props.renderDigit?.(face, flags) ?? face}
                                    </div>
                                )}
                            />
                        </div>
                    </OdometerSlot>
                );
            })}
        </div>
    );
};
