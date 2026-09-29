<svelte:options namespace="svg" />

<script lang="ts">
    import { SVGPatternDefsUtils } from "@thewaver/ss-components";

    import Markup from "../../../Utils/Markup.svelte";
    import type { SVGPatternProps } from "./SVGPatternDefsSvelte.types.js";

    let props: SVGPatternProps = $props();

    const cells = $derived(SVGPatternDefsUtils.computeCells(props.id, props.cellCount, props.computeCellPos));
</script>

<pattern id={props.id} width={props.patternSize.width} height={props.patternSize.height} patternUnits="userSpaceOnUse">
    {#each cells as cell (cell.id)}
        <g transform={cell.transform}>
            <Markup markup={props.renderCell(cell.id, cell.index, props.cellCount)} />
        </g>
    {/each}
</pattern>
