<script lang="ts">
    import { CellAnimationBreakpoints } from "@thewaver/ss-components-svelte";
    import type { CellAnimationBreakpointDirection } from "@thewaver/ss-components-svelte";

    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";

    let props: {
        value: CellAnimationBreakpointDirection;
        setter: (value: CellAnimationBreakpointDirection) => void;
    } = $props();
</script>

<PageProp
    itemKey={"direction"}
    label={"Direction"}
    hint={"Which way the sweep travels through the lines, and so which lines go first."}
>
    <PageSelectField
        value={props.value}
        values={CellAnimationBreakpoints.DIRECTIONS}
        ariaLabel={"Direction"}
        onChange={props.setter}
    />
</PageProp>
