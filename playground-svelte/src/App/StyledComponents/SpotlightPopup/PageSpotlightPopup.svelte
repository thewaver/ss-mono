<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/SpotlightPopup/SpotlightPopup.css";

    import PageLayer from "../../PageComponents/Layer/Layer.svelte";
    import { getNextLayerClass } from "../Layer/Layer.context";
    import type { SpotlightPopupProps } from "./SpotlightPopupSvelte.types";

    let props: SpotlightPopupProps & { children?: Snippet } = $props();

    const getLayerClassName = getNextLayerClass();
</script>

<div
    class={[styles.spotlightPopup, getLayerClassName()]}
    style:opacity={props.visibilityTarget}
    style:transition={`opacity ${props.transitionDurationMs}ms`}
>
    <div class={styles.spotlightPopupTitle}>{props.title}</div>
    <PageLayer>{@render props.children?.()}</PageLayer>
</div>
