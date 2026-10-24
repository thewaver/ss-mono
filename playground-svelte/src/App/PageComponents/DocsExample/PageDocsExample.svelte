<script lang="ts">
    import { untrack } from "svelte";

    import { Collapsible } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/PageComponents/DocsExample/DocsExample.css";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

    import PageAccordionHeader from "../../StyledComponents/AccordionContent/PageAccordionHeader.svelte";
    import PageAccordionPanel from "../../StyledComponents/AccordionContent/PageAccordionPanel.svelte";
    import PageCodeBox from "../CodeBox/CodeBox.svelte";
    import PageLayer from "../Layer/Layer.svelte";
    import { getPreviewContext } from "../Preview/Preview.context";
    import PagePropsPanel from "../PropsPanel/PagePropsPanel.svelte";
    import { SourceViewUtils } from "../SourceView/SourceView.utils";
    import type { SourceFile } from "../SourceView/SourceViewSvelte.types";
    import type { PageDocsExampleProps } from "./DocsExampleSvelte.types";

    let props: PageDocsExampleProps = $props();

    const preview = getPreviewContext();

    const isPreviewDemo = preview ? preview.claimDemo() : false;

    let file = $state.raw<SourceFile>();
    let loadToken = 0;

    $effect(() => {
        const path = props.path;

        if (preview) return;

        untrack(() => {
            const token = ++loadToken;

            file = undefined;

            void SourceViewUtils.loadFile(path).then((loaded) => {
                if (token !== loadToken) return;

                file = loaded;
            });
        });
    });
</script>

{#if preview}
    {#if isPreviewDemo}
        <div class={exampleStyles.exampleDemo} data-demo="" data-testid={props.path}>
            {@render props.children?.()}
        </div>
    {/if}
{:else}
    <div class={styles.docsExampleStack}>
        <div class={styles.docsExample} data-docs-example="">
            <PageLayer level={1}>
                <div class={styles.docsExampleSection}>
                    <div class={styles.docsExampleDemo} data-demo="" data-testid={props.path}>
                        {@render props.children?.()}
                    </div>

                    {#if props.renderKnobs}
                        <div class={styles.docsExampleDivider} role="separator" aria-orientation="vertical"></div>

                        <div class={styles.docsExampleKnobs}>
                            <PagePropsPanel scope={"local"} hasReset={false}>
                                {@render props.renderKnobs()}
                            </PagePropsPanel>
                        </div>
                    {/if}
                </div>
            </PageLayer>
        </div>

        {#if file}
            {@const source = file.source}

            <PageLayer level={1}>
                <div class={styles.docsExampleCode}>
                    <Collapsible sizing={"fill"} isPanelBuiltOnExpand={true}>
                        {#snippet renderTrigger(flags)}
                            <PageAccordionHeader {flags}>{flags.isExpanded ? "Hide code" : "Show code"}</PageAccordionHeader>
                        {/snippet}

                        {#snippet renderPanel(visibilityTarget, transitionDurationMs)}
                            <PageAccordionPanel {visibilityTarget} {transitionDurationMs}>
                                <PageCodeBox {source} />
                            </PageAccordionPanel>
                        {/snippet}
                    </Collapsible>
                </div>
            </PageLayer>
        {/if}
    </div>
{/if}
