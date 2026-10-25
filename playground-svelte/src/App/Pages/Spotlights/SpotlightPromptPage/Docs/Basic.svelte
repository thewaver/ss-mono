<script lang="ts">
    import { Button, SpotlightPrompt } from "@thewaver/ss-components-svelte";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import * as styles from "@thewaver/ss-playground/App/Pages/Spotlights/Spotlights.css";

    import PageButtonContent from "../../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import { renderHighlight, renderOverlay } from "../../Spotlights.const.svelte";
    import type { SpotlightBasicDocsExampleProps } from "../../SpotlightsSvelte.types";

    type Props = SpotlightBasicDocsExampleProps;

    let props: Props = $props();

    let visibility = $state(false);
    let bought = $state(0);
    let anchorRef = $state<HTMLElement>();
</script>

<div class={styles.root}>
    <Button
        id={"promptBuy"}
        bind:ref={anchorRef}
        onClick={() => {
            if (!visibility) return;

            bought += 1;
            visibility = false;
        }}
    >
        {#snippet renderContent(flags)}
            <PageButtonContent {flags}>Buy the potato</PageButtonContent>
        {/snippet}
    </Button>

    <Button
        id={"promptInsist"}
        onClick={() => {
            visibility = true;
        }}
    >
        {#snippet renderContent(flags)}
            <PageButtonContent {flags}>Insist</PageButtonContent>
        {/snippet}
    </Button>

    <SpotlightPrompt
        elementRef={anchorRef}
        padding={props.padding}
        transitionDurationMs={props.transitionDurationMs}
        bind:visibility
        {renderHighlight}
        {renderOverlay}
    />

    <div class={exampleStyles.exampleReadout} data-readout>
        {`Bought: ${bought}`}
    </div>
</div>
