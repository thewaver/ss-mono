import type { PropsWithChildren } from "react";

import * as styles from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.css";
import {
    computeTooltipGeometry,
    getTooltipHasArrow,
} from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.utils";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { PageLayer } from "../../PageComponents/Layer/Layer";
import type { TooltipContentProps } from "./TooltipContent.types";
import { PageTooltipSurface } from "./TooltipSurface";

export const PageTooltipContent = (props: PropsWithChildren<TooltipContentProps>) => (
    <div
        className={[
            styles.tooltipReveal,
            styles.tooltipRevealVariants[props.reveal ?? "fade"],
            props.visibilityTarget === 1 && styles.isVisible,
        ]
            .filter(Boolean)
            .join(" ")}
        style={assignInlineVars({ [styles.tooltipRevealDuration]: `${props.transitionDurationMs}ms` })}
    >
        <PageTooltipSurface
            hasArrow={getTooltipHasArrow(props.arrow)}
            computeGeometry={(size, bodyStyle) => computeTooltipGeometry(size, props, bodyStyle)}
        >
            <div className={[styles.tooltipBody, props.isWide && styles.tooltipBodyWide].filter(Boolean).join(" ")}>
                <PageLayer>{props.children}</PageLayer>
            </div>
        </PageTooltipSurface>
    </div>
);
