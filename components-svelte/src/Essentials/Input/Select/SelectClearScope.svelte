<script lang="ts">
    import type { Snippet } from "svelte";

    import { UNLABELED_CONTEXT } from "@thewaver/ss-components";

    import { setLabelContext } from "../Label/Label.context.js";

    let props: { children: Snippet } = $props();

    setLabelContext(UNLABELED_CONTEXT);
</script>

{@render props.children()}
