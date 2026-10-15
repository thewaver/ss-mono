<svelte:options namespace="svg" />

<script lang="ts">
    import type { SVGPatternUseCellProps } from "./SVGPatternsSvelte.types.js";

    let props: SVGPatternUseCellProps = $props();
</script>

<use id={props.id} href={props.href} fill={props.fill}>
    {#key props.animate.getKey()}
        <animate attributeName="fill-opacity" values={props.values} {...props.animate.getAttributes()} />
    {/key}
</use>
