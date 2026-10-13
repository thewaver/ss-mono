<script lang="ts">
    import type { TrackedGradientExampleProps } from "../../SVGGradientsSvelte.types";
    import TrackedShape from "./TrackedShape.svelte";

    let props: TrackedGradientExampleProps = $props();
</script>

<TrackedShape {...props} />
