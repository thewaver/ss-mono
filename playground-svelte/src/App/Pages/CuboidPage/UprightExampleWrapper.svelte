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
        label={"Stays upright"}
        hint={
            "Every press turns the box a quarter turn about the screen's own axis, as you see it, and the face it lands on is then spun until it reads the right way up. Off, the box goes back to reading the two counts as a pose, where the far side shows upside down once it has been tipped over the top."
        }
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
        label={"Draggable"}
        hint={
            "Lets the box be turned by dragging it. It follows the pointer, and on release settles on the nearest face, writing the turns to the same two counts the buttons do."
        }
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
