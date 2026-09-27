import type { PropsWithChildren } from "react";

import { CORNERS_DEFAULTS, CornerUtils, CornersStyles } from "@thewaver/ss-components";

import type { CornersProps } from "./Corners.types";

const DEFAULT_COLOR = "currentColor";

export const Corners = (props: PropsWithChildren<CornersProps>) => {
    const color = props.color ?? DEFAULT_COLOR;
    const transitionDurationMs = props.transitionDurationMs ?? CORNERS_DEFAULTS.transitionDurationMs;
    const cornerLength = props.cornerLength ?? CORNERS_DEFAULTS.cornerLength;
    const strokeThickness = props.strokeThickness ?? CORNERS_DEFAULTS.strokeThickness;
    const visibleCorners = [...(props.visibleCorners ?? CORNERS_DEFAULTS.visibleCorners)];
    const armPoints = CornerUtils.computeArmPoints(cornerLength, strokeThickness);

    return (
        <div className={CornersStyles.cornersRoot}>
            <div
                className={CornersStyles.cornersGlow}
                style={CornerUtils.computeGlowStyle(color, transitionDurationMs)}
                aria-hidden="true"
            >
                {visibleCorners.map((cornerKey) => (
                    <svg
                        key={cornerKey}
                        className={`${CornersStyles.cornerSVG} ${CornersStyles.cornerVariant[cornerKey]}`}
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
