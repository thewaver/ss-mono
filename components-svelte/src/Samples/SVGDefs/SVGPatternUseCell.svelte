<svelte:options namespace="svg" />

<script lang="ts">
    import type { SVGPatternUseCellProps } from "./SVGPatternsSvelte.types.js";

    let props: SVGPatternUseCellProps = $props();
</script>

<use id={props.id} href={props.href} fill={props.fill}>
    <animate attributeName="fill-opacity" values={props.values} dur={props.dur} repeatCount="indefinite" />
</use>
