import { type SlotsType, computed, defineComponent, onBeforeUnmount, shallowRef, watch } from "vue";

import {
    ODOMETER_DEFAULTS,
    type OdometerDigitSlot,
    type OdometerFixedSlot,
    type OdometerSlotPhase,
    OdometerStyles,
    OdometerUtils,
} from "@thewaver/ss-components";

import { MediaQueryMonitorVueUtils } from "../../../Abstracts/MediaQueryMonitor/MediaQueryMonitorVue.utils";
import { Barrel } from "../../../Primitives/Barrel/Barrel";
import type { BarrelSlots } from "../../../Primitives/Barrel/Barrel.types";
import { watchAfterRender } from "../../../Utils/effectUtils";
import { callSlot, declareProps } from "../../../Utils/propUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import type { OdometerProps, OdometerSlots } from "./Odometer.types";

const RESTING_ANGLE = 0;
const NO_DELAY = 0;
const FIRST = 0;

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
            const slotSize = { width: `${digitSize.width}px`, height: `${digitSize.height}px` };
            const { fixed, digitSlots, angles, durations, delays } = board.value;

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
                                                        {callSlot(slots.renderDigit, { digit: item, flags }) ?? item}
                                                    </div>
                                                ),
                                            } satisfies BarrelSlots<string>
                                        }
                                    </Barrel>
                                </div>
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
        }),
    },
);
