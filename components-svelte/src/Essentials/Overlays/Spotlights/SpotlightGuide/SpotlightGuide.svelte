<script lang="ts">
    import Spotlight from "../../../../Primitives/Spotlight/Spotlight.svelte";
    import type { SpotlightGuideProps } from "../../../../Primitives/Spotlight/Spotlight.types.js";

    let { visibility = $bindable(), ...props }: SpotlightGuideProps = $props();
</script>

<Spotlight {...props} bind:visibility mode="guide" />
