import { type ParentProps, Show } from "solid-js";

import { GlassSurface, Shape, access } from "@thewaver/ss-components-solid";
import { TooltipKnobs } from "@thewaver/ss-playground/App/Knobs/Tooltips.const";
import { TOOLTIP_ARROW_TEMPLATES } from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.const";
import * as styles from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.css";
import { BORDER_RADIUS_FULL } from "@thewaver/ss-playground/App/Theme.const";
import { themeVars } from "@thewaver/ss-playground/App/Theme.css";
import { CSSUtils, ShapeConst, ShapeUtils } from "@thewaver/ss-utils";

import { PageLayer } from "../../PageComponents/Layer/Layer";
import type { TooltipContentProps } from "./TooltipContent.types";

const TINT_GRADIENT_ANGLE = 45;

export const PageTooltipContent = (props: ParentProps<TooltipContentProps>) => {
    const getArrow = () => {
        const arrow = access(props.arrow) ?? "none";

        return arrow === "none" ? undefined : arrow;
    };

    return (
        <div
            class={[styles.tooltipVisibility, styles.tooltipRevealVariants[access(props.reveal) ?? "fade"]].join(" ")}
            classList={{
                [styles.isVisible]: access(props.visibilityTarget) === 1,
                [styles.tooltipArrowed]: !!getArrow(),
            }}
            style={{ "transition-duration": `${access(props.transitionDurationMs)}ms` }}
        >
            <Show
                when={getArrow()}
                fallback={
                    <GlassSurface
                        borderRadii={() => CSSUtils.spreadRadius(BORDER_RADIUS_FULL)}
                        glassDefs={() => ({
                            tint: {
                                opacity: 1,
                                gradient: {
                                    kind: "linear",
                                    angle: TINT_GRADIENT_ANGLE,
                                    colors: [
                                        { value: themeVars.color.surface.dark },
                                        { value: themeVars.color.surface.light },
                                    ],
                                },
                            },
                            sheen: { specularConstant: 0 },
                        })}
                    >
                        <div class={styles.tooltipBody}>
                            <PageLayer level={2}>{props.children}</PageLayer>
                        </div>
                    </GlassSurface>
                }
            >
                {(getArrowKind) => (
                    <div class={styles.tooltipArrowShadow}>
                        <Shape
                            computePoints={(size) =>
                                ShapeUtils.attachArrow(
                                    {
                                        points: ShapeConst.getDefaultShapePoints("square", size),
                                        joinRadii: [BORDER_RADIUS_FULL],
                                    },
                                    access(props.arrowAim),
                                    TOOLTIP_ARROW_TEMPLATES[getArrowKind()](
                                        access(props.arrowWidth) ?? TooltipKnobs.STARTING_ARROW_WIDTH,
                                        access(props.arrowLength) ?? TooltipKnobs.STARTING_ARROW_LENGTH,
                                    ),
                                )
                            }
                            computeFillDefs={() => [{ color: themeVars.color.surface.dark }]}
                            renderChildren={() => (
                                <div class={styles.tooltipBody}>
                                    <PageLayer level={2}>{props.children}</PageLayer>
                                </div>
                            )}
                        />
                    </div>
                )}
            </Show>
        </div>
    );
};
