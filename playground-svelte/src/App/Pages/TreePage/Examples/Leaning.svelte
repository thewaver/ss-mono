<script lang="ts">
    import { PlacementLayoutUtils, ProximityUtils, Tree } from "@thewaver/ss-components-svelte";
    import type { ProximityEffectFn } from "@thewaver/ss-components-svelte";
    import type { TreeFalloff } from "@thewaver/ss-playground/App/Pages/TreePage/TreeFalloffs.types";
    import { MathUtils } from "@thewaver/ss-utils";

    import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PageTreeNodeContent from "../../../StyledComponents/TreeNodeContent/PageTreeNodeContent.svelte";
    import { FILES } from "../TreePage.const.svelte";
    import type { TreeLeaningExampleProps } from "../TreePage.types";

    const REACH_ITEMS = 2.5;
    const SHIFT_PERCENT = 8;
    const BRIGHTEN_PERCENT = 60;
    const FULL_PERCENT = 100;
    const SHARP_POWER = 3;

    const COLUMN = PlacementLayoutUtils.createColumn({ itemWidthRatio: 0.9, itemHeightRatio: 0.14, gapRatio: 0.15 });

    const toStrength = (falloff: TreeFalloff, distance: number, reach: number) => {
        const linear = MathUtils.clamp01(1 - distance / reach);

        if (falloff === "linear") return linear;
        if (falloff === "sharp") return linear ** SHARP_POWER;

        return ProximityUtils.getDistanceFalloff(distance, reach);
    };

    type Props = TreeLeaningExampleProps;

    let { value = $bindable(), expanded = $bindable(), falloff }: Props = $props();

    const computeEffect: ProximityEffectFn = (defs) => {
        const strength = toStrength(falloff, defs.distance, defs.spacing * REACH_ITEMS);

        return { translateX: strength * SHIFT_PERCENT, brightness: FULL_PERCENT + strength * BRIGHTEN_PERCENT };
    };
</script>

<Tree
    renderHighlightFloater={renderPageHighlightFloater}
    nodes={FILES}
    bind:value
    bind:expanded
    ariaLabel={"Leaning repository"}
    computeLayout={COLUMN}
    {computeEffect}
>
    {#snippet renderNode(node, renderProps)}
        <PageTreeNodeContent isGliding {renderProps}>{node.value}</PageTreeNodeContent>
    {/snippet}
</Tree>
