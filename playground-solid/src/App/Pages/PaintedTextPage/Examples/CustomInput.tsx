import { createUniqueId } from "solid-js";

import { PaintedText, access } from "@thewaver/ss-components-solid";
import type { AccessorProps } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/PaintedTextPage/PaintedTextPage.css";

import { computeSampleDefs } from "../PaintedTextPage.const";
import type { PaintedTextExampleProps } from "../PaintedTextPage.types";

type Props = PaintedTextExampleProps &
    AccessorProps<{
        text: string;
    }>;

export const CustomInputExample = (props: Props) => {
    const id = createUniqueId();

    return (
        <div class={styles.paragraph}>
            <PaintedText
                computeFillDefs={(getSize, getRef) => computeSampleDefs(props, "fill", id, getSize, getRef)}
                computeStrokeDefs={(getSize, getRef) => computeSampleDefs(props, "stroke", id, getSize, getRef)}
                strokeWidth={props.strokeWidth}
                strokeAlignment={props.strokeAlignment}
            >
                {access(props.text)}
            </PaintedText>
        </div>
    );
};
