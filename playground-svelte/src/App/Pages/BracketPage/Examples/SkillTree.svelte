<script lang="ts">
    import { Bracket } from "@thewaver/ss-components-svelte";
    import type { BracketNode } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/BracketPage/BracketPage.css";

    import { branch, seed } from "../BracketPage.const";
    import type { BracketExampleProps } from "../BracketPage.types";
    import PageBracketLayerHeader from "../PageBracketLayerHeader.svelte";
    import PageBracketNode from "../PageBracketNode.svelte";

    const NODE_SIZE = { width: 80, height: 36 };
    const TIER_NAMES = ["Tier 4", "Tier 3", "Tier 2", "Tier 1"];
    const ACROSS_HEADER_SIZE = 24;
    const DOWN_HEADER_SIZE = 56;

    const SKILLS: BracketNode<string> = branch(
        "Adept",
        branch("Fire", branch("Ember", seed("Spark"))),
        branch("Frost", seed("Chill"), { value: "Blizzard", isDisabled: true }),
    );

    type Props = BracketExampleProps;

    let props: Props = $props();
</script>

<div class={styles.board}>
    <Bracket
        root={SKILLS}
        nodeSize={NODE_SIZE}
        layerGap={props.layerGap}
        crossGap={props.crossGap}
        orientation={props.orientation}
        rootSide={props.rootSide}
        layerHeaderSize={props.orientation === "horizontal" ? ACROSS_HEADER_SIZE : DOWN_HEADER_SIZE}
        ariaLabel={"Skills and what they unlock"}
        onActivate={props.onActivate}
        renderConnector={props.renderConnector}
    >
        {#snippet renderNode(node, state)}
            <PageBracketNode {node} {state} />
        {/snippet}

        {#snippet renderLayerHeader(layer)}
            <PageBracketLayerHeader names={TIER_NAMES} {layer} />
        {/snippet}
    </Bracket>
</div>
