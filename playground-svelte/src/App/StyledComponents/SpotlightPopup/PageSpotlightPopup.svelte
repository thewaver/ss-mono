<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/SpotlightPopup/SpotlightPopup.css";

    import PageLayer from "../../PageComponents/Layer/Layer.svelte";
    import type { SpotlightPopupProps } from "./SpotlightPopup.types";

    let props: SpotlightPopupProps & { children?: Snippet } = $props();
</script>

<div
    class={styles.spotlightPopup}
    style:opacity={props.visibilityTarget}
    style:transition={`opacity ${props.transitionDurationMs}ms`}
>
    <div class={styles.spotlightPopupTitle}>{props.title}</div>
    <PageLayer level={2}>{@render props.children?.()}</PageLayer>
</div>
