<script lang="ts">
    import { Accordion } from "@thewaver/ss-components-svelte";
    import type { AccordionItem } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/Accordions/Accordions.css";

    import PageAccordionHeader from "../../../../StyledComponents/AccordionContent/PageAccordionHeader.svelte";
    import PageAccordionPanel from "../../../../StyledComponents/AccordionContent/PageAccordionPanel.svelte";
    import type { AccordionExampleProps } from "../../Accordions.types";

    const GAP = 5;

    const SECTION_BODIES: Record<string, string[]> = {
        Shipping: ["Orders leave the warehouse within two working days.", "Tracking arrives by email."],
        Returns: ["Thirty days, unopened, receipt or order number."],
        Warranty: ["Two years against manufacturing defects."],
        Assembly: [
            "Lay every part out before starting.",
            "Count the bolts against the list; there are four lengths and they are not interchangeable.",
            "The long bolts go through the side panels, the short ones into the base.",
            "Fit the back panel before the shelves, or it will not go in afterwards.",
            "Tighten everything by hand first.",
            "Stand it up, then go round again and tighten properly.",
            "Check it does not rock before loading it.",
            "Keep the spare washers; there is always one.",
            "This panel is taller than the box it sits in, so opening it puts its header at the top.",
        ],
    };

    const ITEMS: AccordionItem<string>[] = [
        { value: "Shipping" },
        { value: "Returns" },
        { value: "Warranty" },
        { value: "Assembly" },
    ];

    type Props = AccordionExampleProps;

    let { expanded = $bindable([]) }: Props = $props();
</script>

<div class={styles.scrollBox} data-scroll-box="">
    <Accordion items={ITEMS} bind:expanded isScrolledIntoViewOnExpand={true} gap={GAP}>
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
</div>
