import { createMemo, createSignal } from "solid-js";

import { ElementObserverUtils } from "@thewaver/ss-components";
import { ShapeConst, ShapeUtils, type Size2d } from "@thewaver/ss-utils";

import type { ParticleFieldExampleProps } from "../ParticleFieldPage.types";
import { DefaultExample } from "./Default";

import * as styles from "../ParticleFieldPage.css";

const NO_EDGE_THICKNESSES = [0];

export const ShapedExample = ({
    shapeKind,
    joinRadius,
    ...otherProps
}: ParticleFieldExampleProps & { shapeKind: () => ShapeConst.DefaultShape; joinRadius: () => number }) => {
    const [getRootRef, setRootRef] = createSignal<HTMLElement>();

    const getSize = ElementObserverUtils.createBorderBoxSizeObserver(getRootRef);

    const computeShapePoints = (size: Size2d) => ShapeConst.getDefaultShapePoints(shapeKind(), size);

    const getOutlinePath = createMemo(
        () => ShapeUtils.getPaths(computeShapePoints(getSize()), NO_EDGE_THICKNESSES, [joinRadius()]).outerPath,
    );

    return (
        <div ref={setRootRef} class={styles.shapedRoot}>
            <svg class={styles.shapeOutline} aria-hidden="true">
                <path d={getOutlinePath()} />
            </svg>

            <DefaultExample
                {...otherProps}
                computeShapePoints={computeShapePoints}
                shapeJoinRadii={() => [joinRadius()]}
            />
        </div>
    );
};
