<script lang="ts">
    import { Formation, PlacementLayoutUtils, ProximityEffectUtils } from "@thewaver/ss-components-svelte";

    import PageFormationItem from "../../../StyledComponents/FormationContent/FormationContent.svelte";
    import type { FormationExampleProps } from "../FormationPage.types";

    type Props = FormationExampleProps;

    let { layoutEntry, effectEntry, shapeKind, ...otherProps }: Props = $props();

    const computeLayout = $derived(PlacementLayoutUtils.toLayoutFn(layoutEntry));

    const computeEffect = $derived(
        effectEntry === undefined ? undefined : ProximityEffectUtils.toEffectFn(effectEntry),
    );
</script>

<Formation {...otherProps} {computeLayout} {computeEffect}>
    {#snippet renderItem(item, state)}
        <PageFormationItem {state} {shapeKind}>
            {item}
        </PageFormationItem>
    {/snippet}
</Formation>
