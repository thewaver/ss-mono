<script lang="ts">
    import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";

    import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.svelte";
    import ScrambledExample from "./Examples/Scrambled.svelte";
    import type { PaintedTextExampleWrapperProps } from "./PaintedTextPage.types";

    let { width, ...props }: PaintedTextExampleWrapperProps = $props();
</script>

<PageMeasureBox {width} padding={MEASURE_BOX_PADDING}>
    <ScrambledExample {...props} />
</PageMeasureBox>
