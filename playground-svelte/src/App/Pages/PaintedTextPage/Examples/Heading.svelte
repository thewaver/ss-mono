<script lang="ts">
    import { PaintedText } from "@thewaver/ss-components-svelte";

    import { computeSampleDefs } from "../PaintedTextPage.const";
    import type { PaintedTextExampleProps } from "../PaintedTextPage.types";

    type Props = PaintedTextExampleProps & {
        fontSize: number;
        lineHeight: number;
        fontWeight: number;
    };

    let props: Props = $props();

    const id = $props.id();
</script>

<PaintedText
    computeFillDefs={(size, element) => computeSampleDefs(props, "fill", id, size, element)}
    computeStrokeDefs={(size, element) => computeSampleDefs(props, "stroke", id, size, element)}
    strokeWidth={props.strokeWidth}
    strokeAlignment={props.strokeAlignment}
>
    <div
        style:font-size={`${props.fontSize}px`}
        style:line-height={props.lineHeight}
        style:font-weight={props.fontWeight}
    >
        Painted text
    </div>
</PaintedText>
