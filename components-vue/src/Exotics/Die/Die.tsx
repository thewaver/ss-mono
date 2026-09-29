import { type SlotsType, computed, defineComponent, onScopeDispose } from "vue";

import { BarrelUtils, DIE_DEFAULTS, DieStyles, DieUtils, LiveAnnouncerUtils } from "@thewaver/ss-components";

import { watchAfterRender } from "../../Utils/effectUtils";
import { callSlot, declareProps, useTwoWay } from "../../Utils/propUtils";
import { useStore } from "../../Utils/storeUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import type { DieController, DieProps, DieSlots } from "./Die.types";

const HALF = 0.5;
const FIRST_FACE = 0;

export const Die = defineComponent(
    (props: DieProps, { slots }: SlotsContext<DieSlots>) => {
        const face = useTwoWay(props, "face", FIRST_FACE);

        const geometry = computed(() => DieUtils.computeFaceGeometry(props.shape, props.size * HALF));
        const shownFace = computed(() => DieUtils.clampFace(face.value, geometry.value.length));

        const roller = DieUtils.createRoller({
            getGeometry: () => geometry.value,
            getShownFace: () => shownFace.value,
            getRollDurationMs: () => props.rollDurationMs ?? DIE_DEFAULTS.rollDurationMs,
            getTumbleCount: () => props.tumbleCount ?? DIE_DEFAULTS.tumbleCount,
            computeRollTarget: () => props.computeRollTarget(),
            computeFaceLabel: (index) => props.computeFaceLabel(index),
            writeFace: (index) => {
                face.value = index;
            },
            onRollEnd: (index) => props.onRollEnd?.(index),
        });

        onScopeDispose(() => roller.stop());

        const orientation = useStore(roller, (state) => state.orientation);
        const isRolling = useStore(roller, (state) => state.isRolling);
        const restingFace = useStore(roller, (state) => state.restingFace);

        let previousShownFace: number | undefined;

        watchAfterRender([shownFace], ([nextFace]) => {
            const previous = previousShownFace;

            previousShownFace = nextFace;

            if (previous === undefined) {
                roller.rest(nextFace);
            } else if (previous !== nextFace) {
                roller.turnTo(nextFace);
            }
        });

        watchAfterRender([geometry], () => {
            roller.reshape(shownFace.value);
        });

        const controller: DieController = {
            getIsRolling: () => isRolling.value,
            roll: roller.roll,
        };

        watchAfterRender([], () => {
            LiveAnnouncerUtils.reserve("polite");
            props.onMount?.(controller);
        });

        return () => {
            const size = props.size;
            const reservedSize = DieUtils.getReservedSize(size);
            const faceRoleDescription = props.faceRoleDescription ?? DIE_DEFAULTS.faceRoleDescription;

            return (
                <div
                    class={DieStyles.dieRoot}
                    style={{ width: `${reservedSize.width}px`, height: `${reservedSize.height}px` }}
                    role="group"
                    aria-roledescription={props.roleDescription ?? DIE_DEFAULTS.roleDescription}
                    aria-label={props.ariaLabel}
                    aria-busy={isRolling.value ? "true" : undefined}
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
                            style={{ transform: DieUtils.getBodyTransform(orientation.value, size) }}
                        >
                            {geometry.value.map((faceGeometry, index) => {
                                const isShowing = index === restingFace.value;
                                const faceBox = DieUtils.getFaceBox(faceGeometry, size);

                                return (
                                    <div
                                        key={index}
                                        class={DieStyles.dieFace}
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
                                        aria-hidden={isShowing ? undefined : "true"}
                                        inert={!isShowing}
                                    >
                                        {callSlot(slots.renderFace, {
                                            index,
                                            state: DieUtils.getFaceState(geometry.value, index, restingFace.value),
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
            "ariaLabel": null,
            "computeFaceLabel": null,
            "roleDescription": null,
            "faceRoleDescription": null,
            "face": null,
            "onUpdate:face": null,
            "computeRollTarget": null,
            "onRollEnd": null,
            "onMount": null,
        }),
    },
);
