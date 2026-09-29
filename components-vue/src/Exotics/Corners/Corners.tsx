import { type SlotsType, defineComponent } from "vue";

import { CORNERS_DEFAULTS, CornerUtils, CornersStyles } from "@thewaver/ss-components";

import { declareProps } from "../../Utils/propUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import type { CornersProps, CornersSlots } from "./Corners.types";

const DEFAULT_COLOR = "currentColor";

export const Corners = defineComponent(
    (props: CornersProps, { slots }: SlotsContext<CornersSlots>) => () => {
        const color = props.color ?? DEFAULT_COLOR;
        const transitionDurationMs = props.transitionDurationMs ?? CORNERS_DEFAULTS.transitionDurationMs;
        const cornerLength = props.cornerLength ?? CORNERS_DEFAULTS.cornerLength;
        const strokeThickness = props.strokeThickness ?? CORNERS_DEFAULTS.strokeThickness;
        const visibleCorners = [...(props.visibleCorners ?? CORNERS_DEFAULTS.visibleCorners)];
        const armPoints = CornerUtils.computeArmPoints(cornerLength, strokeThickness);

        return (
            <div class={CornersStyles.cornersRoot}>
                <div
                    class={CornersStyles.cornersGlow}
                    style={CornerUtils.computeGlowStyle(color, transitionDurationMs)}
                    aria-hidden="true"
                >
                    {visibleCorners.map((cornerKey) => (
                        <svg
                            key={cornerKey}
                            class={[CornersStyles.cornerSVG, CornersStyles.cornerVariant[cornerKey]]}
                            width={cornerLength.width}
                            height={cornerLength.height}
                            viewBox={`0 0 ${cornerLength.width} ${cornerLength.height}`}
                            overflow="visible"
                        >
                            <polygon fill="currentColor" points={armPoints} />
                        </svg>
                    ))}
                </div>

                {slots.default?.()}
            </div>
        );
    },
    {
        name: "Corners",
        slots: Object as SlotsType<CornersSlots>,
        props: declareProps<CornersProps>({
            color: null,
            cornerLength: null,
            strokeThickness: null,
            transitionDurationMs: null,
            visibleCorners: null,
        }),
    },
);
