<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/ModalPanel/ModalPanel.css";

    import PageLayer from "../../PageComponents/Layer/Layer.svelte";
    import type { ModalPanelProps } from "./ModalPanel.types";

    let props: ModalPanelProps & { children?: Snippet } = $props();
</script>

<div
    class={props.visibilityTarget === 1 ? styles.modalPanelOn : styles.modalPanelOff}
    style:transition={`transform ${props.transitionDurationMs}ms`}
    style:padding={props.padding}
>
    <PageLayer level={1}>{@render props.children?.()}</PageLayer>
</div>
