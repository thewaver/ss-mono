<script lang="ts">
    import { BracketKnobs } from "@thewaver/ss-playground/App/Knobs/Brackets.const";

    import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import type { BracketFamilyExampleProps } from "./BracketPage.types";
    import FamilyExample from "./Examples/Family.svelte";

    let props: Omit<BracketFamilyExampleProps, "isSnappingToFamily"> = $props();

    let isSnapping = $state(BracketKnobs.STARTING_IS_SNAPPING_TO_FAMILY);
</script>

<FamilyExample {...props} isSnappingToFamily={isSnapping} />

<PageExampleKnobs>
    <PageProp
        itemKey={"isSnappingToFamily"}
        label={"Snap to family"}
        hint={"Glides the window to frame the family in it once a drag, a pinch or the wheel is over."}
        controls={"Sets BracketProps.isSnappingToFamily"}
    >
        <PageCheckField
            value={isSnapping}
            ariaLabel={"Snap to family"}
            onChange={(value) => {
                isSnapping = value;
            }}
        />
    </PageProp>
</PageExampleKnobs>
