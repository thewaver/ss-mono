<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/HoverCardContent/HoverCardContent.css";

    import PageLayer from "../../PageComponents/Layer/Layer.svelte";
    import type { HoverCardContentProps } from "./HoverCardContent.types";

    let props: HoverCardContentProps & { children?: Snippet } = $props();
</script>

<div
    class={[styles.hoverCardContent, props.visibilityTarget === 1 && styles.isVisible]}
    style:transition={`opacity ${props.transitionDurationMs}ms`}
>
    <PageLayer level={2}>{@render props.children?.()}</PageLayer>
</div>
