import { createMemo } from "solid-js";

import { Barrel } from "../../Primitives/Barrel/Barrel";
import { access, accessSignal } from "../../Utils/propUtils";
import { FLIP_CARD_DEFAULTS } from "./FlipCard.const";
import type { FlipCardFace, FlipCardProps, FlipCardState } from "./FlipCard.types";

import * as styles from "./FlipCard.css";

const FACES: FlipCardFace[] = ["front", "back"];

const FLIP_ANGLE_DEG = 180;

export const FlipCard = (props: FlipCardProps) => {
    const [getIsFlipped] = accessSignal(() => props.flippedSignal);

    const getShownFace = createMemo((): FlipCardFace => (getIsFlipped() ? "back" : "front"));

    const getFaceLabel = (face: FlipCardFace) => props.computeFaceLabel(face);

    const getState = (face: FlipCardFace): FlipCardState => ({
        face,
        isShowing: face === getShownFace(),
    });

    return (
        <div
            class={styles.flipCardRoot}
            role="group"
            aria-roledescription={access(props.roleDescription) ?? FLIP_CARD_DEFAULTS.roleDescription}
            aria-label={access(props.ariaLabel)}
        >
            <Barrel<FlipCardFace>
                faces={FACES}
                axis={() => access(props.axis) ?? FLIP_CARD_DEFAULTS.axis}
                faceSize={() => access(props.size)}
                angle={() => (getIsFlipped() ? -FLIP_ANGLE_DEG : 0)}
                transitionDurationMs={() =>
                    access(props.transitionDurationMs) ?? FLIP_CARD_DEFAULTS.transitionDurationMs
                }
                faceRoleDescription={() => access(props.faceRoleDescription) ?? FLIP_CARD_DEFAULTS.faceRoleDescription}
                computeFaceDefs={(index) => ({
                    ariaLabel: getFaceLabel(FACES[index]!),
                    isHidden: FACES[index] !== getShownFace(),
                })}
                renderFace={(getFace) =>
                    getFace() === "back"
                        ? props.renderBack(() => getState("back"))
                        : props.renderFront(() => getState("front"))
                }
            />
        </div>
    );
};
