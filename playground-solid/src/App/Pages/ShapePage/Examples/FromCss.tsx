import { type Accessor, createEffect, createSignal, createUniqueId } from "solid-js";

import { SVGStyleDefsSolidUtils, Shape } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/ShapePage/ShapePage.css";
import { ShapeConst, Size2d } from "@thewaver/ss-utils";

type Converted = ReturnType<typeof SVGStyleDefsSolidUtils.computeDefsFromStyle>;

type Props = {
    cssText: Accessor<string>;
};

const NOTHING_CONVERTED: Converted = {
    fillDefs: [],
    fillGeom: [],
    strokeDefs: [],
    strokeGeom: [],
    joinRadii: [],
    lameExponents: [],
};

export const FromCssExample = (props: Props) => {
    const id = createUniqueId();

    const [getSourceRef, setSourceRef] = createSignal<HTMLElement>();
    const [getConverted, setConverted] = createSignal(NOTHING_CONVERTED);
    const [getBoxSize, setBoxSize] = createSignal<Size2d>({ width: 0, height: 0 });

    createEffect(() => {
        const source = getSourceRef();

        props.cssText();

        if (!source) return;

        const size = { width: source.offsetWidth, height: source.offsetHeight };

        setBoxSize(size);
        setConverted(SVGStyleDefsSolidUtils.computeDefsFromStyle(getComputedStyle(source), size, id));
    });

    return (
        <div class={styles.fromCssRow}>
            <div ref={setSourceRef} class={styles.fromCssBox} style={props.cssText()}>
                CSS
            </div>

            <Shape
                joinRadii={() => getConverted().joinRadii}
                fillGeom={() => getConverted().fillGeom}
                lameExponents={() => getConverted().lameExponents}
                strokeGeom={() => getConverted().strokeGeom}
                computePoints={(size) => ShapeConst.getDefaultShapePoints("square", size)}
                computeFillDefs={() => getConverted().fillDefs}
                computeStrokeDefs={() => getConverted().strokeDefs}
                renderChildren={() => (
                    <div
                        class={styles.fromCssCaption}
                        style={{ width: `${getBoxSize().width}px`, height: `${getBoxSize().height}px` }}
                    >
                        SVG
                    </div>
                )}
            />
        </div>
    );
};
