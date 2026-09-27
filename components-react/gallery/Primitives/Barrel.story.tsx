import { useState } from "react";

import type { BarrelAxis } from "@thewaver/ss-components";

import { Barrel } from "../../src";

const NAMES = ["Alpha", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot"];
const FACE_SIZE = { width: 200, height: 100 };
const FULL_TURN = 360;

type DefaultProps = {
    axis?: BarrelAxis;
    faceCount?: number;
    hasBacks?: boolean;
    transitionDurationMs?: number;
    transitionDelayMs?: number;
};

export const Default = ({ axis, faceCount = 4, hasBacks, transitionDurationMs, transitionDelayMs }: DefaultProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const faces = NAMES.slice(0, faceCount);

    return (
        <>
            <div data-testid="host">
                <Barrel
                    faces={faces}
                    axis={axis}
                    faceSize={FACE_SIZE}
                    angle={(currentIndex * FULL_TURN) / faceCount}
                    hasBacks={hasBacks}
                    transitionDurationMs={transitionDurationMs}
                    transitionDelayMs={transitionDelayMs}
                    faceRoleDescription="slide"
                    computeFaceDefs={(index, face) => ({
                        ariaLabel: `${index + 1} of ${faceCount}`,
                        isHidden: face === "back" || index !== currentIndex,
                    })}
                    renderFace={(item, index, face) => (
                        <button type="button" data-face={face} data-index={index}>
                            {item}
                        </button>
                    )}
                />
            </div>
            <button
                type="button"
                data-testid="next"
                onClick={() => setCurrentIndex((index) => (index + 1) % faceCount)}
            >
                Next
            </button>
        </>
    );
};
