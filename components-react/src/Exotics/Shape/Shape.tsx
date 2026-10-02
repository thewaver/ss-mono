import { Fragment, useLayoutEffect, useRef, useState } from "react";

import { ShapeLayerUtils, ShapeStyles } from "@thewaver/ss-components";
import { Size2d } from "@thewaver/ss-utils";

import type { SVGDefs } from "../../Generators/SVGDefs/SVGDefs.types";
import { useElement } from "../../Utils/refUtils";
import type { ShapeProps } from "./Shape.types";

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
            fillRule={fillRule}
            fill={paint.fill}
            fillOpacity={paint.fillOpacity}
            filter={paint.filter}
            clipPath={paint.clipPath}
            style={paint.mixBlendMode ? { mixBlendMode: paint.mixBlendMode } : undefined}
        />
    );
};

export const Shape = (props: ShapeProps) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const rootElement = useElement(rootRef);
    const [rootSize, setRootSize] = useState(INITIAL_SIZE);

    useLayoutEffect(() => {
        const root = rootRef.current;

        if (!root) return;

        const observer = new ResizeObserver(() => {
            const next = { width: root.offsetWidth, height: root.offsetHeight };

            setRootSize((previous) => (Size2d.isSame(previous, next) ? previous : next));
        });

        observer.observe(root);

        return () => observer.disconnect();
    }, []);

    const fillDefs = props.computeFillDefs?.(rootSize, rootElement);
    const strokeDefs = props.computeStrokeDefs?.(rootSize, rootElement);

    const paths = ShapeLayerUtils.computeLayerPaths(
        props.computePoints(rootSize),
        strokeDefs,
        props.strokeGeom,
        props.joinRadii,
        props.lameExponents,
    );

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
                    <defs>{renderDefsElements(fillDefs)}</defs>

                    {fillDefs.map((def, index) => renderPath(def, index, paths[0].outerPath))}
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
