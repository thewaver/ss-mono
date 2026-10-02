import { createUniqueId } from "solid-js";

import { PaintedText, access } from "@thewaver/ss-components-solid";
import type { AccessorProps } from "@thewaver/ss-components-solid";

import { computeSampleDefs } from "../PaintedTextPage.const";
import type { PaintedTextExampleProps } from "../PaintedTextPage.types";

type Props = PaintedTextExampleProps &
    AccessorProps<{
        fontSize: number;
        lineHeight: number;
        fontWeight: number;
    }>;

export const HeadingExample = (props: Props) => {
    const id = createUniqueId();

    return (
        <PaintedText
            computeFillDefs={(getSize, getRef) => computeSampleDefs(props, "fill", id, getSize, getRef)}
            computeStrokeDefs={(getSize, getRef) => computeSampleDefs(props, "stroke", id, getSize, getRef)}
            strokeWidth={props.strokeWidth}
            strokeAlignment={props.strokeAlignment}
        >
            <div
                style={{
                    "font-size": `${access(props.fontSize)}px`,
                    "line-height": access(props.lineHeight),
                    "font-weight": access(props.fontWeight),
                }}
            >
                Painted text
            </div>
        </PaintedText>
    );
};
