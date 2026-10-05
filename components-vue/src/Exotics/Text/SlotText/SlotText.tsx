import {
    type SlotsType,
    type VNodeChild,
    computed,
    defineComponent,
    onBeforeUnmount,
    onScopeDispose,
    shallowRef,
    watch,
} from "vue";

import {
    SLOT_TEXT_DEFAULTS,
    type SlotTextFixedSlot,
    type SlotTextFlapLeaf,
    type SlotTextSlotFlags,
    type SlotTextSlotPhase,
    SlotTextStyles,
    type SlotTextTurningSlot,
    SlotTextUtils,
    SpineUtils,
} from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";

import { MediaQueryMonitorVueUtils } from "../../../Abstracts/MediaQueryMonitor/MediaQueryMonitorVue.utils";
import { Barrel } from "../../../Primitives/Barrel/Barrel";
import type { BarrelSlots } from "../../../Primitives/Barrel/Barrel.types";
import { Spine } from "../../../Primitives/Spine/Spine";
import type { SpineSlots } from "../../../Primitives/Spine/Spine.types";
import { watchAfterRender } from "../../../Utils/effectUtils";
import { callSlot, declareProps } from "../../../Utils/propUtils";
import { useStore } from "../../../Utils/storeUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import type { SlotTextProps, SlotTextSlots } from "./SlotText.types";

const RESTING_ANGLE = 0;
const NO_DELAY = 0;
const FIRST = 0;
const HIDDEN_FACE = { ariaLabel: "", isHidden: true };

type SlotProps = {
    phase: SlotTextSlotPhase;
    widthPx: number;
    durationMs: number;
    isHidden?: boolean;
    onGrown: () => void;
    onShrunk: () => void;
};

const SlotTextSlot = defineComponent(
    (props: SlotProps, { slots }) => {
        const ref = shallowRef<HTMLDivElement>();

        let animation: Animation | undefined;

        watchAfterRender([() => props.phase], ([phase]) => {
            const element = ref.value;

            if (!element) return;

            animation = SlotTextUtils.animateSlotWidth(
                element,
                phase,
                animation,
                props.widthPx,
                props.durationMs,
                () => {
                    animation = undefined;

                    if (phase === "entering") props.onGrown();
                    else props.onShrunk();
                },
            );
        });

        onBeforeUnmount(() => {
            animation?.cancel();
            animation = undefined;
        });

        return () => (
            <div ref={ref} aria-hidden={props.isHidden ? "true" : undefined}>
                {slots.default?.()}
            </div>
        );
    },
    {
        name: "SlotTextSlot",
        props: declareProps<SlotProps>({
            phase: null,
            widthPx: null,
            durationMs: null,
            isHidden: Boolean,
            onGrown: null,
            onShrunk: null,
        }),
    },
);

type FlapColumnProps = {
    target: number;
    delayMs: number;
    durationMs: number;
    faces: string[];
    characterSize: Size2d;
    renderCharacter: (character: string) => VNodeChild;
};

const SlotTextFlapColumn = defineComponent(
    (props: FlapColumnProps) => {
        const flapper = SlotTextUtils.createFlapper(props.target);

        onScopeDispose(flapper.stop);

        watch(
            () => props.target,
            (target) => flapper.flapTo(target, props.delayMs, props.durationMs),
        );

        const position = useStore(flapper);

        return () => {
            const flapWindow = SlotTextUtils.getFlapWindow(
                SlotTextUtils.getDrawnFlapPosition(position.value),
                props.faces,
            );

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
                >
                    {
                        {
                            renderFace: ({ item, side }) => (
                                <div
                                    class={[
                                        SlotTextStyles.slotTextFace,
                                        side === "front"
                                            ? SlotTextStyles.slotTextFlapTop
                                            : SlotTextStyles.slotTextFlapBottom,
                                    ]}
                                >
                                    {props.renderCharacter(side === "front" ? item.front : item.back)}
                                </div>
                            ),
                        } satisfies SpineSlots<SlotTextFlapLeaf>
                    }
                </Spine>
            );
        };
    },
    {
        name: "SlotTextFlapColumn",
        props: declareProps<FlapColumnProps>({
            target: null,
            delayMs: null,
            durationMs: null,
            faces: null,
            characterSize: null,
            renderCharacter: null,
        }),
    },
);

