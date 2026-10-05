import type { Accessor } from "solid-js";
import { Index, Show, createEffect, createMemo, createSignal, on, onCleanup, untrack } from "solid-js";

import {
    SLOT_TEXT_DEFAULTS,
    type SlotTextFixedSlot,
    type SlotTextFlapLeaf,
    type SlotTextShownSlot,
    type SlotTextSlotFlags,
    type SlotTextSlotPhase,
    type SlotTextTurningSlot,
    SlotTextUtils,
    type SpineSide,
    SpineUtils,
    SlotTextStyles as styles,
} from "@thewaver/ss-components";

import { MediaQueryMonitorSolidUtils } from "../../../Abstracts/MediaQueryMonitor/MediaQueryMonitorSolid.utils";
import { Barrel } from "../../../Primitives/Barrel/Barrel";
import { Spine } from "../../../Primitives/Spine/Spine";
import { access } from "../../../Utils/propUtils";
import { accessStore } from "../../../Utils/storeUtils";
import type { SlotTextProps } from "./SlotTextSolid.types";

const RESTING_ANGLE = 0;
const NO_DELAY = 0;
const FIRST = 0;
const HIDDEN_FACE = { ariaLabel: "", isHidden: true };

export const SlotText = (props: SlotTextProps) => {
    const getLetters = createMemo(() => access(props.letters) ?? SLOT_TEXT_DEFAULTS.letters);

    const getSlots = createMemo(() => SlotTextUtils.getSlots(access(props.text), getLetters()));

    const getWheels = createMemo(() => SlotTextUtils.getWheels(getSlots(), getLetters()));

    const getPrefersReducedMotion = MediaQueryMonitorSolidUtils.createReducedMotion();

    let shownWheels = untrack(getWheels);

    const [getColumnWheels, setColumnWheels] = createSignal(shownWheels);
    const [getAngles, setAngles] = createSignal(
        shownWheels.map((wheel) => SlotTextUtils.getRestingAngle(wheel.face, wheel.faces.length)),
    );
    const [getDelays, setDelays] = createSignal<number[]>([]);
    const [getDurations, setDurations] = createSignal<(number | undefined)[]>([]);

    const getCharacterSize = createMemo(() => access(props.characterSize));

    const getTurnDelayMs = createMemo(() => access(props.turnDelayMs) ?? SLOT_TEXT_DEFAULTS.turnDelayMs);

    const getTurnDurationMs = createMemo(() => access(props.turnDurationMs) ?? SLOT_TEXT_DEFAULTS.turnDurationMs);

    const getMechanism = createMemo(() => access(props.mechanism) ?? SLOT_TEXT_DEFAULTS.mechanism);

    const getLetterRoute = createMemo(() => access(props.letterRoute) ?? SLOT_TEXT_DEFAULTS.letterRoute);

    const getFixedSlots = createMemo(() => SlotTextUtils.getFixedSlots(getSlots()));

    const getTurningSlots = createMemo(() => SlotTextUtils.getTurningSlots(getSlots()));

    const [getShownFixed, setShownFixed] = createSignal<SlotTextShownSlot<SlotTextFixedSlot>[]>(
        SlotTextUtils.computeShownSlots([], untrack(getFixedSlots), true),
    );
    const [getShownTurning, setShownTurning] = createSignal<SlotTextShownSlot<SlotTextTurningSlot>[]>(
        SlotTextUtils.computeShownSlots([], untrack(getTurningSlots), true),
    );

    createEffect(
        on(
            getFixedSlots,
            (slots) => {
                setShownFixed((shown) => SlotTextUtils.computeShownSlots(shown, slots, getPrefersReducedMotion()));
            },
            { defer: true },
        ),
    );

    createEffect(
        on(
            getTurningSlots,
            (slots) => {
                setShownTurning((shown) => SlotTextUtils.computeShownSlots(shown, slots, getPrefersReducedMotion()));
            },
            { defer: true },
        ),
    );

    createEffect(
        on(
            getWheels,
            (wheels) => {
                const computeReel = props.computeReel;
                const turn = SlotTextUtils.computeTurn({
                    shownWheels,
                    columnWheels: getColumnWheels(),
                    angles: getAngles(),
                    wheels,
                    isInstant: getPrefersReducedMotion(),
                    reels: computeReel && wheels.map((_wheel, index) => computeReel(index, wheels.length)),
                    turnDelayMs: getTurnDelayMs(),
                    letterRoute: getLetterRoute(),
                });

                setDelays(turn.delays);
                setDurations(turn.durations);
                setAngles(turn.angles);
                setColumnWheels(turn.columnWheels);

                shownWheels = wheels;
            },
            { defer: true },
        ),
    );

    const getAngle = (wheelIndex: number) => getAngles()[wheelIndex] ?? RESTING_ANGLE;

    const getDelay = (wheelIndex: number) => getDelays()[wheelIndex] ?? NO_DELAY;

    const getDuration = (wheelIndex: number) => getDurations()[wheelIndex] ?? getTurnDurationMs();

    const getFaces = (wheelIndex: number) => getColumnWheels()[wheelIndex]?.faces ?? SlotTextUtils.DIGITS;

    const dropTurningColumn = (index: number) => {
        setShownTurning((shown) => SlotTextUtils.dropShownSlot(shown, index));

        if (index < shownWheels.length) return;

        setAngles((angles) => angles.slice(FIRST, index));
        setColumnWheels((wheels) => wheels.slice(FIRST, index));
    };

    const renderTurningFace = (getCharacter: Accessor<string>, getFlags: Accessor<SlotTextSlotFlags>) =>
        props.renderTurning?.(getCharacter, getFlags) ?? getCharacter();

    const renderFlapColumn = (getWheelIndex: Accessor<number>, getFlags: Accessor<SlotTextSlotFlags>) => {
        const getColumnFaces = createMemo(() => getFaces(getWheelIndex()));

        const getTarget = createMemo(() =>
            SlotTextUtils.getFlapPosition(getAngle(getWheelIndex()), getColumnFaces().length),
        );

        const flapper = SlotTextUtils.createFlapper(untrack(getTarget));

        onCleanup(flapper.stop);

        createEffect(
            on(
                getTarget,
                (target) => {
                    flapper.flapTo(
                        target,
                        untrack(() => getDelay(getWheelIndex())),
                        untrack(() => getDuration(getWheelIndex())),
                    );
                },
                { defer: true },
            ),
        );

        const getPosition = accessStore(flapper);

        const getWindow = createMemo(() =>
            SlotTextUtils.getFlapWindow(SlotTextUtils.getDrawnFlapPosition(getPosition()), getColumnFaces()),
        );

        const renderLeaf = (getLeaf: Accessor<SlotTextFlapLeaf>, side: SpineSide) => (
            <div
                class={styles.slotTextFace}
                classList={{ [styles.slotTextFlapTop]: side === "front", [styles.slotTextFlapBottom]: side === "back" }}
            >
                {renderTurningFace(() => (side === "front" ? getLeaf().front : getLeaf().back), getFlags)}
            </div>
        );

        return (
            <Spine
                faces={() => getWindow().leaves}
                position={() => getWindow().position}
                axis={"column"}
                hasBacks={true}
                faceSize={getCharacterSize}
                faceRoleDescription={""}
                computeFaceAngle={SpineUtils.leaves}
                computeFaceDefs={() => HIDDEN_FACE}
                renderFace={(getLeaf, _index, side) => renderLeaf(getLeaf, side)}
            />
        );
    };

    const trackSlotWidth = (
        getElement: () => HTMLElement | undefined,
        getPhase: Accessor<SlotTextSlotPhase>,
        onGrown: () => void,
        onShrunk: () => void,
    ) => {
        let animation: Animation | undefined;

        createEffect(
            on(getPhase, (phase) => {
                const element = getElement();

                if (!element) return;

                animation = SlotTextUtils.animateSlotWidth(
                    element,
                    phase,
                    animation,
                    getCharacterSize().width,
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
        <div class={styles.slotTextRoot} role="group" aria-label={access(props.ariaLabel)}>
            <span class={styles.slotTextValue}>{access(props.text)}</span>

            <Index each={getShownFixed()}>
                {(getShown, index) => {
                    let element: HTMLDivElement | undefined;

                    const getFlags = createMemo(() => SlotTextUtils.getSlotFlags(getShown().phase));

                    trackSlotWidth(
                        () => element,
                        () => getShown().phase,
                        () => setShownFixed((shown) => SlotTextUtils.settleShownSlot(shown, index)),
                        () => setShownFixed((shown) => SlotTextUtils.dropShownSlot(shown, index)),
                    );

                    return (
                        <div
                            ref={(node) => (element = node)}
                            class={styles.slotTextFixed}
                            classList={{ [styles.slotTextFixedClipped]: getShown().phase !== "shown" }}
                            style={{
                                order: getShown().slot.order,
                                width: `${getCharacterSize().width}px`,
                                height: `${getCharacterSize().height}px`,
                            }}
                            aria-hidden="true"
                        >
                            {props.renderFixed?.(() => getShown().slot.character, getFlags) ??
                                getShown().slot.character}
                        </div>
                    );
                }}
            </Index>

            <Index each={getShownTurning()}>
                {(getShown, index) => {
                    let element: HTMLDivElement | undefined;

                    const getFlags = createMemo(() => SlotTextUtils.getSlotFlags(getShown().phase));

                    const getWheelIndex = () => getShown().slot.wheelIndex;

                    trackSlotWidth(
                        () => element,
                        () => getShown().phase,
                        () => setShownTurning((shown) => SlotTextUtils.settleShownSlot(shown, index)),
                        () => dropTurningColumn(index),
                    );

                    return (
                        <div
                            ref={(node) => (element = node)}
                            class={styles.slotTextWindow}
                            style={{
                                order: getShown().slot.order,
                                width: `${getCharacterSize().width}px`,
                                height: `${getCharacterSize().height}px`,
                            }}
                        >
                            <Show
                                when={getMechanism() === "splitFlap"}
                                fallback={
                                    <div class={styles.slotTextBarrel}>
                                        <Barrel
                                            faces={() => getFaces(getWheelIndex())}
                                            axis={"column"}
                                            hasBacks={false}
                                            faceSize={getCharacterSize}
                                            angle={() => getAngle(getWheelIndex())}
                                            transitionDurationMs={() => getDuration(getWheelIndex())}
                                            transitionDelayMs={() => getDelay(getWheelIndex())}
                                            faceRoleDescription={""}
                                            computeFaceDefs={() => HIDDEN_FACE}
                                            renderFace={(getFace) => (
                                                <div class={styles.slotTextFace}>
                                                    {renderTurningFace(getFace, getFlags)}
                                                </div>
                                            )}
                                        />
                                    </div>
                                }
                            >
                                {renderFlapColumn(getWheelIndex, getFlags)}
                            </Show>
                        </div>
                    );
                }}
            </Index>
        </div>
    );
};
