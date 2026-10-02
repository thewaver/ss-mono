<script lang="ts">
    import { PaintedText } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/PaintedTextPage/PaintedTextPage.css";

    import { computeSampleDefs } from "../PaintedTextPage.const";
    import type { PaintedTextExampleProps } from "../PaintedTextPage.types";

    type Props = PaintedTextExampleProps & {
        text: string;
    };

    let props: Props = $props();

    const id = $props.id();
</script>

<div class={styles.paragraph}>
    <PaintedText
        computeFillDefs={(size, element) => computeSampleDefs(props, "fill", id, size, element)}
        computeStrokeDefs={(size, element) => computeSampleDefs(props, "stroke", id, size, element)}
        strokeWidth={props.strokeWidth}
        strokeAlignment={props.strokeAlignment}>{props.text}</PaintedText
    >
</div>
