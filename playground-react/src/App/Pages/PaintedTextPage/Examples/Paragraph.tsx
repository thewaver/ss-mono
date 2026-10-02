import { useId } from "react";

import { PaintedText } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/PaintedTextPage/PaintedTextPage.css";
import knight from "@thewaver/ss-playground/App/knight.webp";
import testFile from "@thewaver/ss-playground/App/test.svg?raw";

import { computeSampleDefs } from "../PaintedTextPage.const";
import type { PaintedTextExampleProps } from "../PaintedTextPage.types";

const TEST_ICON = testFile.slice(testFile.indexOf("<svg"));

export const ParagraphExample = (props: PaintedTextExampleProps) => {
    const id = useId();

    return (
        <div className={styles.paragraph}>
            <PaintedText
                computeFillDefs={(size, element) => computeSampleDefs(props, "fill", id, size, element)}
                computeStrokeDefs={(size, element) => computeSampleDefs(props, "stroke", id, size, element)}
                strokeWidth={props.strokeWidth}
                strokeAlignment={props.strokeAlignment}
            >
                One paint runs across <b>every line</b> of a paragraph that <i>wraps like ordinary text</i>, with a{" "}
                <a href="https://developer.mozilla.org/en-US/docs/Web/SVG/Element/text">link</a>, an image{" "}
                <img className={styles.image} src={knight} alt="Sir Face" /> and an icon{" "}
                <span className={styles.icon} dangerouslySetInnerHTML={{ __html: TEST_ICON }} /> carried along.
                <br />
                <br />A line break starts a new paragraph.
            </PaintedText>
        </div>
    );
};
