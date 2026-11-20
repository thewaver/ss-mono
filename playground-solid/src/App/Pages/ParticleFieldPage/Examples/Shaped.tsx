import { createMemo, createSignal, splitProps } from "solid-js";

import { ElementObserverSolidUtils } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/ParticleFieldPage/ParticleFieldPage.css";
import { ShapeConst, ShapeUtils, type Size2d } from "@thewaver/ss-utils";

import type { ParticleFieldExampleProps } from "../ParticleFieldPage.types";
import { DefaultExample } from "./Default";

const NO_EDGE_THICKNESSES = [0];

export const ShapedExample = (
    props: ParticleFieldExampleProps & { shapeKind: () => ShapeConst.DefaultShape; joinRadius: () => number },
) => {
    const [, otherProps] = splitProps(props, ["shapeKind", "joinRadius"]);

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();

    const getSize = ElementObserverSolidUtils.createBorderBoxSizeObserver(getRootRef);

    const computeShapePoints = (size: Size2d) => ShapeConst.getDefaultShapePoints(props.shapeKind(), size);

    const getContourPath = createMemo(
        () => ShapeUtils.getPaths(computeShapePoints(getSize()), NO_EDGE_THICKNESSES, [props.joinRadius()]).outerPath,
    );

    return (
        <div ref={setRootRef} class={styles.shapedRoot}>
            <svg class={styles.shapeContour} aria-hidden="true">
                <path d={getContourPath()} />
            </svg>

            <DefaultExample
                {...otherProps}
                computeShapePoints={computeShapePoints}
                shapeJoinRadii={() => [props.joinRadius()]}
            />
        </div>
    );
};
