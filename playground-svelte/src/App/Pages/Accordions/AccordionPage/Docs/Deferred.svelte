<script lang="ts">
    import { untrack } from "svelte";

    import { Accordion } from "@thewaver/ss-components-svelte";
    import type { AccordionItem } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import { DOCS_GAP } from "@thewaver/ss-playground/App/Pages/Accordions/AccordionPage/AccordionPage.const";
    import * as accordionStyles from "@thewaver/ss-playground/App/Pages/Accordions/Accordions.css";

    import PageAccordionHeader from "../../../../StyledComponents/AccordionContent/PageAccordionHeader.svelte";
    import PageAccordionPanel from "../../../../StyledComponents/AccordionContent/PageAccordionPanel.svelte";

    const SECTION_BODIES: Record<string, string[]> = {
        Shipping: ["Orders leave the warehouse within two working days.", "Tracking arrives by email."],
        Returns: ["Thirty days, unopened, receipt or order number."],
        Warranty: ["Two years against manufacturing defects."],
    };

    const ITEMS: AccordionItem<string>[] = [{ value: "Shipping" }, { value: "Returns" }, { value: "Warranty" }];

    let built = $state.raw<string[]>([]);

    const recordBuilt = (value: string) => () => {
        untrack(() => {
            built = built.includes(value) ? built : [...built, value];
        });
    };
</script>

<div class={accordionStyles.docsAccordion}>
    <Accordion items={ITEMS} gap={DOCS_GAP} isPanelBuiltOnExpand={true}>
        {#snippet renderHeader(item, flags)}
            <PageAccordionHeader {flags}>{item.value}</PageAccordionHeader>
        {/snippet}

        {#snippet renderPanel(item, visibilityTarget, transitionDurationMs)}
            <PageAccordionPanel {visibilityTarget} {transitionDurationMs}>
                {#each SECTION_BODIES[item.value] as line (line)}
                    <div {@attach recordBuilt(item.value)} data-built={item.value}>{line}</div>
                {/each}
            </PageAccordionPanel>
        {/snippet}
    </Accordion>
</div>

<div class={styles.exampleReadout}>{`Built so far: ${built.length ? built.join(", ") : "nothing"}`}</div>
