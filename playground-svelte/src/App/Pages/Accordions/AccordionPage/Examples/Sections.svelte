<script lang="ts">
    import { Accordion } from "@thewaver/ss-components-svelte";
    import type { AccordionItem } from "@thewaver/ss-components-svelte";

    import PageAccordionHeader from "../../../../StyledComponents/AccordionContent/PageAccordionHeader.svelte";
    import PageAccordionPanel from "../../../../StyledComponents/AccordionContent/PageAccordionPanel.svelte";
    import type { AccordionExampleProps } from "../../Accordions.types";

    const GAP = 5;

    const SECTION_BODIES: Record<string, string[]> = {
        Shipping: ["Orders leave the warehouse within two working days.", "Tracking arrives by email."],
        Returns: ["Thirty days, unopened, receipt or order number."],
        Warranty: ["Two years against manufacturing defects."],
        Unavailable: ["This section is disabled, so its header refuses to open it."],
    };

    const ITEMS: AccordionItem<string>[] = [
        { value: "Shipping" },
        { value: "Returns" },
        { value: "Warranty" },
        { value: "Unavailable", isDisabled: true },
    ];

    type Props = AccordionExampleProps & {
        isSingleExpand?: boolean;
        isExpandRequired?: boolean;
    };

    let { expanded = $bindable([]), ...props }: Props = $props();
</script>

<Accordion
    items={ITEMS}
    bind:expanded
    isSingleExpand={props.isSingleExpand}
    isExpandRequired={props.isExpandRequired}
    gap={GAP}
>
    {#snippet renderHeader(item, flags)}
        <PageAccordionHeader {flags}>{item.value}</PageAccordionHeader>
    {/snippet}

    {#snippet renderPanel(item, visibilityTarget, transitionDurationMs)}
        <PageAccordionPanel {visibilityTarget} {transitionDurationMs}>
            {#each SECTION_BODIES[item.value] as line (line)}
                <div>{line}</div>
            {/each}
        </PageAccordionPanel>
    {/snippet}
</Accordion>
