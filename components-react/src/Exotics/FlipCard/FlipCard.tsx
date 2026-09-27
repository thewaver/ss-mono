import { useState } from "react";

import {
    FLIP_CARD_DEFAULTS,
    type FlipCardFace,
    type FlipCardState,
    FlipCardStyles,
    FlipCardUtils,
} from "@thewaver/ss-components";

import { Barrel } from "../../Primitives/Barrel/Barrel";
import type { FlipCardProps } from "./FlipCard.types";

export const FlipCard = (props: FlipCardProps) => {
    const [isFlipped] = props.flippedState;

    const [rest, setRest] = useState(() => ({
        angle: FlipCardUtils.computeRestingAngle(undefined, isFlipped, props.turnDirection),
        isFlipped,
    }));

    if (rest.isFlipped !== isFlipped) {
        setRest({
            angle: FlipCardUtils.computeRestingAngle(rest.angle, isFlipped, props.turnDirection),
            isFlipped,
        });
    }

    const shownFace = FlipCardUtils.getShownFace(isFlipped);
    const peekRatio = FlipCardUtils.getPeekRatio(props.peekRatio ?? FLIP_CARD_DEFAULTS.peekRatio);
    const angle = FlipCardUtils.computeAngle(rest.angle, isFlipped, peekRatio, props.turnDirection);
    const transitionDurationMs = FlipCardUtils.getTransitionDurationMs(
        peekRatio,
        props.transitionDurationMs ?? FLIP_CARD_DEFAULTS.transitionDurationMs,
    );

    const getState = (face: FlipCardFace): FlipCardState => ({ face, isShowing: face === shownFace });

    return (
        <div
            className={FlipCardStyles.flipCardRoot}
            role="group"
            aria-roledescription={props.roleDescription ?? FLIP_CARD_DEFAULTS.roleDescription}
            aria-label={props.ariaLabel}
        >
            <Barrel<FlipCardFace>
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
                renderFace={(face) =>
                    face === "back" ? props.renderBack(getState("back")) : props.renderFront(getState("front"))
                }
            />
        </div>
    );
};
