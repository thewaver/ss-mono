<script lang="ts">
    import { Bracket, Button } from "@thewaver/ss-components-svelte";
    import type { BracketNode } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/BracketPage/BracketPage.css";

    import PageBeam from "../../../StyledComponents/Beam/PageBeam.svelte";
    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import { BEAM_PATHS, branch, seed } from "../BracketPage.const";
    import type { BracketBeamsExampleProps } from "../BracketPage.types";
    import PageBracketNode from "../PageBracketNode.svelte";

    const NODE_SIZE = { width: 96, height: 34 };

    const DRAW: BracketNode<string> = branch(
        "Final",
        branch("Semi 1", branch("Quarter 1", seed("Ada"), seed("Bo")), branch("Quarter 2", seed("Cai"), seed("Dee"))),
        branch("Semi 2", branch("Quarter 3", seed("Eli"), seed("Fay")), branch("Quarter 4", seed("Gus"), seed("Hal"))),
    );

    type Props = BracketBeamsExampleProps;

    let props: Props = $props();

    let isPlaying = $state(true);
</script>

<div class={styles.beamStage}>
    <div class={styles.board}>
        <Bracket
            root={DRAW}
            nodeSize={NODE_SIZE}
            layerGap={props.layerGap}
            crossGap={props.crossGap}
            orientation={props.orientation}
            rootSide={props.rootSide}
            ariaLabel={"Draw with a beam to the final"}
            onActivate={props.onActivate}
        >
            {#snippet renderConnector(defs)}
                {@render props.renderConnector(defs)}

                {#if defs.isOnFocusedRoute}
                    <PageBeam
                        d={BEAM_PATHS[props.connector](defs, props.connectorRadius)}
                        direction={"backward"}
                        {isPlaying}
                    />
                {/if}
            {/snippet}

            {#snippet renderNode(node, state)}
                <PageBracketNode {node} {state} />
            {/snippet}
        </Bracket>
    </div>

    <Button
        id={"bracketBeamsPlayback"}
        onClick={() => {
            isPlaying = !isPlaying;
        }}
    >
        {#snippet renderContent(flags)}
            <PageButtonContent {flags}>{isPlaying ? "Pause" : "Play"}</PageButtonContent>
        {/snippet}
    </Button>
</div>
