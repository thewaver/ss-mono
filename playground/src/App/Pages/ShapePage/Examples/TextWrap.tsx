import { Shape, access } from "@thewaver/ss-components";
import { ShapeConst } from "@thewaver/ss-utils";

import { computeNoSampleDefs } from "../../../PageComponents/SampleGroups/SampleGroups.const";
import type { ShapeExampleProps } from "../ShapePage.types";

import * as styles from "../ShapePage.css";

const FLOAT_SIZE = 200;

const WRAPPED_TEXT = [
    "A floated Shape carries its own outline as its float area, so the lines of this paragraph run up to the",
    "edge that is painted rather than to the square box around it. Pick another shape, or round its corners,",
    "and the text follows, because the outline it wraps against is the same one the fill and the stroke are",
    "drawn from. Nothing here measures the shape or writes a polygon by hand: the page floats the element and",
    "sets how far the text keeps clear of it, and that is all. The rest of this paragraph is only here to be",
    "long enough to wrap all the way around, down past the bottom of the shape and back to the full width of",
    "the column, which is where you can see that the float ends where the outline does.",
].join(" ");

type Props = ShapeExampleProps;

export const TextWrapExample = (props: Props) => (
    <div class={styles.wrapText}>
        <Shape
            joinRadii={props.joinRadii}
            lameExponents={props.lameExponents}
            computePoints={(size) => ShapeConst.getDefaultShapePoints(access(props.shapeKind), size)}
            computeFillDefs={() => computeNoSampleDefs(access(props.colors), "fill")}
            renderChildren={() => <div style={{ width: `${FLOAT_SIZE}px`, height: `${FLOAT_SIZE}px` }} />}
        />
        {WRAPPED_TEXT}
    </div>
);
