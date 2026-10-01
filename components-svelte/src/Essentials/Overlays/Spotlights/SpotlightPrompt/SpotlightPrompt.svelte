<script lang="ts">
    import Spotlight from "../../../../Primitives/Spotlight/Spotlight.svelte";
    import type { SpotlightPromptProps } from "../../../../Primitives/Spotlight/Spotlight.types.js";

    let { visibility = $bindable(), ...props }: SpotlightPromptProps = $props();
</script>

<Spotlight {...props} bind:visibility mode="prompt" />
