<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/HoverCardContent/HoverCardContent.css";

    import PageLayer from "../../PageComponents/Layer/Layer.svelte";
    import { getNextLayerClass } from "../Layer/Layer.context";
    import type { HoverCardContentProps } from "./HoverCardContentSvelte.types";

    let props: HoverCardContentProps & { children?: Snippet } = $props();

    const getNextLayerClassName = getNextLayerClass();
</script>

<div
    class={[styles.hoverCardContent, getNextLayerClassName(), props.visibilityTarget === 1 && styles.isVisible]}
    style:transition={`opacity ${props.transitionDurationMs}ms`}
>
    <PageLayer>{@render props.children?.()}</PageLayer>
</div>
