<svelte:options namespace="svg" />

<script lang="ts">
    import type { SVGPatternTrackedRectCellProps } from "./SVGPatternsSvelte.types.js";

    let props: SVGPatternTrackedRectCellProps = $props();
</script>

<rect id={props.id} width={props.width} height={props.height} fill={props.fill} fill-opacity={props.fillOpacity} />
