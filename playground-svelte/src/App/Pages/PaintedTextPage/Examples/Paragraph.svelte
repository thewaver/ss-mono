<script lang="ts">
    import { PaintedText } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/PaintedTextPage/PaintedTextPage.css";
    import knight from "@thewaver/ss-playground/App/knight.webp";
    import testFile from "@thewaver/ss-playground/App/test.svg?raw";

    import { computeSampleDefs } from "../PaintedTextPage.const";
    import type { PaintedTextExampleProps } from "../PaintedTextPage.types";

    const TEST_ICON = testFile.slice(testFile.indexOf("<svg"));

    let props: PaintedTextExampleProps = $props();

    const id = $props.id();
</script>

<div class={styles.paragraph}>
    <PaintedText
        computeFillDefs={(size, element) => computeSampleDefs(props, "fill", id, size, element)}
        computeStrokeDefs={(size, element) => computeSampleDefs(props, "stroke", id, size, element)}
        strokeWidth={props.strokeWidth}
        strokeAlignment={props.strokeAlignment}
    >
        One paint runs across <b>every line</b> of a paragraph that <i>wraps like ordinary text</i>, with a
        <a href="https://developer.mozilla.org/en-US/docs/Web/SVG/Element/text">link</a>, an image
        <img class={styles.image} src={knight} alt="Sir Face" /> and an icon
        <span class={styles.icon}>{@html TEST_ICON}</span> carried along.
        <br />
        <br />A line break starts a new paragraph.
    </PaintedText>
</div>
