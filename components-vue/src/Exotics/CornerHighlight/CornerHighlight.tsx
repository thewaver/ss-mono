import { type SlotsType, defineComponent } from "vue";

import { CORNER_HIGHLIGHT_DEFAULTS, CornerHighlightStyles, CornerUtils } from "@thewaver/ss-components";
import { CornerHighlightConst } from "@thewaver/ss-components/internal";

import { declareProps } from "../../Utils/propUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import type { CornerHighlightProps, CornerHighlightSlots } from "./CornerHighlight.types";

export const CornerHighlight = defineComponent(
    (props: CornerHighlightProps, { slots }: SlotsContext<CornerHighlightSlots>) =>
        () => {
            const color = props.color ?? CornerHighlightConst.DEFAULT_COLOR;
            const transitionDurationMs = props.transitionDurationMs ?? CORNER_HIGHLIGHT_DEFAULTS.transitionDurationMs;
            const cornerLength = props.cornerLength ?? CORNER_HIGHLIGHT_DEFAULTS.cornerLength;
            const strokeThickness = props.strokeThickness ?? CORNER_HIGHLIGHT_DEFAULTS.strokeThickness;
            const visibleCorners = [...(props.visibleCorners ?? CORNER_HIGHLIGHT_DEFAULTS.visibleCorners)];
            const armPoints = CornerUtils.computeArmPoints(cornerLength, strokeThickness);

            return (
                <div class={CornerHighlightStyles.cornerHighlightRoot}>
                    <div
                        class={CornerHighlightStyles.cornerHighlightGlow}
                        style={CornerUtils.computeGlowStyle(color, transitionDurationMs)}
                        aria-hidden="true"
                    >
                        {visibleCorners.map((cornerKey) => (
                            <svg
                                key={cornerKey}
                                class={[
                                    CornerHighlightStyles.cornerSVG,
                                    CornerHighlightStyles.cornerVariant[cornerKey],
                                ]}
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
        name: "CornerHighlight",
        slots: Object as SlotsType<CornerHighlightSlots>,
        props: declareProps<CornerHighlightProps>({
            color: null,
            cornerLength: null,
            strokeThickness: null,
            transitionDurationMs: null,
            visibleCorners: null,
        }),
    },
);
