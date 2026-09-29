import { type ParentProps, createMemo } from "solid-js";
import { Dynamic } from "solid-js/web";

import { SurfaceUtils, SurfaceStyles as styles } from "@thewaver/ss-components";
import { ShapeConst, Size2d, StringUtils } from "@thewaver/ss-utils";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { Shape } from "../../Exotics/Shape/Shape";
import { access } from "../../Utils/propUtils";
import type { SurfaceProps } from "./SurfaceSolid.types";

const MOCK_SIZE: Size2d = { width: 0, height: 0 };
const MOCK_GET_SIZE = () => MOCK_SIZE;
const MOCK_GET_REF = () => undefined;

const SurfaceSVG = (props: ParentProps<SurfaceProps>) => {
    const getBorderWidths = createMemo(() => SurfaceUtils.computeBorderWidths(access(props.borderWidths)));

    const getJoinRadii = createMemo(() => SurfaceUtils.computeJoinRadii(access(props.borderRadii)));

    const getLameExponents = createMemo(() => SurfaceUtils.computeLameExponents(access(props.lameExponents)));

    return (
        <Shape
            computePoints={(size) => ShapeConst.getDefaultShapePoints("square", size)}
            computeFillDefs={props.computeFillDefs}
            computeStrokeDefs={props.computeStrokeDefs}
            strokeGeom={props.computeStrokeDefs ? () => [{ thicknesses: getBorderWidths() }] : undefined}
            joinRadii={getJoinRadii}
            lameExponents={getLameExponents}
            renderChildren={(_, getClipPath) => (
                <div style={{ "clip-path": `path("${getClipPath()}")` }}>{props.children}</div>
            )}
        />
    );
};

const SurfaceDiv = (props: ParentProps<SurfaceProps>) => {
    const getFillColorDef = createMemo(() =>
        SurfaceUtils.findColorDef(props.computeFillDefs?.(MOCK_GET_SIZE, MOCK_GET_REF)),
    );
    const getStrokeColorDef = createMemo(() =>
        SurfaceUtils.findColorDef(props.computeStrokeDefs?.(MOCK_GET_SIZE, MOCK_GET_REF)),
    );

    const getHasBorder = createMemo(() => SurfaceUtils.getHasBorder(getStrokeColorDef(), access(props.borderWidths)));

    return (
        <div
            class={styles.surfaceDivRoot}
            style={{
                ...assignInlineVars({
                    [styles.fillColorVar]: getFillColorDef()?.color ?? "transparent",
                    [styles.fillOpacityVar]: SurfaceUtils.computeOpacityPercent(getFillColorDef()),
                }),
                ...Object.fromEntries(
                    Object.entries(access(props.borderRadii)).map(([key, value]) => [
                        StringUtils.camelToKebabCase(key),
                        `${value}px`,
                    ]),
                ),
            }}
        >
            {props.children}
            {getHasBorder() && (
                <div
                    class={styles.surfaceDivBorder}
                    style={{
                        ...assignInlineVars({
                            [styles.strokeColorVar]: getStrokeColorDef()?.color ?? "transparent",
                            [styles.strokeOpacityVar]: SurfaceUtils.computeOpacityPercent(getStrokeColorDef()),
                        }),
                        ...Object.fromEntries(
                            Object.entries(access(props.borderWidths)).map(([key, value]) => [
                                StringUtils.camelToKebabCase(key),
                                `${value}px`,
                            ]),
                        ),
                    }}
                />
            )}
        </div>
    );
};

export const Surface = (props: SurfaceProps) => {
    const getIsComplex = () =>
        SurfaceUtils.getIsComplex(
            props.computeFillDefs?.(MOCK_GET_SIZE, MOCK_GET_REF),
            props.computeStrokeDefs?.(MOCK_GET_SIZE, MOCK_GET_REF),
            access(props.lameExponents),
        );

    return <Dynamic component={getIsComplex() ? SurfaceSVG : SurfaceDiv} {...props} />;
};
