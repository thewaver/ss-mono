import { Fragment, type SlotsType, defineComponent, shallowRef } from "vue";

import { ShapeLayerUtils, ShapeStyles } from "@thewaver/ss-components";
import { Size2d } from "@thewaver/ss-utils";

import type { SVGDefs } from "../../Generators/SVGDefs/SVGDefs.types";
import { watchAfterRender } from "../../Utils/effectUtils";
import { callSlot, declareProps } from "../../Utils/propUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import type { ShapeProps, ShapeSlots } from "./Shape.types";

const INITIAL_SIZE: Size2d = { width: 0, height: 0 };

const renderDefsElements = (defs: SVGDefs[]) =>
    defs.map((def, index) => (
        <Fragment key={index}>
            {def.gradientOrPattern?.renderDefsElement()}
            {def.filter?.renderDefsElement()}
            {def.clipPath?.renderDefsElement()}
        </Fragment>
    ));

const renderPath = (def: SVGDefs, index: number, d: string, fillRule?: "evenodd") => {
    const paint = ShapeLayerUtils.computePaint(def);

    return (
        <path
            key={index}
            d={d}
            fill-rule={fillRule}
            fill={paint.fill}
            fill-opacity={paint.fillOpacity}
            filter={paint.filter}
            clip-path={paint.clipPath}
            style={paint.mixBlendMode ? { mixBlendMode: paint.mixBlendMode } : undefined}
        />
    );
};

export const Shape = defineComponent(
    (props: ShapeProps, { slots }: SlotsContext<ShapeSlots>) => {
        const rootRef = shallowRef<HTMLDivElement>();
        const rootSize = shallowRef(INITIAL_SIZE);

        watchAfterRender([rootRef], ([root]) => {
            if (!root) return;

            const observer = new ResizeObserver(() => {
                const next = { width: root.offsetWidth, height: root.offsetHeight };

                if (!Size2d.isSame(rootSize.value, next)) rootSize.value = next;
            });

            observer.observe(root);

            return () => observer.disconnect();
        });

        return () => {
            const size = rootSize.value;
            const fillDefs = props.computeFillDefs?.(size, rootRef.value);
            const strokeDefs = props.computeStrokeDefs?.(size, rootRef.value);

            const paths = ShapeLayerUtils.computeLayerPaths(
                props.computePoints(size),
                strokeDefs,
                props.strokeGeom,
                props.joinRadii,
                props.lameExponents,
            );

            const viewBox = `0 0 ${size.width} ${size.height}`;

            return (
                <div
                    ref={rootRef}
                    class={ShapeStyles.shapeRoot}
                    style={{ shapeOutside: ShapeLayerUtils.computeShapeOutside(paths[0].outerContour) }}
                >
                    {fillDefs && (
                        <svg
                            class={ShapeStyles.shapeFillSVG}
                            width={size.width}
                            height={size.height}
                            viewBox={viewBox}
                            overflow="visible"
                        >
                            <defs>{renderDefsElements(fillDefs)}</defs>

                            {fillDefs.map((def, index) => renderPath(def, index, paths[0].outerPath))}
                        </svg>
                    )}

                    {callSlot(slots.renderChildren, {
                        size,
                        clipPath: paths[0].outerPath,
                        clipPoints: paths[0].outerPoints,
                    })}

                    {strokeDefs && (
                        <svg
                            class={ShapeStyles.shapeStrokeSVG}
                            width={size.width}
                            height={size.height}
                            viewBox={viewBox}
                            overflow="visible"
                        >
                            <defs>{renderDefsElements(strokeDefs)}</defs>

                            {strokeDefs.map((def, index) =>
                                renderPath(
                                    def,
                                    index,
                                    `${paths[index].outerPath} ${paths[index].innerPath}`,
                                    "evenodd",
                                ),
                            )}
                        </svg>
                    )}
                </div>
            );
        };
    },
    {
        name: "Shape",
        slots: Object as SlotsType<ShapeSlots>,
        props: declareProps<ShapeProps>({
            joinRadii: null,
            lameExponents: null,
            strokeGeom: null,
            computePoints: null,
            computeStrokeDefs: null,
            computeFillDefs: null,
        }),
    },
);
