import type { CSSProperties, PropsWithChildren } from "react";

import { SurfaceStyles, SurfaceUtils } from "@thewaver/ss-components";
import { SurfaceConst } from "@thewaver/ss-components/internal";
import { ShapeConst } from "@thewaver/ss-utils";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { Shape } from "../../Exotics/Shape/Shape";
import type { SurfaceProps } from "./Surface.types";

const toPixels = (values: object) =>
    Object.fromEntries(Object.entries(values).map(([key, value]) => [key, `${value}px`])) as CSSProperties;

const SurfaceSVG = (props: PropsWithChildren<SurfaceProps>) => {
    const borderWidths = SurfaceUtils.computeBorderWidths(props.borderWidths);

    return (
        <Shape
            computePoints={(size) => ShapeConst.getDefaultShapePoints("square", size)}
            computeFillDefs={props.computeFillDefs}
            computeStrokeDefs={props.computeStrokeDefs}
            strokeGeom={props.computeStrokeDefs ? [{ thicknesses: borderWidths }] : undefined}
            joinRadii={SurfaceUtils.computeJoinRadii(props.borderRadii)}
            lameExponents={SurfaceUtils.computeLameExponents(props.lameExponents)}
            renderChildren={(_, clipPath) => <div style={{ clipPath: `path("${clipPath}")` }}>{props.children}</div>}
        />
    );
};

const SurfaceDiv = (props: PropsWithChildren<SurfaceProps>) => {
    const fillColorDef = SurfaceUtils.findColorDef(props.computeFillDefs?.(SurfaceConst.MOCK_SIZE, undefined));
    const strokeColorDef = SurfaceUtils.findColorDef(props.computeStrokeDefs?.(SurfaceConst.MOCK_SIZE, undefined));

    return (
        <div
            className={SurfaceStyles.surfaceDivRoot}
            style={{
                ...(assignInlineVars({
                    [SurfaceStyles.fillColorVar]: fillColorDef?.color ?? "transparent",
                    [SurfaceStyles.fillOpacityVar]: SurfaceUtils.computeOpacityPercent(fillColorDef),
                }) as CSSProperties),
                ...toPixels(props.borderRadii),
            }}
        >
            {props.children}
            {SurfaceUtils.getHasBorder(strokeColorDef, props.borderWidths) && (
                <div
                    className={SurfaceStyles.surfaceDivBorder}
                    style={{
                        ...(assignInlineVars({
                            [SurfaceStyles.strokeColorVar]: strokeColorDef?.color ?? "transparent",
                            [SurfaceStyles.strokeOpacityVar]: SurfaceUtils.computeOpacityPercent(strokeColorDef),
                        }) as CSSProperties),
                        ...toPixels(props.borderWidths),
                    }}
                />
            )}
        </div>
    );
};

export const Surface = (props: PropsWithChildren<SurfaceProps>) =>
    SurfaceUtils.getIsComplex(
        props.computeFillDefs?.(SurfaceConst.MOCK_SIZE, undefined),
        props.computeStrokeDefs?.(SurfaceConst.MOCK_SIZE, undefined),
        props.lameExponents,
    ) ? (
        <SurfaceSVG {...props} />
    ) : (
        <SurfaceDiv {...props} />
    );
