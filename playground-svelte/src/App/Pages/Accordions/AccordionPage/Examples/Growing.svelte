<script lang="ts">
    import { Accordion, Button } from "@thewaver/ss-components-svelte";
    import type { AccordionItem } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/Accordions/Accordions.css";

    import PageAccordionHeader from "../../../../StyledComponents/AccordionContent/PageAccordionHeader.svelte";
    import PageAccordionPanel from "../../../../StyledComponents/AccordionContent/PageAccordionPanel.svelte";
    import PageButtonContent from "../../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import type { AccordionGrowingExampleProps } from "../../Accordions.types";

    const ITEMS: AccordionItem<string>[] = [{ value: "Shipping" }];

    type Props = AccordionGrowingExampleProps;

    let { expanded = $bindable([]), ...props }: Props = $props();
</script>

<Accordion items={ITEMS} bind:expanded gap={props.gap} transitionDurationMs={props.transitionDurationMs}>
    {#snippet renderHeader(item, flags)}
        <PageAccordionHeader {flags}>{item.value}</PageAccordionHeader>
    {/snippet}

    {#snippet renderPanel(_, visibilityTarget, transitionDurationMs)}
        <PageAccordionPanel {visibilityTarget} {transitionDurationMs}>
            <div class={styles.growingButtons}>
                <Button id={"addALine"} onClick={props.onAddLine}>
                    {#snippet renderContent(flags)}
                        <PageButtonContent {flags}>Add a line</PageButtonContent>
                    {/snippet}
                </Button>

                <Button id={"clearLines"} onClick={props.onClearLines}>
                    {#snippet renderContent(flags)}
                        <PageButtonContent {flags}>Clear lines</PageButtonContent>
                    {/snippet}
                </Button>
            </div>

            {#each Array.from({ length: props.extraLines }) as _unused, index (index)}
                <div>Line {index + 1} appeared after the panel was already open.</div>
            {/each}
        </PageAccordionPanel>
    {/snippet}
</Accordion>
