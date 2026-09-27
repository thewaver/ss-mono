import { createMemo, createSignal } from "solid-js";

import { ElementObserverSolidUtils } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground-core/App/Pages/ParticleFieldPage/ParticleFieldPage.css";
import { ShapeConst, ShapeUtils, type Size2d } from "@thewaver/ss-utils";

import type { ParticleFieldExampleProps } from "../ParticleFieldPage.types";
import { DefaultExample } from "./Default";

const NO_EDGE_THICKNESSES = [0];

export const ShapedExample = ({
    shapeKind,
    joinRadius,
    ...otherProps
}: ParticleFieldExampleProps & { shapeKind: () => ShapeConst.DefaultShape; joinRadius: () => number }) => {
    const [getRootRef, setRootRef] = createSignal<HTMLElement>();

    const getSize = ElementObserverSolidUtils.createBorderBoxSizeObserver(getRootRef);

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
