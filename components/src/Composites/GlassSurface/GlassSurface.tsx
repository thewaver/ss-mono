import { type ParentProps, Show, createMemo, createUniqueId } from "solid-js";

import { ShapeConst } from "@thewaver/ss-utils";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { GlassUtils } from "../../Abstracts/Glass/Glass.utils";
import { Shape } from "../../Exotics/Shape/Shape";
import { access } from "../../Utils/propUtils";
import type { GlassSurfaceProps } from "./GlassSurface.types";

import * as styles from "./GlassSurface.css";

const NO_BORDER_WIDTHS = [0];

export const GlassSurface = (props: ParentProps<GlassSurfaceProps>) => {
    const id = createUniqueId();

    const getDefs = createMemo(() => GlassUtils.mergeDefs(access(props.glassDefs)));

    const getJoinRadii = createMemo(() => {
        const namedRadii = access(props.borderRadii);

        return [
            namedRadii.borderTopLeftRadius,
            namedRadii.borderTopRightRadius,
            namedRadii.borderBottomRightRadius,
            namedRadii.borderBottomLeftRadius,
        ];
    });

    const getBorderWidths = createMemo(() => {
        const namedWidths = access(props.borderWidths);

        if (!namedWidths) return NO_BORDER_WIDTHS;

        return [
            namedWidths.borderTopWidth,
            namedWidths.borderRightWidth,
            namedWidths.borderBottomWidth,
            namedWidths.borderLeftWidth,
        ];
    });

    const getLameExponents = createMemo(() => {
        const namedShapes = access(props.lameExponents);

        if (!namedShapes) return [ShapeConst.CORNER_SHAPE_LAME_EXPONENTS.round];

        return [
            namedShapes.cornerTopLeftShape,
            namedShapes.cornerTopRightShape,
            namedShapes.cornerBottomRightShape,
            namedShapes.cornerBottomLeftShape,
        ];
    });

    return (
        <div class={styles.glassSurfaceRoot}>
            <Shape
                computePoints={(size) => ShapeConst.getDefaultShapePoints("square", size)}
                joinRadii={getJoinRadii}
                lameExponents={getLameExponents}
                computeStrokeDefs={props.computeStrokeDefs}
                strokeGeom={props.computeStrokeDefs ? () => [{ thicknesses: getBorderWidths() }] : undefined}
                computeFillDefs={(getSize, getRef) => GlassUtils.computeSheenDefs(id, getRef, getSize, getDefs())}
                renderChildren={(getSize, getClipPath) => {
                    const getClip = () => ({ "clip-path": `path("${getClipPath()}")` });
                    const getRippleFilter = createMemo(() => GlassUtils.computeBackdropFilterElement(id, getDefs()));
                    const getMargin = createMemo(() => GlassUtils.computeBackdropMargin(getDefs()));

                    const getBackdropStyle = () => ({
                        "clip-path": `path("${GlassUtils.computeMarginedClipPath(
                            getSize(),
                            getMargin(),
                            getJoinRadii(),
                            getLameExponents(),
                        )}")`,
                        ...assignInlineVars({
                            [styles.backdropMarginVar]: `${getMargin()}px`,
                            [styles.blurRadiusVar]: `${getDefs().backdrop.blurRadius}px`,
                        }),
                    });

                    return (
                        <>
                            <svg class={styles.glassDefs} aria-hidden="true">
                                <defs>{getRippleFilter()}</defs>
                            </svg>

                            <Show when={getDefs().backdrop.blurRadius > 0}>
                                <div class={styles.glassBlurLayer} style={getBackdropStyle()} />
                            </Show>

                            <Show when={getRippleFilter()}>
                                <div
                                    class={styles.glassRippleLayer}
                                    style={{
                                        ...getBackdropStyle(),
                                        "backdrop-filter": `url(#${GlassUtils.getBackdropFilterId(id)})`,
                                    }}
                                />
                            </Show>

                            <div class={styles.glassContent} style={getClip()}>
                                {props.children}
                            </div>
                        </>
                    );
                }}
            />
        </div>
    );
};
