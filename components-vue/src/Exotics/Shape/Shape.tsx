import { Fragment, type SlotsType, defineComponent, shallowRef } from "vue";

import { ElementObserverUtils, ShapeLayerUtils, ShapeStyles } from "@thewaver/ss-components";
import { ShapeConst } from "@thewaver/ss-components/internal";

import type { SVGDefs } from "../../Generators/SVGDefs/SVGDefs.types";
import { watchAfterRender } from "../../Utils/effectUtils";
import { callSlot, declareProps } from "../../Utils/propUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import type { ShapeProps, ShapeSlots } from "./Shape.types";

const renderDefsElements = (defs: SVGDefs[], fillClips?: ({ id: string; path: string; rule: string } | undefined)[]) =>
    defs.map((def, index) => {
        const fillClip = fillClips?.[index];

        return (
            <Fragment key={index}>
                {def.gradientOrPattern?.renderDefsElement()}
                {def.filter?.renderDefsElement()}
                {fillClip ? (
                    <clipPath id={fillClip.id} clipPathUnits="userSpaceOnUse">
                        <path d={fillClip.path} clip-rule={fillClip.rule} />
                    </clipPath>
                ) : (
                    def.clipPath?.renderDefsElement()
                )}
            </Fragment>
        );
    });

const renderPath = (def: SVGDefs, index: number, d: string, fillRule?: "evenodd", clipId?: string) => {
    const paint = ShapeLayerUtils.computePaint(def);

    return (
        <path
            key={index}
            d={d}
            fill-rule={fillRule}
            fill={paint.fill}
            fill-opacity={paint.fillOpacity}
            filter={paint.filter}
            clip-path={clipId ? `url(#${clipId})` : paint.clipPath}
            style={paint.mixBlendMode ? { mixBlendMode: paint.mixBlendMode } : undefined}
        />
    );
};

export const Shape = defineComponent(
    (props: ShapeProps, { slots }: SlotsContext<ShapeSlots>) => {
        const rootRef = shallowRef<HTMLDivElement>();
        const rootSize = shallowRef(ShapeConst.INITIAL_SIZE);

        watchAfterRender([rootRef], ([root]) => {
            if (!root) return;

            return ElementObserverUtils.observeBorderBoxSize(root, (size) => {
                rootSize.value = size;
            });
        });

        return () => {
            const size = rootSize.value;
            const fillDefs = props.computeFillDefs?.(size, rootRef.value);
            const strokeDefs = props.computeStrokeDefs?.(size, rootRef.value);

            const geometry = ShapeLayerUtils.computeGeometry(
                props.computePoints(size),
                props.joinRadii,
                props.lameExponents,
                props.strokeGeom,
            );

            const paths = ShapeLayerUtils.computeLayerPaths(
                geometry.points,
                strokeDefs,
                geometry.strokeGeom,
                geometry.joinRadii,
                geometry.lameExponents,
            );

            const fillClips = fillDefs?.map((_def, index) => {
                const clip = props.fillGeom?.[index]?.clip;

                return (
                    clip && {
                        id: clip.id,
                        ...ShapeLayerUtils.computeFillClip(
                            geometry.points,
                            clip,
                            paths[0].outerPath,
                            geometry.joinRadii,
                            geometry.lameExponents,
                        ),
                    }
                );
            });

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
                            <defs>{renderDefsElements(fillDefs, fillClips)}</defs>

                            {fillDefs.map((def, index) =>
                                renderPath(
                                    def,
                                    index,
                                    ShapeLayerUtils.computeFillPath(
                                        geometry.points,
                                        props.fillGeom?.[index],
                                        paths[0].outerPath,
                                        geometry.joinRadii,
                                        geometry.lameExponents,
                                    ),
                                    undefined,
                                    fillClips?.[index]?.id,
                                ),
                            )}
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
            fillGeom: null,
            computePoints: null,
            computeStrokeDefs: null,
            computeFillDefs: null,
        }),
    },
);
