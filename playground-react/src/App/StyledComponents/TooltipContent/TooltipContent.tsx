import type { PropsWithChildren } from "react";

import type { PartialGlassDefs } from "@thewaver/ss-components-react";
import { GlassSurface, Shape } from "@thewaver/ss-components-react";
import { TooltipKnobs } from "@thewaver/ss-playground/App/Knobs/Tooltips.const";
import { TOOLTIP_ARROW_TEMPLATES } from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.css";
import { BORDER_RADIUS_FULL } from "@thewaver/ss-playground/App/Theme.const";
import { themeVars } from "@thewaver/ss-playground/App/Theme.css";
import { CSSUtils, ShapeConst, ShapeUtils } from "@thewaver/ss-utils";

import { PageLayer } from "../../PageComponents/Layer/Layer";
import type { TooltipContentProps } from "./TooltipContent.types";

const TINT_GRADIENT_ANGLE = 45;

const BORDER_RADII = CSSUtils.spreadRadius(BORDER_RADIUS_FULL);

const GLASS_DEFS: PartialGlassDefs = {
    tint: {
        opacity: 1,
        gradient: {
            kind: "linear",
            angle: TINT_GRADIENT_ANGLE,
            colors: [{ value: themeVars.color.surface.dark }, { value: themeVars.color.surface.light }],
        },
    },
    sheen: { specularConstant: 0 },
};

const JOIN_RADII = [BORDER_RADIUS_FULL];

export const PageTooltipContent = (props: PropsWithChildren<TooltipContentProps>) => {
    const arrow = props.arrow ?? "none";

    const body = (
        <div className={styles.tooltipBody}>
            <PageLayer level={2}>{props.children}</PageLayer>
        </div>
    );

    return (
        <div
            className={[
                styles.tooltipVisibility,
                styles.tooltipRevealVariants[props.reveal ?? "fade"],
                props.visibilityTarget === 1 && styles.isVisible,
                arrow !== "none" && styles.tooltipArrowed,
            ]
                .filter(Boolean)
                .join(" ")}
            style={{ transitionDuration: `${props.transitionDurationMs}ms` }}
        >
            {arrow === "none" ? (
                <GlassSurface borderRadii={BORDER_RADII} glassDefs={GLASS_DEFS}>
                    {body}
                </GlassSurface>
            ) : (
                <div className={styles.tooltipArrowShadow}>
                    <Shape
                        computePoints={(size) =>
                            ShapeUtils.attachArrow(
                                { points: ShapeConst.getDefaultShapePoints("square", size), joinRadii: JOIN_RADII },
                                props.arrowAim,
                                TOOLTIP_ARROW_TEMPLATES[arrow](
                                    props.arrowWidth ?? TooltipKnobs.STARTING_ARROW_WIDTH,
                                    props.arrowLength ?? TooltipKnobs.STARTING_ARROW_LENGTH,
                                ),
                            )
                        }
                        computeFillDefs={() => [{ color: themeVars.color.surface.dark }]}
                        renderChildren={() => body}
                    />
                </div>
            )}
        </div>
    );
};
