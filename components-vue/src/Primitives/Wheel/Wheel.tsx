import { type SlotsType, computed, defineComponent, shallowRef } from "vue";

import {
    ProximityUtils,
    WHEEL_DEFAULTS,
    type WheelFace,
    WheelStyles,
    WheelUtils,
    type WheelWedgeState,
} from "@thewaver/ss-components";

import { MediaQueryMonitorVueUtils } from "../../Abstracts/MediaQueryMonitor/MediaQueryMonitorVue.utils";
import { PointerTrackerVueUtils } from "../../Abstracts/PointerTracker/PointerTrackerVue.utils";
import { RotatorVueUtils } from "../../Abstracts/Rotator/RotatorVue.utils";
import { watchAfterRender } from "../../Utils/effectUtils";
import { callSlot, declareProps, useTwoWay } from "../../Utils/propUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import { Barrel } from "../Barrel/Barrel";
import type { BarrelSlots } from "../Barrel/Barrel.types";
import type { WheelBackSlot, WheelController, WheelProps, WheelSlots } from "./Wheel.types";

const FIRST_WEDGE = 0;

export const Wheel = defineComponent(
    <T,>(props: WheelProps<T>, { slots }: SlotsContext<WheelSlots<T> & Partial<WheelBackSlot<T>>>) => {
        const targetIndex = useTwoWay(props, "targetIndex", 0);

        const wedgeCount = computed(() => props.wedges.length);
        const getIsEffectless = () => props.computeEffect === undefined;

        const rotation = RotatorVueUtils.useRotator(() => props.isDisabled ?? false, {
            stepCount: wedgeCount,
            targetIndex,
            isAutoSpinEnabled: () => props.autoSpin,
            spinDurationMs: () => props.spinDurationMs,
            settleDurationMs: () => props.settleDurationMs,
            restDurationMs: () => props.restDurationMs,
            idleDelayMs: () => props.idleDelayMs,
            computeSpinTarget: () => props.computeSpinTarget(),
            getComputeSpinDefs: () => props.computeSpinDefs,
            computeStepLabel: (index, count) => props.computeWedgeLabel(index, count),
            onStepChange: (index) => props.onSelectedWedgeChange?.(index),
            onSpinEnd: (index) => props.onSpinEnd?.(index),
        });

        const getWedgeLabel = (index: number) => props.computeWedgeLabel(index, wedgeCount.value);

        const selectedIndex = computed(() =>
            WheelUtils.getSelectedIndex(rotation.phase.value, rotation.currentIndex.value),
        );

        const layout = computed(() => WheelUtils.computeLayout(props.computeLayout, wedgeCount.value));

        const markerCorrection = computed(() =>
            WheelUtils.getMarkerCorrection(layout.value, props.markerDegrees ?? WHEEL_DEFAULTS.markerDegrees),
        );

        const getWedgeAngle = (index: number) =>
            WheelUtils.getWedgeAngle(markerCorrection.value, index, rotation.stepAngle.value, rotation.angle.value);

        const wheelRef = shallowRef<HTMLDivElement>();

        const pointer = PointerTrackerVueUtils.usePointerReading(wheelRef, getIsEffectless);

        const prefersReducedMotion = MediaQueryMonitorVueUtils.useReducedMotion(getIsEffectless);

        const arrangement = computed(() =>
            getIsEffectless() || !layout.value ? undefined : ProximityUtils.toArrangement(layout.value),
        );

        const pointerPoint = computed(() =>
            getIsEffectless()
                ? undefined
                : WheelUtils.getPointerPoint(
                      layout.value,
                      pointer.reading.value.boxRatio,
                      pointer.isPointerPresent.value,
                  ),
        );

        const overreach = computed(() => WheelUtils.getOverreach(layout.value, pointerPoint.value));

        const getWedgeEffect = (index: number) =>
            WheelUtils.computeWedgeEffect({
                computeEffect: props.computeEffect,
                layout: layout.value,
                arrangement: arrangement.value,
                angle: getWedgeAngle(index),
                point: pointerPoint.value,
                overreach: overreach.value,
                prefersReducedMotion: prefersReducedMotion.value,
            });

        const getWedgeState = (index: number, face: WheelFace): WheelWedgeState => ({
            index,
            wedgeCount: wedgeCount.value,
            face,
            isSelected: index === selectedIndex.value,
            angle: getWedgeAngle(index),
            placement: layout.value?.placements[FIRST_WEDGE],
        });

        const controller: WheelController = {
            getCurrentIndex: () => rotation.currentIndex.value,
            getPhase: () => rotation.phase.value,
            getIsSpinnable: () => rotation.isSpinnable.value,
            getIsAutoSpinning: () => rotation.phase.value === "idling",
            getIsUserSpinning: () =>
                WheelUtils.getIsUserSpinning(rotation.isAwaitingTarget.value, rotation.phase.value),
            spin: rotation.spin,
        };

        watchAfterRender([], () => {
            props.onMount?.(controller);
        });

        const renderWedge = (wedge: T, index: number, face: WheelFace) =>
            face === "back"
                ? callSlot(slots.renderWedgeBack, { wedge, state: getWedgeState(index, face) })
                : callSlot(slots.renderWedge, { wedge, state: getWedgeState(index, face) });

        return () => {
            const roleDescription = props.roleDescription ?? WHEEL_DEFAULTS.roleDescription;
            const wedgeRoleDescription = props.wedgeRoleDescription ?? WHEEL_DEFAULTS.wedgeRoleDescription;

            if (props.variant !== "overhead") {
                return (
                    <div
                        class={WheelStyles.drumWheelRoot}
                        role="group"
                        aria-roledescription={roleDescription}
                        aria-label={props.ariaLabel}
                    >
                        <Barrel
                            faces={props.wedges}
                            axis={props.axis ?? WHEEL_DEFAULTS.axis}
                            faceSize={props.wedgeSize ?? WHEEL_DEFAULTS.wedgeSize}
                            angle={rotation.angle.value}
                            faceRoleDescription={wedgeRoleDescription}
                            computeFaceDefs={(index, face) => ({
                                ariaLabel: getWedgeLabel(index),
                                isHidden: face === "back" || index !== rotation.targetIndex.value,
                            })}
                        >
                            {
                                {
                                    renderFace: ({ item, index, face }) => renderWedge(item, index, face),
                                } satisfies BarrelSlots<T>
                            }
                        </Barrel>
                    </div>
                );
            }

            return (
                <div
                    ref={wheelRef}
                    class={WheelStyles.overheadWheelRoot}
                    role="group"
                    aria-roledescription={roleDescription}
                    aria-label={props.ariaLabel}
                >
                    {props.wedges.map((wedge, index) => {
                        const effect = getWedgeEffect(index);

                        return (
                            <div
                                key={index}
                                class={WheelStyles.overheadWheelWedge}
                                style={{
                                    transform: WheelUtils.getWedgeTransform(getWedgeAngle(index), effect),
                                    filter: effect?.filter || undefined,
                                }}
                                role="group"
                                aria-roledescription={wedgeRoleDescription}
                                aria-label={getWedgeLabel(index)}
                            >
                                {renderWedge(wedge, index, "front")}
                            </div>
                        );
                    })}
                </div>
            );
        };
    },
    {
        name: "Wheel",
        slots: Object as SlotsType<WheelSlots<any> & Partial<WheelBackSlot<any>>>,
        props: declareProps<WheelProps<unknown>>({
            "ariaLabel": null,
            "isDisabled": Boolean,
            "spinDurationMs": null,
            "settleDurationMs": null,
            "restDurationMs": null,
            "computeWedgeLabel": null,
            "roleDescription": null,
            "wedgeRoleDescription": null,
            "wedges": null,
            "idleDelayMs": null,
            "targetIndex": null,
            "onUpdate:targetIndex": null,
            "autoSpin": Boolean,
            "onUpdate:autoSpin": null,
            "computeSpinTarget": null,
            "computeSpinDefs": null,
            "onSelectedWedgeChange": null,
            "onSpinEnd": null,
            "onMount": null,
            "variant": null,
            "axis": null,
            "wedgeSize": null,
            "markerDegrees": null,
            "computeLayout": null,
            "computeEffect": null,
        }),
    },
);
