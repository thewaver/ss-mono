<svelte:options namespace="svg" />

<script lang="ts">
    import type { Snippet } from "svelte";

    import type { Rect } from "@thewaver/ss-utils";

    import { setPaintAreaContext } from "./PaintArea.context.js";

    let props: { getPaintArea: () => Rect | undefined; children: Snippet } = $props();

    setPaintAreaContext({ getPaintArea: () => props.getPaintArea() });
</script>

{@render props.children()}
