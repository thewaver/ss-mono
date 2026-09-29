import type { ParentProps } from "solid-js";

import { GlassSurface, access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.css";
import { BORDER_RADIUS_FULL } from "@thewaver/ss-playground/App/Theme.const";
import { themeVars } from "@thewaver/ss-playground/App/Theme.css";
import { CSSUtils } from "@thewaver/ss-utils";

import { PageLayer } from "../../PageComponents/Layer/Layer";
import type { TooltipContentProps } from "./TooltipContent.types";

const TINT_GRADIENT_ANGLE = 45;

export const PageTooltipContent = (props: ParentProps<TooltipContentProps>) => {
    return (
        <div
            class={styles.tooltipVisibility}
            classList={{ [styles.isVisible]: access(props.visibilityTarget) === 1 }}
            style={{ transition: `opacity ${access(props.transitionDurationMs)}ms` }}
        >
            <GlassSurface
                borderRadii={() => CSSUtils.spreadRadius(BORDER_RADIUS_FULL)}
                glassDefs={() => ({
                    tint: {
                        opacity: 1,
                        gradient: {
                            kind: "linear",
                            angle: TINT_GRADIENT_ANGLE,
                            colors: [{ value: themeVars.color.surface.dark }, { value: themeVars.color.surface.light }],
                        },
                    },
                    sheen: { specularConstant: 0 },
                })}
            >
                <div class={styles.tooltipBody}>
                    <PageLayer level={2}>{props.children}</PageLayer>
                </div>
            </GlassSurface>
        </div>
    );
};
