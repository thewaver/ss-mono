import { type SlotsType, computed, defineComponent } from "vue";

import {
    FLIP_CARD_DEFAULTS,
    type FlipCardFace,
    type FlipCardState,
    FlipCardStyles,
    FlipCardUtils,
} from "@thewaver/ss-components";

import { Barrel } from "../../Primitives/Barrel/Barrel";
import type { BarrelSlots } from "../../Primitives/Barrel/Barrel.types";
import { callSlot, declareProps, useTwoWay } from "../../Utils/propUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import type { FlipCardProps, FlipCardSlots } from "./FlipCard.types";

export const FlipCard = defineComponent(
    (props: FlipCardProps, { slots }: SlotsContext<FlipCardSlots>) => {
        const flipped = useTwoWay(props, "flipped");

        const rest = computed<{ angle: number; isFlipped: boolean }>((previous) => {
            const isFlipped = flipped.value;

            if (previous && previous.isFlipped === isFlipped) return previous;

            return {
                angle: FlipCardUtils.computeRestingAngle(previous?.angle, isFlipped, props.turnDirection),
                isFlipped,
            };
        });

        return () => {
            const isFlipped = flipped.value;
            const shownFace = FlipCardUtils.getShownFace(isFlipped);
            const peekRatio = FlipCardUtils.getPeekRatio(props.peekRatio ?? FLIP_CARD_DEFAULTS.peekRatio);
            const angle = FlipCardUtils.computeAngle(rest.value.angle, isFlipped, peekRatio, props.turnDirection);
            const transitionDurationMs = FlipCardUtils.getTransitionDurationMs(
                peekRatio,
                props.transitionDurationMs ?? FLIP_CARD_DEFAULTS.transitionDurationMs,
            );

            const getState = (face: FlipCardFace): FlipCardState => ({ face, isShowing: face === shownFace });

            return (
                <div
                    class={FlipCardStyles.flipCardRoot}
                    role="group"
                    aria-roledescription={props.roleDescription ?? FLIP_CARD_DEFAULTS.roleDescription}
                    aria-label={props.ariaLabel}
                >
                    <Barrel
                        faces={[...FlipCardUtils.FACES]}
                        axis={props.axis ?? FLIP_CARD_DEFAULTS.axis}
                        faceSize={props.size}
                        angle={angle}
                        transitionDurationMs={transitionDurationMs}
                        faceRoleDescription={props.faceRoleDescription ?? FLIP_CARD_DEFAULTS.faceRoleDescription}
                        computeFaceDefs={(index) => ({
                            ariaLabel: props.computeFaceLabel(FlipCardUtils.FACES[index]!),
                            isHidden: FlipCardUtils.FACES[index] !== shownFace,
                        })}
                    >
                        {
                            {
                                renderFace: ({ item }) =>
                                    item === "back"
                                        ? callSlot(slots.renderBack, getState("back"))
                                        : callSlot(slots.renderFront, getState("front")),
                            } satisfies BarrelSlots<FlipCardFace>
                        }
                    </Barrel>
                </div>
            );
        };
    },
    {
        name: "FlipCard",
        slots: Object as SlotsType<FlipCardSlots>,
        props: declareProps<FlipCardProps>({
            "axis": null,
            "size": null,
            "transitionDurationMs": null,
            "peekRatio": null,
            "ariaLabel": null,
            "computeFaceLabel": null,
            "roleDescription": null,
            "faceRoleDescription": null,
            "flipped": Boolean,
            "onUpdate:flipped": null,
            "turnDirection": null,
        }),
    },
);
