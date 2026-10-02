import { createUniqueId } from "solid-js";

import { PaintedText } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/PaintedTextPage/PaintedTextPage.css";
import knight from "@thewaver/ss-playground/App/knight.webp";
import testFile from "@thewaver/ss-playground/App/test.svg?raw";

import { computeSampleDefs } from "../PaintedTextPage.const";
import type { PaintedTextExampleProps } from "../PaintedTextPage.types";

const TEST_ICON = testFile.slice(testFile.indexOf("<svg"));

export const ParagraphExample = (props: PaintedTextExampleProps) => {
    const id = createUniqueId();

    return (
        <div class={styles.paragraph}>
            <PaintedText
                computeFillDefs={(getSize, getRef) => computeSampleDefs(props, "fill", id, getSize, getRef)}
                computeStrokeDefs={(getSize, getRef) => computeSampleDefs(props, "stroke", id, getSize, getRef)}
                strokeWidth={props.strokeWidth}
                strokeAlignment={props.strokeAlignment}
            >
                One paint runs across <b>every line</b> of a paragraph that <i>wraps like ordinary text</i>, with a{" "}
                <a href="https://developer.mozilla.org/en-US/docs/Web/SVG/Element/text">link</a>, an image{" "}
                <img class={styles.image} src={knight} alt="Sir Face" /> and an icon{" "}
                <span class={styles.icon} innerHTML={TEST_ICON} /> carried along.
                <br />
                <br />A line break starts a new paragraph.
            </PaintedText>
        </div>
    );
};
