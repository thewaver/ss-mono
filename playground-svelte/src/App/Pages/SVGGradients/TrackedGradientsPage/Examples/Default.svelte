<script lang="ts">
    import type { TrackedGradientExampleProps } from "../../SVGGradients.types";
    import TrackedShape from "./TrackedShape.svelte";

    let props: TrackedGradientExampleProps = $props();
</script>

<TrackedShape {...props} />
