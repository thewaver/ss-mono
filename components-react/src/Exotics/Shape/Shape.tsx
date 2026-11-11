import { Fragment, useLayoutEffect, useRef, useState } from "react";

import { ElementObserverUtils, ShapeLayerUtils, ShapeStyles } from "@thewaver/ss-components";
import { ShapeConst } from "@thewaver/ss-components/internal";

import type { SVGDefs } from "../../Generators/SVGDefs/SVGDefs.types";
import { useElement } from "../../Utils/refUtils";
import type { ShapeProps } from "./Shape.types";

const renderDefsElements = (defs: SVGDefs[], fillClips?: ({ id: string; path: string; rule: string } | undefined)[]) =>
    defs.map((def, index) => {
        const fillClip = fillClips?.[index];

        return (
            <Fragment key={index}>
                {def.gradientOrPattern?.renderDefsElement()}
                {def.filter?.renderDefsElement()}
                {fillClip ? (
                    <clipPath id={fillClip.id} clipPathUnits="userSpaceOnUse">
                        <path d={fillClip.path} clipRule={fillClip.rule} />
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
            fillRule={fillRule}
            fill={paint.fill}
            fillOpacity={paint.fillOpacity}
            filter={paint.filter}
            clipPath={clipId ? `url(#${clipId})` : paint.clipPath}
            style={paint.mixBlendMode ? { mixBlendMode: paint.mixBlendMode } : undefined}
        />
    );
};

export const Shape = (props: ShapeProps) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const rootElement = useElement(rootRef);
    const [rootSize, setRootSize] = useState(ShapeConst.INITIAL_SIZE);

    useLayoutEffect(() => {
        const root = rootRef.current;

        if (!root) return;

        return ElementObserverUtils.observeBorderBoxSize(root, setRootSize);
    }, []);

    const fillDefs = props.computeFillDefs?.(rootSize, rootElement);
    const strokeDefs = props.computeStrokeDefs?.(rootSize, rootElement);

    const geometry = ShapeLayerUtils.computeGeometry(
        props.computePoints(rootSize),
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

    const viewBox = `0 0 ${rootSize.width} ${rootSize.height}`;

    return (
        <div
            ref={rootRef}
            className={ShapeStyles.shapeRoot}
            style={{ shapeOutside: ShapeLayerUtils.computeShapeOutside(paths[0].outerContour) }}
        >
            {fillDefs && (
                <svg
                    className={ShapeStyles.shapeFillSVG}
                    width={rootSize.width}
                    height={rootSize.height}
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

            {props.renderChildren(rootSize, paths[0].outerPath, paths[0].outerPoints)}

            {strokeDefs && (
                <svg
                    className={ShapeStyles.shapeStrokeSVG}
                    width={rootSize.width}
                    height={rootSize.height}
                    viewBox={viewBox}
                    overflow="visible"
                >
                    <defs>{renderDefsElements(strokeDefs)}</defs>

                    {strokeDefs.map((def, index) =>
                        renderPath(def, index, `${paths[index].outerPath} ${paths[index].innerPath}`, "evenodd"),
                    )}
                </svg>
            )}
        </div>
    );
};
