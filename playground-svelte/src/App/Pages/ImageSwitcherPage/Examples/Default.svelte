<script lang="ts">
    import { ImageSwitcher } from "@thewaver/ss-components-svelte";
    import type { ImageSwitcherProps } from "@thewaver/ss-components-svelte";

    let props: ImageSwitcherProps = $props();
</script>

<ImageSwitcher
    src={props.src}
    alt={props.alt}
    transitionDurationMs={props.transitionDurationMs}
    onLoad={props.onLoad}
/>
