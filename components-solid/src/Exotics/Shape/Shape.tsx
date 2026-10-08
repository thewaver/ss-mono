import { For, createMemo, createSignal, onCleanup, onMount } from "solid-js";

import { ShapeLayerUtils, ShapeStyles as styles } from "@thewaver/ss-components";
import { Size2d } from "@thewaver/ss-utils";

import type { SVGDefs } from "../../Generators/SVGDefs/SVGDefsSolid.types";
import { access } from "../../Utils/propUtils";
import type { ShapeProps } from "./ShapeSolid.types";

const renderPath = (def: SVGDefs, getD: () => string, fillRule?: "evenodd") => {
    const paint = ShapeLayerUtils.computePaint(def);

    return (
        <path
            d={getD()}
            fill-rule={fillRule}
            fill={paint.fill}
            fill-opacity={paint.fillOpacity}
            filter={paint.filter}
            clip-path={paint.clipPath}
            style={paint.mixBlendMode ? { "mix-blend-mode": paint.mixBlendMode } : undefined}
        />
    );
};

export const Shape = (props: ShapeProps) => {
    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getRootSize, setRootSize] = createSignal<Size2d>({ width: 0, height: 0 }, { equals: Size2d.isSame });

    const getFillDefs = createMemo(() => {
        return props.computeFillDefs?.(getRootSize, getRootRef);
    });

    const getStrokeDefs = createMemo(() => {
        return props.computeStrokeDefs?.(getRootSize, getRootRef);
    });

    const getGeometry = createMemo(() =>
        ShapeLayerUtils.computeGeometry(
            props.computePoints(getRootSize()),
            access(props.joinRadii),
            access(props.lameExponents),
            access(props.strokeGeom),
        ),
    );

    const getPaths = createMemo(() =>
        ShapeLayerUtils.computeLayerPaths(
            getGeometry().points,
            getStrokeDefs(),
            getGeometry().strokeGeom,
            getGeometry().joinRadii,
            getGeometry().lameExponents,
        ),
    );

    const getShapeOutside = createMemo(() => ShapeLayerUtils.computeShapeOutside(getPaths()[0].outerContour));

    onMount(() => {
        let rootResizeObserver: ResizeObserver | undefined;

        onCleanup(() => {
            rootResizeObserver?.disconnect();
        });

        const rootRef = getRootRef();

        if (!rootRef) return;

        rootResizeObserver = new ResizeObserver(() => {
            setRootSize({ width: rootRef.offsetWidth, height: rootRef.offsetHeight });
        });
        rootResizeObserver.observe(rootRef);
    });

    return (
        <div ref={setRootRef} class={styles.shapeRoot} style={{ "shape-outside": getShapeOutside() }}>
            {getFillDefs() && (
                <svg
                    class={styles.shapeFillSVG}
                    width={getRootSize().width}
                    height={getRootSize().height}
                    viewBox={`0 0 ${getRootSize().width} ${getRootSize().height}`}
                    overflow="visible"
                >
                    <defs>
                        <For each={getFillDefs()}>
                            {(def) => (
                                <>
                                    {def.gradientOrPattern?.renderDefsElement()}
                                    {def.filter?.renderDefsElement()}
                                    {def.clipPath?.renderDefsElement()}
                                </>
                            )}
                        </For>
                    </defs>

                    <For each={getFillDefs()}>{(def) => renderPath(def, () => getPaths()[0].outerPath)}</For>
                </svg>
            )}

            {props.renderChildren(
                getRootSize,
                () => getPaths()[0].outerPath,
                () => getPaths()[0].outerPoints,
            )}

            {getStrokeDefs() && (
                <svg
                    class={styles.shapeStrokeSVG}
                    width={getRootSize().width}
                    height={getRootSize().height}
                    viewBox={`0 0 ${getRootSize().width} ${getRootSize().height}`}
                    overflow="visible"
                >
                    <defs>
                        <For each={getStrokeDefs()}>
                            {(def) => (
                                <>
                                    {def.gradientOrPattern?.renderDefsElement()}
                                    {def.filter?.renderDefsElement()}
                                    {def.clipPath?.renderDefsElement()}
                                </>
                            )}
                        </For>
                    </defs>

                    <For each={getStrokeDefs()}>
                        {(def, getIndex) =>
                            renderPath(
                                def,
                                () => `${getPaths()[getIndex()].outerPath} ${getPaths()[getIndex()].innerPath}`,
                                "evenodd",
                            )
                        }
                    </For>
                </svg>
            )}
        </div>
    );
};
