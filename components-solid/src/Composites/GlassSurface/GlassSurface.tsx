import { type ParentProps, Show, createMemo, createUniqueId } from "solid-js";

import { GlassUtils, SurfaceUtils, GlassSurfaceStyles as styles } from "@thewaver/ss-components";
import { ShapeConst } from "@thewaver/ss-utils";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { GlassSolidUtils } from "../../Abstracts/Glass/GlassSolid.utils";
import { Shape } from "../../Exotics/Shape/Shape";
import { access } from "../../Utils/propUtils";
import type { GlassSurfaceProps } from "./GlassSurfaceSolid.types";

export const GlassSurface = (props: ParentProps<GlassSurfaceProps>) => {
    const id = createUniqueId();

    const getDefs = createMemo(() => GlassUtils.mergeDefs(access(props.glassDefs)));

    const getJoinRadii = createMemo(() => SurfaceUtils.computeJoinRadii(access(props.borderRadii)));

    const getBorderWidths = createMemo(() => SurfaceUtils.computeBorderWidths(access(props.borderWidths)));

    const getLameExponents = createMemo(() => SurfaceUtils.computeLameExponents(access(props.lameExponents)));

    return (
        <div class={styles.glassSurfaceRoot}>
            <Shape
                computePoints={(size) => ShapeConst.getDefaultShapePoints("square", size)}
                joinRadii={getJoinRadii}
                lameExponents={getLameExponents}
                computeStrokeDefs={props.computeStrokeDefs}
                strokeGeom={props.computeStrokeDefs ? () => [{ thicknesses: getBorderWidths() }] : undefined}
                computeFillDefs={(getSize, getRef) => GlassSolidUtils.computeSheenDefs(id, getRef, getSize, getDefs())}
                renderChildren={(getSize, getClipPath) => {
                    const getClip = () => ({ "clip-path": `path("${getClipPath()}")` });
                    const getRippleFilter = createMemo(() =>
                        GlassSolidUtils.computeBackdropFilterElement(id, getDefs()),
                    );
                    const getMargin = createMemo(() => GlassUtils.computeBackdropMargin(getDefs()));

                    const getBackdropStyle = createMemo(() => ({
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
                    }));

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
