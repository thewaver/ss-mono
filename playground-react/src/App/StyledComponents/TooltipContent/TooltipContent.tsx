import type { PropsWithChildren } from "react";

import type { PartialGlassDefs } from "@thewaver/ss-components-react";
import { GlassSurface } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground-core/App/StyledComponents/TooltipContent/TooltipContent.css";
import { BORDER_RADIUS_FULL, themeVars } from "@thewaver/ss-playground-core/App/Theme.css";
import { CSSUtils } from "@thewaver/ss-utils";

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

export const PageTooltipContent = (props: PropsWithChildren<TooltipContentProps>) => {
    return (
        <div
            className={[styles.tooltipVisibility, props.visibilityTarget === 1 && styles.isVisible]
                .filter(Boolean)
                .join(" ")}
            style={{ transition: `opacity ${props.transitionDurationMs}ms` }}
        >
            <GlassSurface borderRadii={BORDER_RADII} glassDefs={GLASS_DEFS}>
                <div className={styles.tooltipBody}>
                    <PageLayer level={2}>{props.children}</PageLayer>
                </div>
            </GlassSurface>
        </div>
    );
};
