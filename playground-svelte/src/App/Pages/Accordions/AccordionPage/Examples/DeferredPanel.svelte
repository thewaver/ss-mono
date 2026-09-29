<script lang="ts">
    import { onMount } from "svelte";

    import PageAccordionPanel from "../../../../StyledComponents/AccordionContent/PageAccordionPanel.svelte";

    const SECTION_BODIES: Record<string, string[]> = {
        Shipping: ["Orders leave the warehouse within two working days.", "Tracking arrives by email."],
        Returns: ["Thirty days, unopened, receipt or order number."],
        Warranty: ["Two years against manufacturing defects."],
    };

    type Props = {
        value: string;
        visibilityTarget: 0 | 1;
        transitionDurationMs: number;
        onBuild: (value: string) => void;
    };

    let props: Props = $props();

    onMount(() => props.onBuild(props.value));
</script>

<PageAccordionPanel visibilityTarget={props.visibilityTarget} transitionDurationMs={props.transitionDurationMs}>
    {#each SECTION_BODIES[props.value] as line (line)}
        <div data-built={props.value}>{line}</div>
    {/each}
</PageAccordionPanel>
