<script lang="ts">
    import { Progress } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/ProgressPage/ProgressPage.css";

    import PageProgressContent from "../../../StyledComponents/ProgressContent/ProgressContent.svelte";

    const RATIO = 0.4;
</script>

<div dir={"rtl"} class={styles.docsDirectionBox}>
    <Progress value={RATIO} ariaLabel={"Setup progress"}>
        {#snippet renderContent(state)}
            <PageProgressContent {state} />
        {/snippet}
    </Progress>
</div>
