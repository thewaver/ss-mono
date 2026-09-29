<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/SpotlightPopup/SpotlightPopup.css";

    let props: { children?: Snippet } = $props();
</script>

<div class={styles.spotlightPopupText}>{@render props.children?.()}</div>