export const SlotText = defineComponent(
    (props: SlotTextProps, { slots }: SlotsContext<SlotTextSlots>) => {
        const letters = computed(() => props.letters ?? SLOT_TEXT_DEFAULTS.letters);
        const textSlots = computed(() => SlotTextUtils.getSlots(props.text, letters.value));
        const wheels = computed(() => SlotTextUtils.getWheels(textSlots.value, letters.value));
        const prefersReducedMotion = MediaQueryMonitorVueUtils.useReducedMotion();

        const board = shallowRef({
            shownWheels: wheels.value,
            columnWheels: wheels.value,
            angles: wheels.value.map((wheel) => SlotTextUtils.getRestingAngle(wheel.face, wheel.faces.length)),
            delays: [] as number[],
            durations: [] as (number | undefined)[],
            fixed: SlotTextUtils.computeShownSlots<SlotTextFixedSlot>(
                [],
                SlotTextUtils.getFixedSlots(textSlots.value),
                true,
            ),
            turningSlots: SlotTextUtils.computeShownSlots<SlotTextTurningSlot>(
                [],
                SlotTextUtils.getTurningSlots(textSlots.value),
                true,
            ),
        });

        watch(textSlots, (next) => {
            const current = board.value;
            const nextWheels = wheels.value;
            const computeReel = props.computeReel;
            const turn = SlotTextUtils.computeTurn({
                shownWheels: current.shownWheels,
                columnWheels: current.columnWheels,
                angles: current.angles,
                wheels: nextWheels,
                isInstant: prefersReducedMotion.value,
                reels: computeReel && nextWheels.map((_wheel, index) => computeReel(index, nextWheels.length)),
                turnDelayMs: props.turnDelayMs ?? SLOT_TEXT_DEFAULTS.turnDelayMs,
                letterRoute: props.letterRoute ?? SLOT_TEXT_DEFAULTS.letterRoute,
            });

            board.value = {
                shownWheels: nextWheels,
                columnWheels: turn.columnWheels,
                angles: turn.angles,
                delays: turn.delays,
                durations: turn.durations,
                fixed: SlotTextUtils.computeShownSlots(
                    current.fixed,
                    SlotTextUtils.getFixedSlots(next),
                    prefersReducedMotion.value,
                ),
                turningSlots: SlotTextUtils.computeShownSlots(
                    current.turningSlots,
                    SlotTextUtils.getTurningSlots(next),
                    prefersReducedMotion.value,
                ),
            };
        });

        const settleFixed = (index: number) => {
            board.value = { ...board.value, fixed: SlotTextUtils.settleShownSlot(board.value.fixed, index) };
        };

        const dropFixed = (index: number) => {
            board.value = { ...board.value, fixed: SlotTextUtils.dropShownSlot(board.value.fixed, index) };
        };

        const settleTurning = (index: number) => {
            board.value = {
                ...board.value,
                turningSlots: SlotTextUtils.settleShownSlot(board.value.turningSlots, index),
            };
        };

        const dropTurningColumn = (index: number) => {
            const current = board.value;
            const turningSlots = SlotTextUtils.dropShownSlot(current.turningSlots, index);

            if (index < current.shownWheels.length) {
                board.value = { ...current, turningSlots };

                return;
            }

            board.value = {
                ...current,
                turningSlots,
                angles: current.angles.slice(FIRST, index),
                columnWheels: current.columnWheels.slice(FIRST, index),
            };
        };

        return () => {
            const characterSize = props.characterSize;
            const turnDurationMs = props.turnDurationMs ?? SLOT_TEXT_DEFAULTS.turnDurationMs;
            const mechanism = props.mechanism ?? SLOT_TEXT_DEFAULTS.mechanism;
            const slotSize = { width: `${characterSize.width}px`, height: `${characterSize.height}px` };
            const { fixed, turningSlots, angles, durations, delays, columnWheels } = board.value;

            const renderTurningFace = (character: string, flags: SlotTextSlotFlags) =>
                callSlot(slots.renderTurning, { character, flags }) ?? character;

            return (
                <div class={SlotTextStyles.slotTextRoot} role="group" aria-label={props.ariaLabel}>
                    <span class={SlotTextStyles.slotTextValue}>{props.text}</span>

                    {fixed.map((shown, index) => {
                        const flags = SlotTextUtils.getSlotFlags(shown.phase);

                        return (
                            <SlotTextSlot
                                key={index}
                                phase={shown.phase}
                                widthPx={characterSize.width}
                                durationMs={turnDurationMs}
                                class={[
                                    SlotTextStyles.slotTextFixed,
                                    shown.phase !== "shown" && SlotTextStyles.slotTextFixedClipped,
                                ]}
                                style={{ order: shown.slot.order, ...slotSize }}
                                isHidden={true}
                                onGrown={() => settleFixed(index)}
                                onShrunk={() => dropFixed(index)}
                            >
                                {callSlot(slots.renderFixed, { character: shown.slot.character, flags }) ??
                                    shown.slot.character}
                            </SlotTextSlot>
                        );
                    })}

                    {turningSlots.map((shown, index) => {
                        const flags = SlotTextUtils.getSlotFlags(shown.phase);
                        const wheelIndex = shown.slot.wheelIndex;
                        const faces = columnWheels[wheelIndex]?.faces ?? SlotTextUtils.DIGITS;

                        return (
                            <SlotTextSlot
                                key={index}
                                phase={shown.phase}
                                widthPx={characterSize.width}
                                durationMs={turnDurationMs}
                                class={SlotTextStyles.slotTextWindow}
                                style={{ order: shown.slot.order, ...slotSize }}
                                onGrown={() => settleTurning(index)}
                                onShrunk={() => dropTurningColumn(index)}
                            >
                                {mechanism === "splitFlap" ? (
                                    <SlotTextFlapColumn
                                        target={SlotTextUtils.getFlapPosition(
                                            angles[wheelIndex] ?? RESTING_ANGLE,
                                            faces.length,
                                        )}
                                        delayMs={delays[wheelIndex] ?? NO_DELAY}
                                        durationMs={durations[wheelIndex] ?? turnDurationMs}
                                        faces={faces}
                                        characterSize={characterSize}
                                        renderCharacter={(character: string) => renderTurningFace(character, flags)}
                                    />
                                ) : (
                                    <div class={SlotTextStyles.slotTextBarrel}>
                                        <Barrel
                                            faces={faces}
                                            axis="column"
                                            hasBacks={false}
                                            faceSize={characterSize}
                                            angle={angles[wheelIndex] ?? RESTING_ANGLE}
                                            transitionDurationMs={durations[wheelIndex] ?? turnDurationMs}
                                            transitionDelayMs={delays[wheelIndex] ?? NO_DELAY}
                                            faceRoleDescription=""
                                            computeFaceDefs={() => HIDDEN_FACE}
                                        >
                                            {
                                                {
                                                    renderFace: ({ item }) => (
                                                        <div class={SlotTextStyles.slotTextFace}>
                                                            {renderTurningFace(item, flags)}
                                                        </div>
                                                    ),
                                                } satisfies BarrelSlots<string>
                                            }
                                        </Barrel>
                                    </div>
                                )}
                            </SlotTextSlot>
                        );
                    })}
                </div>
            );
        };
    },
    {
        name: "SlotText",
        slots: Object as SlotsType<SlotTextSlots>,
        props: declareProps<SlotTextProps>({
            text: null,
            characterSize: null,
            turnDurationMs: null,
            turnDelayMs: null,
            ariaLabel: null,
            computeReel: null,
            mechanism: null,
            letters: null,
            letterRoute: null,
        }),
    },
);
