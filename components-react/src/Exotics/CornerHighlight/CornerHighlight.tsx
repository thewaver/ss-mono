import type { PropsWithChildren } from "react";

import { CORNER_HIGHLIGHT_DEFAULTS, CornerHighlightStyles, CornerUtils } from "@thewaver/ss-components";
import { CornerHighlightConst } from "@thewaver/ss-components/internal";

import type { CornerHighlightProps } from "./CornerHighlight.types";

export const CornerHighlight = (props: PropsWithChildren<CornerHighlightProps>) => {
    const color = props.color ?? CornerHighlightConst.DEFAULT_COLOR;
    const transitionDurationMs = props.transitionDurationMs ?? CORNER_HIGHLIGHT_DEFAULTS.transitionDurationMs;
    const cornerLength = props.cornerLength ?? CORNER_HIGHLIGHT_DEFAULTS.cornerLength;
    const strokeThickness = props.strokeThickness ?? CORNER_HIGHLIGHT_DEFAULTS.strokeThickness;
    const visibleCorners = [...(props.visibleCorners ?? CORNER_HIGHLIGHT_DEFAULTS.visibleCorners)];
    const armPoints = CornerUtils.computeArmPoints(cornerLength, strokeThickness);

    return (
        <div className={CornerHighlightStyles.cornerHighlightRoot}>
            <div
                className={CornerHighlightStyles.cornerHighlightGlow}
                style={CornerUtils.computeGlowStyle(color, transitionDurationMs)}
                aria-hidden="true"
            >
                {visibleCorners.map((cornerKey) => (
                    <svg
                        key={cornerKey}
                        className={`${CornerHighlightStyles.cornerSVG} ${CornerHighlightStyles.cornerVariant[cornerKey]}`}
                        width={cornerLength.width}
                        height={cornerLength.height}
                        viewBox={`0 0 ${cornerLength.width} ${cornerLength.height}`}
                        overflow="visible"
                    >
                        <polygon fill="currentColor" points={armPoints} />
                    </svg>
                ))}
            </div>

            {props.children}
        </div>
    );
};
