import { useId } from "react";

import { PaintedText } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/PaintedTextPage/PaintedTextPage.css";

import { computeSampleDefs } from "../PaintedTextPage.const";
import type { PaintedTextExampleProps } from "../PaintedTextPage.types";

type Props = PaintedTextExampleProps & {
    text: string;
};

export const CustomInputExample = (props: Props) => {
    const id = useId();

    return (
        <div className={styles.paragraph}>
            <PaintedText
                computeFillDefs={(size, element) => computeSampleDefs(props, "fill", id, size, element)}
                computeStrokeDefs={(size, element) => computeSampleDefs(props, "stroke", id, size, element)}
                strokeWidth={props.strokeWidth}
                strokeAlignment={props.strokeAlignment}
            >
                {props.text}
            </PaintedText>
        </div>
    );
};
