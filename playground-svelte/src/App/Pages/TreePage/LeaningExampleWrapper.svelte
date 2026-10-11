<script lang="ts">
    import { TreeKnobs } from "@thewaver/ss-playground/App/Knobs/Trees.const";

    import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import LeaningExample from "./Examples/Leaning.svelte";
    import type { TreeExampleProps } from "./TreePage.types";

    let { value = $bindable(), expanded = $bindable() }: TreeExampleProps = $props();

    let falloff = $state(TreeKnobs.STARTING_FALLOFF);
</script>

<LeaningExample bind:value bind:expanded {falloff} />

<PageExampleKnobs>
    <PageProp
        itemKey={"falloff"}
        label={"Falloff"}
        hint={"How the lean fades with distance from the pointer: smoothly, in a straight line, or sharply, so only the nearest items move."}
    >
        <PageSelectField
            value={falloff}
            values={TreeKnobs.FALLOFFS}
            ariaLabel={"Falloff"}
            onChange={(next) => {
                falloff = next;
            }}
        />
    </PageProp>
</PageExampleKnobs>
