import { type CSSProperties, type PropsWithChildren, useId } from "react";

import { GlassSurfaceStyles, GlassUtils, SurfaceUtils } from "@thewaver/ss-components";
import { ShapeConst } from "@thewaver/ss-utils";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { GlassReactUtils } from "../../Abstracts/Glass/GlassReact.utils";
import { Shape } from "../../Exotics/Shape/Shape";
import type { GlassSurfaceProps } from "./GlassSurface.types";

export const GlassSurface = (props: PropsWithChildren<GlassSurfaceProps>) => {
    const id = useId();

    const defs = GlassUtils.mergeDefs(props.glassDefs);
    const joinRadii = SurfaceUtils.computeJoinRadii(props.borderRadii);
    const borderWidths = SurfaceUtils.computeBorderWidths(props.borderWidths);
    const lameExponents = SurfaceUtils.computeLameExponents(props.lameExponents);
    const margin = GlassUtils.computeBackdropMargin(defs);
    const rippleFilter = GlassReactUtils.computeBackdropFilterElement(id, defs);

    return (
        <div className={GlassSurfaceStyles.glassSurfaceRoot}>
            <Shape
                computePoints={(size) => ShapeConst.getDefaultShapePoints("square", size)}
                joinRadii={joinRadii}
                lameExponents={lameExponents}
                computeStrokeDefs={props.computeStrokeDefs}
                strokeGeom={props.computeStrokeDefs ? [{ thicknesses: borderWidths }] : undefined}
                computeFillDefs={(size, element) =>
                    GlassReactUtils.computeSheenDefs(id, element, size, defs, props.pointSource)
                }
                renderChildren={(size, clipPath) => {
                    const backdropStyle: CSSProperties = {
                        clipPath: `path("${GlassUtils.computeMarginedClipPath(
                            size,
                            margin,
                            joinRadii,
                            lameExponents,
                        )}")`,
                        ...(assignInlineVars({
                            [GlassSurfaceStyles.backdropMarginVar]: `${margin}px`,
                            [GlassSurfaceStyles.blurRadiusVar]: `${defs.backdrop.blurRadius}px`,
                        }) as CSSProperties),
                    };

                    return (
                        <>
                            <svg className={GlassSurfaceStyles.glassDefs} aria-hidden="true">
                                <defs>{rippleFilter}</defs>
                            </svg>

                            {defs.backdrop.blurRadius > 0 && (
                                <div className={GlassSurfaceStyles.glassBlurLayer} style={backdropStyle} />
                            )}

                            {rippleFilter && (
                                <div
                                    className={GlassSurfaceStyles.glassRippleLayer}
                                    style={{
                                        ...backdropStyle,
                                        backdropFilter: `url(#${GlassUtils.getBackdropFilterId(id)})`,
                                    }}
                                />
                            )}

                            <div
                                className={GlassSurfaceStyles.glassContent}
                                style={{ clipPath: `path("${clipPath}")` }}
                            >
                                {props.children}
                            </div>
                        </>
                    );
                }}
            />
        </div>
    );
};
