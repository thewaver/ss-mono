<script lang="ts">
    import { Bracket } from "@thewaver/ss-components-svelte";
    import type { BracketNode } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/BracketPage/BracketPage.css";

    import { branch, seed } from "../BracketPage.const";
    import type { BracketExampleProps } from "../BracketPage.types";
    import PageBracketNode from "../PageBracketNode.svelte";

    const NODE_SIZE = { width: 88, height: 40 };

    const COMPANY: BracketNode<string> = branch(
        "Founder",
        branch("Product", seed("Design"), seed("Research"), seed("Content")),
        branch("Engineering", branch("Platform", seed("Data"), seed("Infra")), seed("Clients")),
        seed("Finance"),
    );

    type Props = BracketExampleProps;

    let props: Props = $props();
</script>

<div class={styles.board}>
    <Bracket
        root={COMPANY}
        nodeSize={NODE_SIZE}
        layerGap={props.layerGap}
        crossGap={props.crossGap}
        orientation={props.orientation}
        rootSide={props.rootSide}
        ariaLabel={"Who reports to whom"}
        onActivate={props.onActivate}
        renderConnector={props.renderConnector}
    >
        {#snippet renderNode(node, state)}
            <PageBracketNode {node} {state} />
        {/snippet}
    </Bracket>
</div>
