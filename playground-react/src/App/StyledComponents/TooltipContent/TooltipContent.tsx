import type { PropsWithChildren } from "react";

import { Shape } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.css";
import { computeTooltipGeometry } from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.utils";
import { themeVars } from "@thewaver/ss-playground/App/Theme.css";

import { PageLayer } from "../../PageComponents/Layer/Layer";
import type { TooltipContentProps } from "./TooltipContent.types";

export const PageTooltipContent = (props: PropsWithChildren<TooltipContentProps>) => {
    return (
        <div
            className={[
                styles.tooltipVisibility,
                styles.tooltipRevealVariants[props.reveal ?? "fade"],
                props.visibilityTarget === 1 && styles.isVisible,
            ]
                .filter(Boolean)
                .join(" ")}
            style={{ transitionDuration: `${props.transitionDurationMs}ms` }}
        >
            <div className={styles.tooltipShadow}>
                <Shape
                    computePoints={(size) => computeTooltipGeometry(size, props)}
                    computeFillDefs={() => [{ color: themeVars.color.surface.dark }]}
                    renderChildren={() => (
                        <div
                            className={[styles.tooltipBody, props.isWide && styles.tooltipBodyWide]
                                .filter(Boolean)
                                .join(" ")}
                        >
                            <PageLayer level={2}>{props.children}</PageLayer>
                        </div>
                    )}
                />
            </div>
        </div>
    );
};
