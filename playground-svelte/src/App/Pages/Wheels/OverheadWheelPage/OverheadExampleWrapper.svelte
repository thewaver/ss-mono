<script lang="ts">
    import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.svelte";
    import type { WheelExampleProps } from "../Wheels.types";
    import OverheadExample from "./Examples/Overhead.svelte";

    const FLAT_WHEEL_SIZE = 340;

    let { targetIndex = $bindable(), ...props }: WheelExampleProps = $props();
</script>

<PageMeasureBox width={FLAT_WHEEL_SIZE}>
    <OverheadExample {...props} bind:targetIndex />
</PageMeasureBox>
