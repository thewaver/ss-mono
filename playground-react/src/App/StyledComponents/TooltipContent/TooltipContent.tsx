import type { PropsWithChildren } from "react";

import { GlassSurface, Shape } from "@thewaver/ss-components-react";
import { TooltipKnobs } from "@thewaver/ss-playground/App/Knobs/Tooltips.const";
import {
    BORDER_RADII,
    GLASS_DEFS,
    JOIN_RADII,
    TOOLTIP_ARROW_TEMPLATES,
} from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.css";
import { themeVars } from "@thewaver/ss-playground/App/Theme.css";
import { ShapeConst, ShapeUtils } from "@thewaver/ss-utils";

import { PageLayer } from "../../PageComponents/Layer/Layer";
import type { TooltipContentProps } from "./TooltipContent.types";

export const PageTooltipContent = (props: PropsWithChildren<TooltipContentProps>) => {
    const arrow = props.arrow ?? "none";

    const body = (
        <div className={[styles.tooltipBody, props.isWide && styles.tooltipBodyWide].filter(Boolean).join(" ")}>
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
