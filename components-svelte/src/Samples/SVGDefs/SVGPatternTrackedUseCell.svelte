<svelte:options namespace="svg" />

<script lang="ts">
    import type { SVGPatternTrackedUseCellProps } from "./SVGPatternsSvelte.types.js";

    let props: SVGPatternTrackedUseCellProps = $props();
</script>

<use id={props.id} href={props.href} fill={props.fill} fill-opacity={props.fillOpacity} />
