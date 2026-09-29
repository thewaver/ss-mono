<script lang="ts">
    import { Accordion } from "@thewaver/ss-components-svelte";
    import type { AccordionItem } from "@thewaver/ss-components-svelte";

    import PageAccordionHeader from "../../../../StyledComponents/AccordionContent/PageAccordionHeader.svelte";
    import type { AccordionDeferredExampleProps } from "../../Accordions.types";
    import DeferredPanel from "./DeferredPanel.svelte";

    const GAP = 5;

    const ITEMS: AccordionItem<string>[] = [{ value: "Shipping" }, { value: "Returns" }, { value: "Warranty" }];

    type Props = AccordionDeferredExampleProps;

    let { expanded = $bindable([]), ...props }: Props = $props();
</script>

<Accordion items={ITEMS} bind:expanded isPanelBuiltOnExpand={true} gap={GAP}>
    {#snippet renderHeader(item, flags)}
        <PageAccordionHeader {flags}>{item.value}</PageAccordionHeader>
    {/snippet}

    {#snippet renderPanel(item, visibilityTarget, transitionDurationMs)}
        <DeferredPanel value={item.value} {visibilityTarget} {transitionDurationMs} onBuild={props.onBuild} />
    {/snippet}
</Accordion>
