<script lang="ts">
    import { SliceAnimationBreakpoints } from "@thewaver/ss-components-svelte";
    import type { SliceAnimationBreakpointDirection } from "@thewaver/ss-components-svelte";

    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";

    let props: {
        value: SliceAnimationBreakpointDirection;
        setter: (value: SliceAnimationBreakpointDirection) => void;
    } = $props();
</script>

<PageProp
    itemKey={"direction"}
    controls={"Sets SliceAnimationBreakpointOpts.dir"}
    label={"Direction"}
    hint={"Which way the sweep travels through the lines, and so which lines go first."}
>
    <PageSelectField
        value={props.value}
        values={SliceAnimationBreakpoints.DIRECTIONS}
        ariaLabel={"Direction"}
        onChange={props.setter}
    />
</PageProp>
