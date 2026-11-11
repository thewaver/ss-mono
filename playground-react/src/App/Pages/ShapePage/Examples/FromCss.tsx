import { useId, useLayoutEffect, useRef, useState } from "react";

import { SVGStyleDefsReactUtils, Shape } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/ShapePage/ShapePage.css";
import { ShapeConst, type Size2d } from "@thewaver/ss-utils";

type Converted = ReturnType<typeof SVGStyleDefsReactUtils.computeDefsFromStyle>;

type Props = {
    cssText: string;
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
    const id = useId();
    const sourceRef = useRef<HTMLDivElement>(null);
    const [converted, setConverted] = useState(NOTHING_CONVERTED);
    const [boxSize, setBoxSize] = useState<Size2d>({ width: 0, height: 0 });

    useLayoutEffect(() => {
        const source = sourceRef.current;

        if (!source) return;

        source.style.cssText = props.cssText;

        const size = { width: source.offsetWidth, height: source.offsetHeight };

        setBoxSize(size);
        setConverted(SVGStyleDefsReactUtils.computeDefsFromStyle(getComputedStyle(source), size, id));
    }, [props.cssText, id]);

    return (
        <div className={styles.fromCssRow}>
            <div ref={sourceRef} className={styles.fromCssBox}>
                CSS
            </div>

            <Shape
                joinRadii={converted.joinRadii}
                fillGeom={converted.fillGeom}
                lameExponents={converted.lameExponents}
                strokeGeom={converted.strokeGeom}
                computePoints={(size) => ShapeConst.getDefaultShapePoints("square", size)}
                computeFillDefs={() => converted.fillDefs}
                computeStrokeDefs={() => converted.strokeDefs}
                renderChildren={() => (
                    <div
                        className={styles.fromCssCaption}
                        style={{ width: `${boxSize.width}px`, height: `${boxSize.height}px` }}
                    >
                        SVG
                    </div>
                )}
            />
        </div>
    );
};
