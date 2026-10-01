<script lang="ts">
    import Spotlight from "../../../../Primitives/Spotlight/Spotlight.svelte";
    import type { SpotlightHintProps } from "../../../../Primitives/Spotlight/Spotlight.types.js";

    let { visibility = $bindable(), ...props }: SpotlightHintProps = $props();
</script>

<Spotlight {...props} bind:visibility mode="hint" />
