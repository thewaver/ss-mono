import { type SlotsType, computed, defineComponent, shallowRef } from "vue";

import { BarrelUtils, DIE_DEFAULTS, DieStyles, DieUtils } from "@thewaver/ss-components";

import { RollerVueUtils } from "../../../Abstracts/Roller/RollerVue.utils";
import { watchAfterRender } from "../../../Utils/effectUtils";
import { callSlot, declareProps, useTwoWay } from "../../../Utils/propUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import type { DieController, DieProps, DieSlots } from "./Die.types";

const HALF = 0.5;
const FIRST_FACE = 0;

export const Die = defineComponent(
    (props: DieProps, { slots }: SlotsContext<DieSlots>) => {
        const face = useTwoWay(props, "face", FIRST_FACE);

        const rootRef = shallowRef<HTMLElement>();

        const geometry = computed(() => DieUtils.computeFaceGeometry(props.shape, props.size * HALF));
        const isMovable = computed(() => props.isMovable ?? DIE_DEFAULTS.isMovable);

        const roller = RollerVueUtils.useRoller(rootRef, false, {
            faces: geometry,
            radius: () => props.size * HALF,
            targetFace: face,
            isAutoSpinEnabled: () => props.autoSpin,
            rollDurationMs: () => props.rollDurationMs,
            settleDurationMs: () => props.settleDurationMs,
            restDurationMs: () => props.restDurationMs,
            tumbleCount: () => props.tumbleCount,
            momentumMs: () => props.momentumMs,
            idleDelayMs: () => props.idleDelayMs,
            driftAxis: () => props.driftAxis,
            isMovable,
            getComputeRollTarget: () => props.computeRollTarget,
            computeFaceLabel: (index) => props.computeFaceLabel(index),
            onRollEnd: (index) => props.onRollEnd?.(index),
        });

        const controller: DieController = {
            getCurrentFace: () => roller.currentFace.value,
            getPhase: () => roller.phase.value,
            getIsRollable: () => roller.isRollable.value,
            getIsRolling: () => roller.isAwaitingTarget.value || roller.phase.value === "rolling",
            getIsAutoSpinning: () => roller.phase.value === "idling",
            roll: roller.roll,
            step: roller.step,
        };

        watchAfterRender([], () => {
            props.onMount?.(controller);
        });

        return () => {
            const size = props.size;
            const reservedSize = DieUtils.getReservedSize(size);
            const faceRoleDescription = props.faceRoleDescription ?? DIE_DEFAULTS.faceRoleDescription;
            const isSeeThrough = props.isSeeThrough ?? DIE_DEFAULTS.isSeeThrough;

            return (
                <div
                    ref={rootRef}
                    class={[DieStyles.dieRoot, isMovable.value && DieStyles.dieRootMovable]}
                    style={{ width: `${reservedSize.width}px`, height: `${reservedSize.height}px` }}
                    role="group"
                    tabindex={isMovable.value ? 0 : undefined}
                    aria-roledescription={props.roleDescription ?? DIE_DEFAULTS.roleDescription}
                    aria-label={props.ariaLabel}
                    aria-busy={roller.isBusy.value ? "true" : undefined}
                >
                    <div
                        class={DieStyles.diePerspective}
                        style={{
                            width: `${size}px`,
                            height: `${size}px`,
                            perspective: `${BarrelUtils.PERSPECTIVE_PX}px`,
                        }}
                    >
                        <div
                            class={DieStyles.dieBody}
                            style={{ transform: DieUtils.getBodyTransform(roller.orientation.value, size) }}
                        >
                            {geometry.value.map((faceGeometry, index) => {
                                const isTarget = index === roller.targetFace.value;
                                const faceBox = DieUtils.getFaceBox(faceGeometry, size);

                                return (
                                    <div
                                        key={index}
                                        class={[DieStyles.dieFace, isSeeThrough && DieStyles.dieFaceSeeThrough]}
                                        style={{
                                            width: `${faceGeometry.size.width}px`,
                                            height: `${faceGeometry.size.height}px`,
                                            left: `${faceBox.left}px`,
                                            top: `${faceBox.top}px`,
                                            transform: DieUtils.computeFaceTransform(faceGeometry),
                                            clipPath: faceBox.clipPath,
                                        }}
                                        role="group"
                                        aria-roledescription={faceRoleDescription}
                                        aria-label={props.computeFaceLabel(index)}
                                        aria-hidden={isTarget ? undefined : "true"}
                                        inert={!isTarget}
                                    >
                                        {callSlot(slots.renderFace, {
                                            index,
                                            state: DieUtils.getFaceState(
                                                geometry.value,
                                                index,
                                                roller.restingFace.value,
                                            ),
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            );
        };
    },
    {
        name: "Die",
        slots: Object as SlotsType<DieSlots>,
        props: declareProps<DieProps>({
            "shape": null,
            "size": null,
            "rollDurationMs": null,
            "tumbleCount": null,
            "settleDurationMs": null,
            "restDurationMs": null,
            "momentumMs": null,
            "idleDelayMs": null,
            "driftAxis": null,
            "isMovable": Boolean,
            "isSeeThrough": Boolean,
            "ariaLabel": null,
            "computeFaceLabel": null,
            "roleDescription": null,
            "faceRoleDescription": null,
            "face": null,
            "onUpdate:face": null,
            "autoSpin": Boolean,
            "onUpdate:autoSpin": null,
            "computeRollTarget": null,
            "onRollEnd": null,
            "onMount": null,
        }),
    },
);
