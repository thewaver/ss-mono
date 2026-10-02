import { useId } from "react";

import { PaintedText } from "@thewaver/ss-components-react";

import { computeSampleDefs } from "../PaintedTextPage.const";
import type { PaintedTextExampleProps } from "../PaintedTextPage.types";

type Props = PaintedTextExampleProps & {
    fontSize: number;
    lineHeight: number;
    fontWeight: number;
};

export const HeadingExample = (props: Props) => {
    const id = useId();

    return (
        <PaintedText
            computeFillDefs={(size, element) => computeSampleDefs(props, "fill", id, size, element)}
            computeStrokeDefs={(size, element) => computeSampleDefs(props, "stroke", id, size, element)}
            strokeWidth={props.strokeWidth}
            strokeAlignment={props.strokeAlignment}
        >
            <div
                style={{ fontSize: `${props.fontSize}px`, lineHeight: props.lineHeight, fontWeight: props.fontWeight }}
            >
                Painted text
            </div>
        </PaintedText>
    );
};
