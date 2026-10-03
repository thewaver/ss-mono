<svelte:options namespace="svg" />

<script lang="ts">
    import type { SVGPatternTrackedCircleCellProps } from "./SVGPatternsSvelte.types.js";

    let props: SVGPatternTrackedCircleCellProps = $props();
</script>

<circle id={props.id} r={props.r} cx={props.cx} cy={props.cy} fill={props.fill} />
