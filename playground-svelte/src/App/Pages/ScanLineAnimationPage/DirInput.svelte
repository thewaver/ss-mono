<script lang="ts">
    import { SliceAnimationBreakpoints } from "@thewaver/ss-components-svelte";
    import type { SliceAnimationBreakpointDirection } from "@thewaver/ss-components-svelte";

    import PageSelectField from "../../PageComponents/Field/PageSelectField.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import { ScanlineAnimationKnobs } from "@thewaver/ss-playground/App/Knobs/ScanlineAnimations.const";

    let props: {
        value: SliceAnimationBreakpointDirection;
        setter: (value: SliceAnimationBreakpointDirection) => void;
    } = $props();
</script>

<PageProp
    itemKey={"direction"}
    {...ScanlineAnimationKnobs.DIRECTION_TEXT}
>
    <PageSelectField
        value={props.value}
        values={SliceAnimationBreakpoints.DIRECTIONS}
        ariaLabel={"Direction"}
        onChange={props.setter}
    />
</PageProp>
