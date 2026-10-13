<script lang="ts">
    import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.svelte";
    import DefaultExample from "./Examples/Default.svelte";
    import type { FormationExampleProps } from "./FormationPageSvelte.types";
    import { FORMATION_WIDTH } from "@thewaver/ss-playground/App/Pages/FormationPage/FormationPage.const";

    let props: FormationExampleProps = $props();
</script>

<PageMeasureBox width={FORMATION_WIDTH}>
    <DefaultExample {...props} />
</PageMeasureBox>
