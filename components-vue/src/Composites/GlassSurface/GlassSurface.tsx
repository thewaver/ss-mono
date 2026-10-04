import { type SlotsType, defineComponent, useId } from "vue";

import { GlassSurfaceStyles, GlassUtils, SurfaceUtils } from "@thewaver/ss-components";
import { ShapeConst } from "@thewaver/ss-utils";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { GlassVueUtils } from "../../Abstracts/Glass/GlassVue.utils";
import { Shape } from "../../Exotics/Shape/Shape";
import type { ShapeSlots } from "../../Exotics/Shape/Shape.types";
import { declareProps } from "../../Utils/propUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import type { GlassSurfaceProps, GlassSurfaceSlots } from "./GlassSurface.types";

export const GlassSurface = defineComponent(
    (props: GlassSurfaceProps, { slots }: SlotsContext<GlassSurfaceSlots>) => {
        const id = useId();

        return () => {
            const defs = GlassUtils.mergeDefs(props.glassDefs);
            const joinRadii = SurfaceUtils.computeJoinRadii(props.borderRadii);
            const borderWidths = SurfaceUtils.computeBorderWidths(props.borderWidths);
            const lameExponents = SurfaceUtils.computeLameExponents(props.lameExponents);
            const margin = GlassUtils.computeBackdropMargin(defs);
            const rippleFilter = GlassVueUtils.computeBackdropFilterElement(id, defs);

            return (
                <div class={GlassSurfaceStyles.glassSurfaceRoot}>
                    <Shape
                        computePoints={(size) => ShapeConst.getDefaultShapePoints("square", size)}
                        joinRadii={joinRadii}
                        lameExponents={lameExponents}
                        computeStrokeDefs={props.computeStrokeDefs}
                        strokeGeom={props.computeStrokeDefs ? [{ thicknesses: borderWidths }] : undefined}
                        computeFillDefs={(size, element) =>
                            GlassVueUtils.computeSheenDefs(id, element, size, defs, props.pointSource)
                        }
                    >
                        {
                            {
                                renderChildren: ({ size, clipPath }) => {
                                    const backdropStyle = {
                                        clipPath: `path("${GlassUtils.computeMarginedClipPath(
                                            size,
                                            margin,
                                            joinRadii,
                                            lameExponents,
                                        )}")`,
                                        ...assignInlineVars({
                                            [GlassSurfaceStyles.backdropMarginVar]: `${margin}px`,
                                            [GlassSurfaceStyles.blurRadiusVar]: `${defs.backdrop.blurRadius}px`,
                                        }),
                                    };

                                    return (
                                        <>
                                            <svg class={GlassSurfaceStyles.glassDefs} aria-hidden="true">
                                                <defs>{rippleFilter}</defs>
                                            </svg>

                                            {defs.backdrop.blurRadius > 0 && (
                                                <div class={GlassSurfaceStyles.glassBlurLayer} style={backdropStyle} />
                                            )}

                                            {rippleFilter && (
                                                <div
                                                    class={GlassSurfaceStyles.glassRippleLayer}
                                                    style={{
                                                        ...backdropStyle,
                                                        backdropFilter: `url(#${GlassUtils.getBackdropFilterId(id)})`,
                                                    }}
                                                />
                                            )}

                                            <div
                                                class={GlassSurfaceStyles.glassContent}
                                                style={{ clipPath: `path("${clipPath}")` }}
                                            >
                                                {slots.default?.()}
                                            </div>
                                        </>
                                    );
                                },
                            } satisfies ShapeSlots
                        }
                    </Shape>
                </div>
            );
        };
    },
    {
        name: "GlassSurface",
        slots: Object as SlotsType<GlassSurfaceSlots>,
        props: declareProps<GlassSurfaceProps>({
            borderRadii: null,
            lameExponents: null,
            glassDefs: null,
            pointSource: null,
            borderWidths: null,
            computeStrokeDefs: null,
        }),
    },
);
