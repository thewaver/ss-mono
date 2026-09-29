<script lang="ts">
    import { Bracket } from "@thewaver/ss-components-svelte";
    import type { BracketNode } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/BracketPage/BracketPage.css";

    import { branch, seed } from "../BracketPage.const";
    import type { BracketExampleProps } from "../BracketPage.types";
    import PageBracketLayerHeader from "../PageBracketLayerHeader.svelte";
    import PageBracketNode from "../PageBracketNode.svelte";

    const NODE_SIZE = { width: 96, height: 34 };
    const ROUND_NAMES = ["Final", "Semifinals", "Quarterfinals", "Entrants"];
    const ACROSS_HEADER_SIZE = 24;
    const DOWN_HEADER_SIZE = 96;

    const DRAW: BracketNode<string> = branch(
        "Final",
        branch("Semi 1", branch("Quarter 1", seed("Ada"), seed("Bo")), branch("Quarter 2", seed("Cai"), seed("Dee"))),
        branch(
            "Semi 2",
            branch("Quarter 3", seed("Eli"), seed("Fay")),
            branch("Quarter 4", seed("Gus"), { value: "Withdrawn", isDisabled: true }),
        ),
    );

    type Props = BracketExampleProps;

    let props: Props = $props();
</script>

<div class={styles.board}>
    <Bracket
        root={DRAW}
        nodeSize={NODE_SIZE}
        layerGap={props.layerGap}
        crossGap={props.crossGap}
        orientation={props.orientation}
        rootSide={props.rootSide}
        layerHeaderSize={props.orientation === "horizontal" ? ACROSS_HEADER_SIZE : DOWN_HEADER_SIZE}
        ariaLabel={"Knockout draw"}
        onActivate={props.onActivate}
        renderConnector={props.renderConnector}
    >
        {#snippet renderNode(node, state)}
            <PageBracketNode {node} {state} />
        {/snippet}

        {#snippet renderLayerHeader(layer)}
            <PageBracketLayerHeader names={ROUND_NAMES} {layer} />
        {/snippet}
    </Bracket>
</div>
