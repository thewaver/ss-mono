<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/ModalPanel/ModalPanel.css";

    import type { ModalHintProps } from "./ModalPanel.types";

    let props: ModalHintProps & { children?: Snippet } = $props();
</script>

<div id={props.id} class={styles.modalHint}>
    {@render props.children?.()}
</div>
