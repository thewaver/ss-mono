import { createMemo } from "solid-js";

import { Barrel } from "../../Abstracts/Barrel/Barrel";
import { access } from "../../Utils/propUtils";
import type { FlipCardAxis, FlipCardFace, FlipCardProps, FlipCardState } from "./FlipCard.types";

import * as styles from "./FlipCard.css";

const DEFAULT_FLIP_CARD_AXIS: FlipCardAxis = "row";
const DEFAULT_FLIP_CARD_TRANSITION_DURATION_MS = 400;

const FACES: FlipCardFace[] = ["front", "back"];

const FACE_LABELS: Record<FlipCardFace, string> = {
    front: "Front",
    back: "Back",
};

const FLIP_ANGLE_DEG = 180;

const FLIP_CARD_ROLE_DESCRIPTION = "flip card";
const FACE_ROLE_DESCRIPTION = "face";

export const FlipCard = (props: FlipCardProps) => {
    const [getIsFlipped] = props.flippedSignal;

    const getShownFace = createMemo((): FlipCardFace => (getIsFlipped() ? "back" : "front"));

    const getFaceLabel = (face: FlipCardFace) => props.computeFaceLabel?.(face) ?? FACE_LABELS[face];

    const getState = (face: FlipCardFace): FlipCardState => ({
        face,
        isShowing: face === getShownFace(),
    });

    return (
        <div
            class={styles.flipCardRoot}
            role="group"
            aria-roledescription={FLIP_CARD_ROLE_DESCRIPTION}
            aria-label={access(props.ariaLabel)}
        >
            <Barrel<FlipCardFace>
                faces={FACES}
                axis={() => access(props.axis) ?? DEFAULT_FLIP_CARD_AXIS}
                faceSize={() => access(props.size)}
                angle={() => (getIsFlipped() ? -FLIP_ANGLE_DEG : 0)}
                transitionDurationMs={() =>
                    access(props.transitionDurationMs) ?? DEFAULT_FLIP_CARD_TRANSITION_DURATION_MS
                }
                faceRoleDescription={FACE_ROLE_DESCRIPTION}
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
