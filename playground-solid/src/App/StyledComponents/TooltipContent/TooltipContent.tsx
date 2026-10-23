import type { ParentProps } from "solid-js";

import { Shape, access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.css";
import { computeTooltipGeometry } from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.utils";
import { themeVars } from "@thewaver/ss-playground/App/Theme.css";

import { PageLayer } from "../../PageComponents/Layer/Layer";
import type { TooltipContentProps } from "./TooltipContent.types";

export const PageTooltipContent = (props: ParentProps<TooltipContentProps>) => {
    return (
        <div
            class={[styles.tooltipVisibility, styles.tooltipRevealVariants[access(props.reveal) ?? "fade"]].join(" ")}
            classList={{ [styles.isVisible]: access(props.visibilityTarget) === 1 }}
            style={{ "transition-duration": `${access(props.transitionDurationMs)}ms` }}
        >
            <div class={styles.tooltipShadow}>
                <Shape
                    computePoints={(size) =>
                        computeTooltipGeometry(size, {
                            arrow: access(props.arrow),
                            arrowAim: access(props.arrowAim),
                            arrowWidth: access(props.arrowWidth),
                            arrowLength: access(props.arrowLength),
                        })
                    }
                    computeFillDefs={() => [{ color: themeVars.color.surface.dark }]}
                    renderChildren={() => (
                        <div class={styles.tooltipBody} classList={{ [styles.tooltipBodyWide]: access(props.isWide) }}>
                            <PageLayer level={2}>{props.children}</PageLayer>
                        </div>
                    )}
                />
            </div>
        </div>
    );
};
