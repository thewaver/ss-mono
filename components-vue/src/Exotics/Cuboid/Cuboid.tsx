import { type SlotsType, computed, defineComponent, onMounted, onUpdated, shallowRef, watch } from "vue";

import {
    BarrelUtils,
    CUBOID_DEFAULTS,
    CUBOID_FACES,
    CuboidStyles,
    type CuboidTurns,
    CuboidUtils,
} from "@thewaver/ss-components";
import type { Matrix3d } from "@thewaver/ss-utils";

import { InteractionTrackerVueUtils } from "../../Abstracts/InteractionTracker/InteractionTrackerVue.utils";
import { watchAfterRender } from "../../Utils/effectUtils";
import { callSlot, declareProps, useTwoWay } from "../../Utils/propUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import type { CuboidController, CuboidProps, CuboidSlots } from "./Cuboid.types";

const NO_DURATION = 0;
const DRAG_COMMIT_RATIO = 0.5;

const NO_TURNS: CuboidTurns = { yaw: 0, pitch: 0 };

type PendingSettle = { from: Matrix3d | undefined; to: Matrix3d; turns: CuboidTurns };

export const Cuboid = defineComponent(
    (props: CuboidProps, { slots }: SlotsContext<CuboidSlots>) => {
        const yaw = useTwoWay(props, "yaw");
        const pitch = useTwoWay(props, "pitch");

        const getTransitionDurationMs = () => props.transitionDurationMs ?? CUBOID_DEFAULTS.transitionDurationMs;
        const getIsUpright = () => props.isUpright ?? CUBOID_DEFAULTS.isUpright;
        const getIsDraggable = () => props.isDraggable ?? CUBOID_DEFAULTS.isDraggable;

        const perspectiveRef = shallowRef<HTMLDivElement>();
        const bodyRef = shallowRef<HTMLDivElement>();

        let pendingSettle: PendingSettle | undefined;

        const dragTurns = shallowRef(NO_TURNS);
        const orientation = shallowRef(
            CuboidUtils.standUpright(CuboidUtils.getCountedOrientation(yaw.value, pitch.value)),
        );

        watch([yaw, pitch, getIsUpright], ([nextYaw, nextPitch, isUpright], [lastYaw, lastPitch, wasUpright]) => {
            const from = CuboidUtils.readDrawnOrientation(bodyRef.value);

            if (wasUpright !== isUpright) {
                const counted = CuboidUtils.getCountedOrientation(nextYaw, nextPitch);

                orientation.value = CuboidUtils.standUpright(counted);
                pendingSettle = { from, to: isUpright ? orientation.value : counted, turns: NO_TURNS };
            } else if (isUpright) {
                const turns = { yaw: nextYaw - lastYaw, pitch: nextPitch - lastPitch };

                orientation.value = CuboidUtils.turnUpright(orientation.value, turns);
                pendingSettle = { from, to: orientation.value, turns };
            }
        });

        const facing = computed(() => CuboidUtils.getFacing(getIsUpright(), orientation.value, yaw.value, pitch.value));

        const settlePending = () => {
            const pending = pendingSettle;

            if (!pending) return;

            pendingSettle = undefined;
            CuboidUtils.settle(
                bodyRef.value,
                pending.from,
                pending.to,
                props.size,
                pending.turns,
                getTransitionDurationMs(),
            );
        };

        onMounted(settlePending);
        onUpdated(settlePending);

        const { isSwiping } = InteractionTrackerVueUtils.useFreeSwipe(perspectiveRef, () => !getIsDraggable(), {
            commitRatio: DRAG_COMMIT_RATIO,
            onSwipe: (travel) => {
                const isUpright = getIsUpright();

                if (isUpright) CuboidUtils.stopSettling(bodyRef.value);

                dragTurns.value = CuboidUtils.getDragTurns(travel, CuboidUtils.getAcrossSign(isUpright, pitch.value));
            },
            onSwipeEnd: (direction) => {
                const turns = CuboidUtils.getReleaseTurns(direction, dragTurns.value);
                const from = getIsUpright() ? CuboidUtils.readDrawnOrientation(bodyRef.value) : undefined;

                dragTurns.value = NO_TURNS;

                if (turns.yaw === 0 && turns.pitch === 0) {
                    if (from) pendingSettle = { from, to: orientation.value, turns: NO_TURNS };

                    return;
                }

                yaw.value = yaw.value + turns.yaw;
                pitch.value = pitch.value + turns.pitch;
            },
        });

        const controller: CuboidController = {
            getFacing: () => facing.value,
            turnTo: (face) => {
                const turns = CuboidUtils.findTurnsTo(
                    face,
                    getIsUpright(),
                    orientation.value,
                    yaw.value,
                    pitch.value,
                );

                if (!turns) return false;

                yaw.value = yaw.value + turns.yaw;
                pitch.value = pitch.value + turns.pitch;

                return true;
            },
        };

        watchAfterRender([], () => {
            props.onMount?.(controller);
        });

        return () => {
            const size = props.size;
            const isUpright = getIsUpright();
            const reservedSize = CuboidUtils.getReservedSize(size);
            const faceRoleDescription = props.faceRoleDescription ?? CUBOID_DEFAULTS.faceRoleDescription;

            return (
                <div
                    class={CuboidStyles.cuboidRoot}
                    style={{ width: `${reservedSize.width}px`, height: `${reservedSize.height}px` }}
                    role="group"
                    aria-roledescription={props.roleDescription ?? CUBOID_DEFAULTS.roleDescription}
                    aria-label={props.ariaLabel}
                >
                    <div
                        ref={perspectiveRef}
                        class={CuboidStyles.cuboidPerspective}
                        style={{
                            width: `${size.width}px`,
                            height: `${size.height}px`,
                            perspective: `${BarrelUtils.PERSPECTIVE_PX}px`,
                        }}
                    >
                        <div
                            ref={bodyRef}
                            class={CuboidStyles.cuboidBody}
                            style={{
                                transform: CuboidUtils.getBodyTransform(
                                    isUpright,
                                    orientation.value,
                                    yaw.value,
                                    pitch.value,
                                    dragTurns.value,
                                    size,
                                ),
                                transitionDuration: `${isUpright || isSwiping.value ? NO_DURATION : getTransitionDurationMs()}ms`,
                            }}
                        >
                            {CUBOID_FACES.map((face) => {
                                const isShowing = face === facing.value;
                                const faceBox = CuboidUtils.getFaceBox(face, size);

                                return (
                                    <div
                                        key={face}
                                        class={CuboidStyles.cuboidFace}
                                        style={{
                                            width: `${faceBox.width}px`,
                                            height: `${faceBox.height}px`,
                                            left: `${faceBox.left}px`,
                                            top: `${faceBox.top}px`,
                                            transform: CuboidUtils.getFaceTransform(face, size),
                                        }}
                                        role="group"
                                        aria-roledescription={faceRoleDescription}
                                        aria-label={props.computeFaceLabel(face)}
                                        aria-hidden={isShowing ? undefined : "true"}
                                        inert={!isShowing}
                                    >
                                        {callSlot(slots.renderFace, { face, state: { face, isShowing } })}
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
        name: "Cuboid",
        slots: Object as SlotsType<CuboidSlots>,
        props: declareProps<CuboidProps>({
            "size": null,
            "transitionDurationMs": null,
            "ariaLabel": null,
            "computeFaceLabel": null,
            "roleDescription": null,
            "faceRoleDescription": null,
            "isUpright": Boolean,
            "isDraggable": Boolean,
            "yaw": null,
            "onUpdate:yaw": null,
            "pitch": null,
            "onUpdate:pitch": null,
            "onMount": null,
        }),
    },
);
