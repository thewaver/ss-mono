<script lang="ts">
    import { CirclePacking, TreemapUtils } from "@thewaver/ss-components-svelte";
    import type { CirclePackingNode } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/CirclePackingPage/CirclePackingPage.css";
    import { LIBRARY, formatLines } from "@thewaver/ss-playground/App/Pages/TreemapPage/TreemapPage.const";

    import PageCirclePackingCircle from "../../../StyledComponents/CirclePackingContent/PageCirclePackingCircle.svelte";
    import PageCirclePackingFrame from "../../../StyledComponents/CirclePackingContent/PageCirclePackingFrame.svelte";
    import PageCirclePackingLabel from "../../../StyledComponents/CirclePackingContent/PageCirclePackingLabel.svelte";
    import type { CirclePackingExampleProps } from "../CirclePackingPage.types";

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
            ariaLabel={"The library's source, by lines of code"}
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
