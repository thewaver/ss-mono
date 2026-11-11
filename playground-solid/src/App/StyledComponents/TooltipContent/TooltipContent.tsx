import type { ParentProps } from "solid-js";

import { access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.css";
import {
    computeTooltipGeometry,
    getTooltipHasArrow,
} from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.utils";

import { PageLayer } from "../../PageComponents/Layer/Layer";
import type { TooltipContentProps } from "./TooltipContent.types";
import { PageTooltipSurface } from "./TooltipSurface";

export const PageTooltipContent = (props: ParentProps<TooltipContentProps>) => (
    <div
        class={[styles.tooltipVisibility, styles.tooltipRevealVariants[access(props.reveal) ?? "fade"]].join(" ")}
        classList={{ [styles.isVisible]: access(props.visibilityTarget) === 1 }}
        style={{ "transition-duration": `${access(props.transitionDurationMs)}ms` }}
    >
        <PageTooltipSurface
            hasArrow={() => getTooltipHasArrow(access(props.arrow))}
            computeGeometry={(size, bodyStyle) =>
                computeTooltipGeometry(
                    size,
                    {
                        arrow: access(props.arrow),
                        arrowAim: access(props.arrowAim),
                        arrowWidth: access(props.arrowWidth),
                        arrowLength: access(props.arrowLength),
                    },
                    bodyStyle,
                )
            }
        >
            <div class={styles.tooltipBody} classList={{ [styles.tooltipBodyWide]: access(props.isWide) }}>
                <PageLayer>{props.children}</PageLayer>
            </div>
        </PageTooltipSurface>
    </div>
);
