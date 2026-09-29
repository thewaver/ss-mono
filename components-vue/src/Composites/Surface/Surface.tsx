import { type SlotsType, type VNodeChild, defineComponent } from "vue";

import { SurfaceStyles, SurfaceUtils } from "@thewaver/ss-components";
import { ShapeConst, type Size2d } from "@thewaver/ss-utils";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { Shape } from "../../Exotics/Shape/Shape";
import type { ShapeSlots } from "../../Exotics/Shape/Shape.types";
import { declareProps } from "../../Utils/propUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import type { SurfaceProps, SurfaceSlots } from "./Surface.types";

const MOCK_SIZE: Size2d = { width: 0, height: 0 };

const toPixels = (values: object) =>
    Object.fromEntries(Object.entries(values).map(([key, value]) => [key, `${value}px`]));

const renderSurfaceSVG = (props: SurfaceProps, children: VNodeChild) => {
    const borderWidths = SurfaceUtils.computeBorderWidths(props.borderWidths);

    return (
        <Shape
            computePoints={(size) => ShapeConst.getDefaultShapePoints("square", size)}
            computeFillDefs={props.computeFillDefs}
            computeStrokeDefs={props.computeStrokeDefs}
            strokeGeom={props.computeStrokeDefs ? [{ thicknesses: borderWidths }] : undefined}
            joinRadii={SurfaceUtils.computeJoinRadii(props.borderRadii)}
            lameExponents={SurfaceUtils.computeLameExponents(props.lameExponents)}
        >
            {
                {
                    renderChildren: ({ clipPath }) => <div style={{ clipPath: `path("${clipPath}")` }}>{children}</div>,
                } satisfies ShapeSlots
            }
        </Shape>
    );
};

const renderSurfaceDiv = (props: SurfaceProps, children: VNodeChild) => {
    const fillColorDef = SurfaceUtils.findColorDef(props.computeFillDefs?.(MOCK_SIZE, undefined));
    const strokeColorDef = SurfaceUtils.findColorDef(props.computeStrokeDefs?.(MOCK_SIZE, undefined));

    return (
        <div
            class={SurfaceStyles.surfaceDivRoot}
            style={{
                ...assignInlineVars({
                    [SurfaceStyles.fillColorVar]: fillColorDef?.color ?? "transparent",
                    [SurfaceStyles.fillOpacityVar]: SurfaceUtils.computeOpacityPercent(fillColorDef),
                }),
                ...toPixels(props.borderRadii),
            }}
        >
            {children}
            {SurfaceUtils.getHasBorder(strokeColorDef, props.borderWidths) && (
                <div
                    class={SurfaceStyles.surfaceDivBorder}
                    style={{
                        ...assignInlineVars({
                            [SurfaceStyles.strokeColorVar]: strokeColorDef?.color ?? "transparent",
                            [SurfaceStyles.strokeOpacityVar]: SurfaceUtils.computeOpacityPercent(strokeColorDef),
                        }),
                        ...toPixels(props.borderWidths),
                    }}
                />
            )}
        </div>
    );
};

export const Surface = defineComponent(
    (props: SurfaceProps, { slots }: SlotsContext<SurfaceSlots>) => () =>
        SurfaceUtils.getIsComplex(
            props.computeFillDefs?.(MOCK_SIZE, undefined),
            props.computeStrokeDefs?.(MOCK_SIZE, undefined),
            props.lameExponents,
        )
            ? renderSurfaceSVG(props, slots.default?.())
            : renderSurfaceDiv(props, slots.default?.()),
    {
        name: "Surface",
        slots: Object as SlotsType<SurfaceSlots>,
        props: declareProps<SurfaceProps>({
            borderWidths: null,
            borderRadii: null,
            lameExponents: null,
            computeStrokeDefs: null,
            computeFillDefs: null,
        }),
    },
);
