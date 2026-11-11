<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/ModalPanel/ModalPanel.css";

    import PageLayer from "../../PageComponents/Layer/Layer.svelte";
    import { getNextLayerClass } from "../Layer/Layer.context";
    import type { ModalPanelProps } from "./ModalPanelSvelte.types";

    let props: ModalPanelProps & { children?: Snippet } = $props();

    const getNextLayerClassName = getNextLayerClass();
</script>

<div
    class={[props.visibilityTarget === 1 ? styles.modalPanelOn : styles.modalPanelOff, getNextLayerClassName()]}
    style:transition={`transform ${props.transitionDurationMs}ms`}
    style:padding={props.padding}
>
    <PageLayer>{@render props.children?.()}</PageLayer>
</div>
