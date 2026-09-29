<script lang="ts">
    import { Button, Treemap, TreemapUtils } from "@thewaver/ss-components-svelte";
    import { LIBRARY, formatLines } from "@thewaver/ss-playground/App/Pages/TreemapPage/TreemapPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/TreemapPage/TreemapPage.css";

    import PageTreemapBar from "../../../StyledComponents/TreemapContent/PageTreemapBar.svelte";
    import PageTreemapTile from "../../../StyledComponents/TreemapContent/PageTreemapTile.svelte";
    import type { TreemapExampleProps } from "../TreemapPage.types";

    const PARENT_FROM_END = 2;
    const ROOT_ONLY = 1;

    type Props = TreemapExampleProps;

    let { branch = $bindable(), ...props }: Props = $props();

    const weights = TreemapUtils.computeWeights(LIBRARY);

    const path = $derived(TreemapUtils.findPath(LIBRARY, branch) ?? [LIBRARY]);
</script>

<div class={styles.frame}>
    <Button
        id={"treemapUp"}
        sizing={"fill"}
        isDisabled={path.length <= ROOT_ONLY}
        onClick={() => {
            const parent = path[path.length - PARENT_FROM_END];

            if (parent) branch = parent;
        }}
    >
        {#snippet renderContent(flags)}
            <PageTreemapBar
                {flags}
                path={path.map((node) => node.value).join("/")}
                weight={formatLines(weights.get(branch) ?? 0)}
            />
        {/snippet}
    </Button>

    <div class={styles.chart}>
        <Treemap
            root={LIBRARY}
            bind:branch
            zoomDurationMs={props.zoomDurationMs}
            ariaLabel={"The library's source, by lines of code"}
        >
            {#snippet renderTile(node, state)}
                <PageTreemapTile name={node.value} weight={formatLines(state.weight)} isBranch={state.isBranch} />
            {/snippet}
        </Treemap>
    </div>
</div>
