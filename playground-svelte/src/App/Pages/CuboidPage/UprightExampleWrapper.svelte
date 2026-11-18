<script lang="ts">
    import { CuboidKnobs } from "@thewaver/ss-playground/App/Knobs/Cuboids.const";

    import PageExampleKnobs from "../../PageComponents/ExampleKnobs/PageExampleKnobs.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import type { CuboidUprightExampleProps } from "./CuboidPage.types";
    import UprightExample from "./Examples/Upright.svelte";

    type Props = Omit<CuboidUprightExampleProps, "isUpright" | "isDraggable">;

    let { yaw = $bindable(), pitch = $bindable(), controller = $bindable(), ...props }: Props = $props();

    let isUpright = $state(CuboidKnobs.STARTING_IS_UPRIGHT);
    let isDraggable = $state(CuboidKnobs.STARTING_IS_DRAGGABLE);
</script>

<UprightExample {...props} bind:yaw bind:pitch bind:controller {isUpright} {isDraggable} />

<PageExampleKnobs>
    <PageProp
        itemKey={"isUpright"}
        {...CuboidKnobs.IS_UPRIGHT_TEXT}
    >
        <PageCheckField
            value={isUpright}
            ariaLabel={"Stays upright"}
            onChange={(value) => {
                isUpright = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"isDraggable"}
        {...CuboidKnobs.IS_DRAGGABLE_TEXT}
    >
        <PageCheckField
            value={isDraggable}
            ariaLabel={"Draggable"}
            onChange={(value) => {
                isDraggable = value;
            }}
        />
    </PageProp>
</PageExampleKnobs>
