<script lang="ts" generics="T">
    import Wheel from "../../../Primitives/Wheel/Wheel.svelte";
    import type { DrumWheelProps } from "../../../Primitives/Wheel/Wheel.types.js";

    let { targetIndex = $bindable(0), autoSpin = $bindable(true), ...props }: DrumWheelProps<T> = $props();
</script>

<Wheel {...props} bind:targetIndex bind:autoSpin variant="drum" />
