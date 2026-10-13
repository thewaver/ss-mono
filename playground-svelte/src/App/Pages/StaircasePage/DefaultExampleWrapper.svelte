<script lang="ts">
    import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.svelte";
    import DefaultExample from "./Examples/Default.svelte";
    import type { StaircaseExampleProps } from "./StaircasePageSvelte.types";
    import { STAIRCASE_WIDTH } from "@thewaver/ss-playground/App/Pages/StaircasePage/StaircasePage.const";

    let props: StaircaseExampleProps = $props();
</script>

<PageMeasureBox width={STAIRCASE_WIDTH}>
    <DefaultExample {...props} />
</PageMeasureBox>
