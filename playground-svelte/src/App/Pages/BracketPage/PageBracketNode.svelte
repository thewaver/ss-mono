<script lang="ts">
    import type { BracketNode, BracketNodeState } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/BracketPage/BracketPage.css";

    const ROOT_LAYER = 0;

    let props: { node: BracketNode<string>; state: BracketNodeState } = $props();
</script>

<div
    class={[
        styles.node,
        props.state.isFocused && styles.nodeFocused,
        props.state.isOnFocusedRoute && styles.nodeOnRoute,
        props.state.placement.layer === ROOT_LAYER && styles.nodeRoot,
        props.state.placement.isDisabled && styles.nodeDisabled,
    ]}
>
    {props.node.value}
</div>
