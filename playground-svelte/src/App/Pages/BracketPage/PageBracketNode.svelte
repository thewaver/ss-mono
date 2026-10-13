<script lang="ts">
    import type { BracketNode, BracketNodeState } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/BracketPage/BracketPage.css";
    import { ROOT_LAYER } from "@thewaver/ss-playground/App/Pages/BracketPage/BracketPage.const";

    let props: { node: BracketNode<string>; state: BracketNodeState } = $props();
</script>

<div
    class={[
        styles.node,
        props.state.isOnFocusedRoute && styles.nodeOnRoute,
        props.state.placement.layer === ROOT_LAYER && styles.nodeRoot,
        props.state.placement.isDisabled && styles.nodeDisabled,
    ]}
>
    {props.node.value}
</div>
