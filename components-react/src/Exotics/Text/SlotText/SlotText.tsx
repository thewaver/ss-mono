import { type CSSProperties, type ReactNode, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import {
    SLOT_TEXT_DEFAULTS,
    type SlotTextFixedSlot,
    type SlotTextSlotFlags,
    type SlotTextSlotPhase,
    SlotTextStyles,
    type SlotTextTurningSlot,
    SlotTextUtils,
    SpineUtils,
} from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";

import { MediaQueryMonitorReactUtils } from "../../../Abstracts/MediaQueryMonitor/MediaQueryMonitorReact.utils";
import { Barrel } from "../../../Primitives/Barrel/Barrel";
import { Spine } from "../../../Primitives/Spine/Spine";
import { useLatest } from "../../../Utils/refUtils";
import { useStore } from "../../../Utils/storeUtils";
import type { SlotTextProps } from "./SlotText.types";

const RESTING_ANGLE = 0;
const NO_DELAY = 0;
const FIRST = 0;
const HIDDEN_FACE = { ariaLabel: "", isHidden: true };

type SlotProps = {
    phase: SlotTextSlotPhase;
    widthPx: number;
    durationMs: number;
    className: string;
    style: CSSProperties;
    isHidden?: boolean;
    onGrown: () => void;
    onShrunk: () => void;
    children: ReactNode;
};

const SlotTextSlot = (props: SlotProps) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const animationRef = useRef<Animation>(undefined);
    const latest = useLatest(props);

    useLayoutEffect(() => {
        const element = ref.current;

        if (!element) return;

        const phase = props.phase;

        animationRef.current = SlotTextUtils.animateSlotWidth(
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

type FlapColumnProps = {
    target: number;
    delayMs: number;
    durationMs: number;
    faces: string[];
    characterSize: Size2d;
    renderCharacter: (character: string) => ReactNode;
};

const SlotTextFlapColumn = (props: FlapColumnProps) => {
    const [flapper] = useState(() => SlotTextUtils.createFlapper(props.target));
    const position = useStore(flapper);
    const latest = useLatest(props);

    useLayoutEffect(() => {
        flapper.flapTo(props.target, latest.current.delayMs, latest.current.durationMs);
    }, [flapper, props.target]);

    useEffect(() => flapper.stop, [flapper]);

    const flapWindow = SlotTextUtils.getFlapWindow(SlotTextUtils.getDrawnFlapPosition(position), props.faces);

    return (
        <Spine
            faces={flapWindow.leaves}
            position={flapWindow.position}
            axis="column"
            hasBacks={true}
            faceSize={props.characterSize}
            faceRoleDescription=""
            computeFaceAngle={SpineUtils.leaves}
            computeFaceDefs={() => HIDDEN_FACE}
            renderFace={(leaf, _index, side) => (
                <div
                    className={[
                        SlotTextStyles.slotTextFace,
                        side === "front" ? SlotTextStyles.slotTextFlapTop : SlotTextStyles.slotTextFlapBottom,
                    ].join(" ")}
                >
                    {props.renderCharacter(side === "front" ? leaf.front : leaf.back)}
                </div>
            )}
        />
    );
};

export const SlotText = (props: SlotTextProps) => {
    const letters = props.letters ?? SLOT_TEXT_DEFAULTS.letters;
    const slots = useMemo(() => SlotTextUtils.getSlots(props.text, letters), [props.text, letters]);
    const wheels = useMemo(() => SlotTextUtils.getWheels(slots, letters), [slots, letters]);
    const prefersReducedMotion = MediaQueryMonitorReactUtils.useReducedMotion();

    const characterSize = props.characterSize;
    const turnDelayMs = props.turnDelayMs ?? SLOT_TEXT_DEFAULTS.turnDelayMs;
    const turnDurationMs = props.turnDurationMs ?? SLOT_TEXT_DEFAULTS.turnDurationMs;
    const mechanism = props.mechanism ?? SLOT_TEXT_DEFAULTS.mechanism;
    const letterRoute = props.letterRoute ?? SLOT_TEXT_DEFAULTS.letterRoute;

    const [board, setBoard] = useState(() => ({
        slots,
        shownWheels: wheels,
        columnWheels: wheels,
        angles: wheels.map((wheel) => SlotTextUtils.getRestingAngle(wheel.face, wheel.faces.length)),
        delays: [] as number[],
        durations: [] as (number | undefined)[],
        fixed: SlotTextUtils.computeShownSlots<SlotTextFixedSlot>([], SlotTextUtils.getFixedSlots(slots), true),
        turningSlots: SlotTextUtils.computeShownSlots<SlotTextTurningSlot>(
            [],
            SlotTextUtils.getTurningSlots(slots),
            true,
        ),
    }));

    if (board.slots !== slots) {
        const computeReel = props.computeReel;
        const turn = SlotTextUtils.computeTurn({
            shownWheels: board.shownWheels,
            columnWheels: board.columnWheels,
            angles: board.angles,
            wheels,
            isInstant: prefersReducedMotion,
            reels: computeReel && wheels.map((_wheel, index) => computeReel(index, wheels.length)),
            turnDelayMs,
            letterRoute,
        });

        setBoard({
            slots,
            shownWheels: wheels,
            columnWheels: turn.columnWheels,
            angles: turn.angles,
            delays: turn.delays,
            durations: turn.durations,
            fixed: SlotTextUtils.computeShownSlots(
                board.fixed,
                SlotTextUtils.getFixedSlots(slots),
                prefersReducedMotion,
            ),
            turningSlots: SlotTextUtils.computeShownSlots(
                board.turningSlots,
                SlotTextUtils.getTurningSlots(slots),
                prefersReducedMotion,
            ),
        });
    }

    const settleFixed = (index: number) =>
        setBoard((current) => ({ ...current, fixed: SlotTextUtils.settleShownSlot(current.fixed, index) }));

    const dropFixed = (index: number) =>
        setBoard((current) => ({ ...current, fixed: SlotTextUtils.dropShownSlot(current.fixed, index) }));

    const settleTurning = (index: number) =>
        setBoard((current) => ({
            ...current,
            turningSlots: SlotTextUtils.settleShownSlot(current.turningSlots, index),
        }));

    const dropTurningColumn = (index: number) =>
        setBoard((current) => {
            const turningSlots = SlotTextUtils.dropShownSlot(current.turningSlots, index);

            if (index < current.shownWheels.length) return { ...current, turningSlots };

            return {
                ...current,
                turningSlots,
                angles: current.angles.slice(FIRST, index),
                columnWheels: current.columnWheels.slice(FIRST, index),
            };
        });

    const slotSize = { width: `${characterSize.width}px`, height: `${characterSize.height}px` };

    const renderTurningFace = (character: string, flags: SlotTextSlotFlags) =>
        props.renderTurning?.(character, flags) ?? character;

    return (
        <div className={SlotTextStyles.slotTextRoot} role="group" aria-label={props.ariaLabel}>
            <span className={SlotTextStyles.slotTextValue}>{props.text}</span>

            {board.fixed.map((shown, index) => {
                const flags = SlotTextUtils.getSlotFlags(shown.phase);

                return (
                    <SlotTextSlot
                        key={index}
                        phase={shown.phase}
                        widthPx={characterSize.width}
                        durationMs={turnDurationMs}
                        className={[
                            SlotTextStyles.slotTextFixed,
                            shown.phase === "shown" ? undefined : SlotTextStyles.slotTextFixedClipped,
                        ]
                            .filter(Boolean)
                            .join(" ")}
                        style={{ order: shown.slot.order, ...slotSize }}
                        isHidden={true}
                        onGrown={() => settleFixed(index)}
                        onShrunk={() => dropFixed(index)}
                    >
                        {props.renderFixed?.(shown.slot.character, flags) ?? shown.slot.character}
                    </SlotTextSlot>
                );
            })}

            {board.turningSlots.map((shown, index) => {
                const flags = SlotTextUtils.getSlotFlags(shown.phase);
                const wheelIndex = shown.slot.wheelIndex;
                const faces = board.columnWheels[wheelIndex]?.faces ?? SlotTextUtils.DIGITS;

                return (
                    <SlotTextSlot
                        key={index}
                        phase={shown.phase}
                        widthPx={characterSize.width}
                        durationMs={turnDurationMs}
                        className={SlotTextStyles.slotTextWindow}
                        style={{ order: shown.slot.order, ...slotSize }}
                        onGrown={() => settleTurning(index)}
                        onShrunk={() => dropTurningColumn(index)}
                    >
                        {mechanism === "splitFlap" ? (
                            <SlotTextFlapColumn
                                target={SlotTextUtils.getFlapPosition(
                                    board.angles[wheelIndex] ?? RESTING_ANGLE,
                                    faces.length,
                                )}
                                delayMs={board.delays[wheelIndex] ?? NO_DELAY}
                                durationMs={board.durations[wheelIndex] ?? turnDurationMs}
                                faces={faces}
                                characterSize={characterSize}
                                renderCharacter={(character) => renderTurningFace(character, flags)}
                            />
                        ) : (
                            <div className={SlotTextStyles.slotTextBarrel}>
                                <Barrel
                                    faces={faces}
                                    axis="column"
                                    hasBacks={false}
                                    faceSize={characterSize}
                                    angle={board.angles[wheelIndex] ?? RESTING_ANGLE}
                                    transitionDurationMs={board.durations[wheelIndex] ?? turnDurationMs}
                                    transitionDelayMs={board.delays[wheelIndex] ?? NO_DELAY}
                                    faceRoleDescription=""
                                    computeFaceDefs={() => HIDDEN_FACE}
                                    renderFace={(face) => (
                                        <div className={SlotTextStyles.slotTextFace}>
                                            {renderTurningFace(face, flags)}
                                        </div>
                                    )}
                                />
                            </div>
                        )}
                    </SlotTextSlot>
                );
            })}
        </div>
    );
};
