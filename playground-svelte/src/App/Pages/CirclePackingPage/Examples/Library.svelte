<script lang="ts">
    import { CirclePacking, TreemapUtils } from "@thewaver/ss-components-svelte";
    import type { CirclePackingNode } from "@thewaver/ss-components-svelte";
    import { LIBRARY } from "@thewaver/ss-playground/App/LibraryTree.generated";
    import { formatLines } from "@thewaver/ss-playground/App/LibraryTree.utils";
    import * as styles from "@thewaver/ss-playground/App/Pages/CirclePackingPage/CirclePackingPage.css";

    import PageCirclePackingCircle from "../../../StyledComponents/CirclePackingContent/PageCirclePackingCircle.svelte";
    import PageCirclePackingFrame from "../../../StyledComponents/CirclePackingContent/PageCirclePackingFrame.svelte";
    import PageCirclePackingLabel from "../../../StyledComponents/CirclePackingContent/PageCirclePackingLabel.svelte";
    import type { CirclePackingExampleProps } from "../CirclePackingPage.types";
    import { LIBRARY_S_SOURCE_LINES_LABEL } from "@thewaver/ss-playground/App/Pages/CirclePackingPage/CirclePackingPage.const";

    type Props = CirclePackingExampleProps;

    const getTitle = (node: CirclePackingNode<string>, weight: number) =>
        `${(TreemapUtils.findPath(LIBRARY, node) ?? [node]).map((step) => step.value).join("/")}\n${formatLines(weight)}`;

    let { branch = $bindable(), ...props }: Props = $props();
</script>

<div class={styles.frame}>
    <PageCirclePackingFrame>
        <CirclePacking
            root={LIBRARY}
            bind:branch
            padding={props.padding}
            zoomDurationMs={props.zoomDurationMs}
            ariaLabel={LIBRARY_S_SOURCE_LINES_LABEL}
        >
            {#snippet renderCircle(node, state)}
                <PageCirclePackingCircle {state} title={getTitle(node, state.weight)} />
            {/snippet}

            {#snippet renderLabel(node, state)}
                <PageCirclePackingLabel {state} name={node.value} />
            {/snippet}
        </CirclePacking>
    </PageCirclePackingFrame>
</div>
