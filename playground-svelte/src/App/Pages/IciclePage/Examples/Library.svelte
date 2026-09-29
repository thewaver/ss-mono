<script lang="ts">
    import { Icicle, TreemapUtils } from "@thewaver/ss-components-svelte";
    import type { IcicleNode } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/IciclePage/IciclePage.css";
    import { LIBRARY, formatLines } from "@thewaver/ss-playground/App/Pages/TreemapPage/TreemapPage.const";
    import { PAGE_ICICLE_FAMILIES } from "@thewaver/ss-playground/App/StyledComponents/IcicleContent/IcicleContent.css";

    import PageIcicleCell from "../../../StyledComponents/IcicleContent/IcicleContent.svelte";
    import type { IcicleExampleProps } from "../IciclePage.types";

    const TOP_LEVEL = 1;

    type Props = IcicleExampleProps;

    let { focus = $bindable(), ...props }: Props = $props();

    const getFamily = (node: IcicleNode<string>) => {
        const topLevel = TreemapUtils.findPath(LIBRARY, node)?.[TOP_LEVEL];

        if (!topLevel) return undefined;

        return PAGE_ICICLE_FAMILIES[
            Math.max(0, LIBRARY.children?.indexOf(topLevel) ?? 0) % PAGE_ICICLE_FAMILIES.length
        ];
    };

    const getTitle = (node: IcicleNode<string>, weight: number) =>
        `${(TreemapUtils.findPath(LIBRARY, node) ?? [node]).map((step) => step.value).join("/")}\n${formatLines(weight)}`;
</script>

<div class={styles.frame}>
    <Icicle
        root={LIBRARY}
        bind:focus
        columnCount={props.columnCount}
        zoomDurationMs={props.zoomDurationMs}
        ariaLabel={"The library's source, by lines of code"}
    >
        {#snippet renderCell(node, state)}
            <PageIcicleCell
                {state}
                family={getFamily(node)}
                name={node.value}
                weight={formatLines(state.weight)}
                title={getTitle(node, state.weight)}
            />
        {/snippet}
    </Icicle>
</div>
