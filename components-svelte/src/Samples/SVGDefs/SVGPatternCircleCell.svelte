<svelte:options namespace="svg" />

<script lang="ts">
    import type { SVGPatternCircleCellProps } from "./SVGPatternsSvelte.types.js";

    let props: SVGPatternCircleCellProps = $props();
</script>

<circle id={props.id} r={props.r} cx={props.cx} cy={props.cy} fill={props.fill}>
    {#key props.animate.getKey()}
        <animate attributeName="r" values={props.values} {...props.animate.getAttributes()} />
    {/key}
</circle>
