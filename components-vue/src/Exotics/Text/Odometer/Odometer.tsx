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
    ODOMETER_DEFAULTS,
    type OdometerDigitSlot,
    type OdometerFixedSlot,
    type OdometerFlapLeaf,
    type OdometerSlotFlags,
    type OdometerSlotPhase,
    OdometerStyles,
    OdometerUtils,
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
import type { OdometerProps, OdometerSlots } from "./Odometer.types";

const RESTING_ANGLE = 0;
const NO_DELAY = 0;
const FIRST = 0;
const HIDDEN_FACE = { ariaLabel: "", isHidden: true };

type SlotProps = {
    phase: OdometerSlotPhase;
    widthPx: number;
    durationMs: number;
    isHidden?: boolean;
    onGrown: () => void;
    onShrunk: () => void;
};

const OdometerSlot = defineComponent(
    (props: SlotProps, { slots }) => {
        const ref = shallowRef<HTMLDivElement>();

        let animation: Animation | undefined;

        watchAfterRender([() => props.phase], ([phase]) => {
            const element = ref.value;

            if (!element) return;

            animation = OdometerUtils.animateSlotWidth(
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
        name: "OdometerSlot",
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
    digitSize: Size2d;
    renderCharacter: (character: string) => VNodeChild;
};

const OdometerFlapColumn = defineComponent(
    (props: FlapColumnProps) => {
        const flapper = OdometerUtils.createFlapper(props.target);

        onScopeDispose(flapper.stop);

        watch(
            () => props.target,
            (target) => flapper.flapTo(target, props.delayMs, props.durationMs),
        );

        const position = useStore(flapper);

        return () => {
            const flapWindow = OdometerUtils.getFlapWindow(OdometerUtils.getDrawnFlapPosition(position.value));

            return (
                <Spine
                    faces={flapWindow.leaves}
                    position={flapWindow.position}
                    axis="column"
                    hasBacks={true}
                    faceSize={props.digitSize}
                    faceRoleDescription=""
                    computeFaceAngle={SpineUtils.leaves}
                    computeFaceDefs={() => HIDDEN_FACE}
                >
                    {
                        {
                            renderFace: ({ item, side }) => (
                                <div
                                    class={[
                                        OdometerStyles.odometerDigitFace,
                                        side === "front"
                                            ? OdometerStyles.odometerFlapTop
                                            : OdometerStyles.odometerFlapBottom,
                                    ]}
                                >
                                    {props.renderCharacter(side === "front" ? item.front : item.back)}
                                </div>
                            ),
                        } satisfies SpineSlots<OdometerFlapLeaf>
                    }
                </Spine>
            );
        };
    },
    {
        name: "OdometerFlapColumn",
        props: declareProps<FlapColumnProps>({
            target: null,
            delayMs: null,
            durationMs: null,
            digitSize: null,
            renderCharacter: null,
        }),
    },
);

export const Odometer = defineComponent(
    (props: OdometerProps, { slots }: SlotsContext<OdometerSlots>) => {
        const textSlots = computed(() => OdometerUtils.getSlots(props.text));
        const digits = computed(() => OdometerUtils.getDigits(textSlots.value));
        const prefersReducedMotion = MediaQueryMonitorVueUtils.useReducedMotion();

        const board = shallowRef({
            shownDigits: digits.value,
            columnDigits: digits.value,
            angles: digits.value.map(OdometerUtils.getRestingAngle),
            delays: [] as number[],
            durations: [] as (number | undefined)[],
            fixed: OdometerUtils.computeShownSlots<OdometerFixedSlot>(
                [],
                OdometerUtils.getFixedSlots(textSlots.value),
                true,
            ),
            digitSlots: OdometerUtils.computeShownSlots<OdometerDigitSlot>(
                [],
                OdometerUtils.getDigitSlots(textSlots.value),
                true,
            ),
        });

        watch(textSlots, (next) => {
            const current = board.value;
            const nextDigits = digits.value;
            const computeReel = props.computeReel;
            const turn = OdometerUtils.computeTurn({
                shownDigits: current.shownDigits,
                columnDigits: current.columnDigits,
                angles: current.angles,
                digits: nextDigits,
                isInstant: prefersReducedMotion.value,
                reels: computeReel && nextDigits.map((_digit, index) => computeReel(index, nextDigits.length)),
                cascadeDelayMs: props.cascadeDelayMs ?? ODOMETER_DEFAULTS.cascadeDelayMs,
            });

            board.value = {
                shownDigits: nextDigits,
                columnDigits: turn.columnDigits,
                angles: turn.angles,
                delays: turn.delays,
                durations: turn.durations,
                fixed: OdometerUtils.computeShownSlots(
                    current.fixed,
                    OdometerUtils.getFixedSlots(next),
                    prefersReducedMotion.value,
                ),
                digitSlots: OdometerUtils.computeShownSlots(
                    current.digitSlots,
                    OdometerUtils.getDigitSlots(next),
                    prefersReducedMotion.value,
                ),
            };
        });

        const settleFixed = (index: number) => {
            board.value = { ...board.value, fixed: OdometerUtils.settleShownSlot(board.value.fixed, index) };
        };

        const dropFixed = (index: number) => {
            board.value = { ...board.value, fixed: OdometerUtils.dropShownSlot(board.value.fixed, index) };
        };

        const settleDigit = (index: number) => {
            board.value = {
                ...board.value,
                digitSlots: OdometerUtils.settleShownSlot(board.value.digitSlots, index),
            };
        };

        const dropDigitColumn = (index: number) => {
            const current = board.value;
            const digitSlots = OdometerUtils.dropShownSlot(current.digitSlots, index);

            if (index < current.shownDigits.length) {
                board.value = { ...current, digitSlots };

                return;
            }

            board.value = {
                ...current,
                digitSlots,
                angles: current.angles.slice(FIRST, index),
                columnDigits: current.columnDigits.slice(FIRST, index),
            };
        };

        return () => {
            const digitSize = props.digitSize;
            const turnDurationMs = props.turnDurationMs ?? ODOMETER_DEFAULTS.turnDurationMs;
            const mechanism = props.mechanism ?? ODOMETER_DEFAULTS.mechanism;
            const slotSize = { width: `${digitSize.width}px`, height: `${digitSize.height}px` };
            const { fixed, digitSlots, angles, durations, delays } = board.value;

            const renderDigitFace = (digit: string, flags: OdometerSlotFlags) =>
                callSlot(slots.renderDigit, { digit, flags }) ?? digit;

            return (
                <div class={OdometerStyles.odometerRoot} role="group" aria-label={props.ariaLabel}>
                    <span class={OdometerStyles.odometerValue}>{props.text}</span>

                    {fixed.map((shown, index) => {
                        const flags = OdometerUtils.getSlotFlags(shown.phase);

                        return (
                            <OdometerSlot
                                key={index}
                                phase={shown.phase}
                                widthPx={digitSize.width}
                                durationMs={turnDurationMs}
                                class={[
                                    OdometerStyles.odometerFixed,
                                    shown.phase !== "shown" && OdometerStyles.odometerFixedClipped,
                                ]}
                                style={{ order: shown.slot.order, ...slotSize }}
                                isHidden={true}
                                onGrown={() => settleFixed(index)}
                                onShrunk={() => dropFixed(index)}
                            >
                                {callSlot(slots.renderFixed, { character: shown.slot.character, flags }) ??
                                    shown.slot.character}
                            </OdometerSlot>
                        );
                    })}

                    {digitSlots.map((shown, index) => {
                        const flags = OdometerUtils.getSlotFlags(shown.phase);
                        const digitIndex = shown.slot.digitIndex;

                        return (
                            <OdometerSlot
                                key={index}
                                phase={shown.phase}
                                widthPx={digitSize.width}
                                durationMs={turnDurationMs}
                                class={OdometerStyles.odometerWindow}
                                style={{ order: shown.slot.order, ...slotSize }}
                                onGrown={() => settleDigit(index)}
                                onShrunk={() => dropDigitColumn(index)}
                            >
                                {mechanism === "splitFlap" ? (
                                    <OdometerFlapColumn
                                        target={OdometerUtils.getFlapPosition(angles[digitIndex] ?? RESTING_ANGLE)}
                                        delayMs={delays[digitIndex] ?? NO_DELAY}
                                        durationMs={durations[digitIndex] ?? turnDurationMs}
                                        digitSize={digitSize}
                                        renderCharacter={(character: string) => renderDigitFace(character, flags)}
                                    />
                                ) : (
                                    <div class={OdometerStyles.odometerBarrel}>
                                        <Barrel
                                            faces={OdometerUtils.DIGITS}
                                            axis="column"
                                            hasBacks={false}
                                            faceSize={digitSize}
                                            angle={angles[digitIndex] ?? RESTING_ANGLE}
                                            transitionDurationMs={durations[digitIndex] ?? turnDurationMs}
                                            transitionDelayMs={delays[digitIndex] ?? NO_DELAY}
                                            faceRoleDescription=""
                                            computeFaceDefs={() => ({ ariaLabel: "", isHidden: true })}
                                        >
                                            {
                                                {
                                                    renderFace: ({ item }) => (
                                                        <div class={OdometerStyles.odometerDigitFace}>
                                                            {renderDigitFace(item, flags)}
                                                        </div>
                                                    ),
                                                } satisfies BarrelSlots<string>
                                            }
                                        </Barrel>
                                    </div>
                                )}
                            </OdometerSlot>
                        );
                    })}
                </div>
            );
        };
    },
    {
        name: "Odometer",
        slots: Object as SlotsType<OdometerSlots>,
        props: declareProps<OdometerProps>({
            text: null,
            digitSize: null,
            turnDurationMs: null,
            cascadeDelayMs: null,
            ariaLabel: null,
            computeReel: null,
            mechanism: null,
        }),
    },
);
