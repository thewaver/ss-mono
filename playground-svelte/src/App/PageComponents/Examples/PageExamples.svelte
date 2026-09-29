<script lang="ts">
    import { Modal } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import { CSSUtils } from "@thewaver/ss-utils";

    import PageModalOverlay from "../../StyledComponents/ModalOverlay/ModalOverlay.svelte";
    import PageModalPanel from "../../StyledComponents/ModalPanel/PageModalPanel.svelte";
    import PageSourceView from "../SourceView/SourceView.svelte";
    import type { ExamplesProps } from "./Examples.types";
    import PageExample from "./PageExample.svelte";

    const DEFAULT_LAYOUT = "grid" as const;
    const DEFAULT_MIN_COLUMN_WIDTH = 320;
    const SINGLE_SPAN = 1;
    const PERCENT = 100;

    let props: ExamplesProps = $props();

    let activeIndex = $state(0);
    let isModalOpen = $state(false);

    const widestSpan = $derived(
        props.items.reduce((widest, example) => Math.max(widest, example.span ?? SINGLE_SPAN), SINGLE_SPAN),
    );

    const layout = $derived(props.layout ?? DEFAULT_LAYOUT);

    const minColumnWidth = $derived(props.minColumnWidth ?? DEFAULT_MIN_COLUMN_WIDTH);

    const columns = $derived(
        layout === "grid"
            ? `repeat(auto-fill, minmax(min(${PERCENT / widestSpan}%, ${minColumnWidth}px), 1fr))`
            : undefined,
    );
</script>

<div class={styles.examplesRootVariants[layout]} style:grid-template-columns={columns}>
    {#each props.items as example, exampleIndex (example.key)}
        <PageExample
            {example}
            onViewSource={() => {
                activeIndex = exampleIndex;
                isModalOpen = true;
            }}
        />
    {/each}
</div>

<Modal
    margins={CSSUtils.spreadMargin(40)}
    bind:visibility={isModalOpen}
    ariaLabel={`${props.items[activeIndex].name} source code`}
>
    {#snippet renderOverlay(visibilityTarget, transitionDurationMs)}
        <PageModalOverlay {visibilityTarget} {transitionDurationMs} />
    {/snippet}

    {#snippet renderContent(visibilityTarget, transitionDurationMs)}
        <PageModalPanel {visibilityTarget} {transitionDurationMs} padding={"0"}>
            <PageSourceView path={props.items[activeIndex].path!} />
        </PageModalPanel>
    {/snippet}
</Modal>
