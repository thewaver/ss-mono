<script lang="ts">
    import { Button, SpotlightPrompt } from "@thewaver/ss-components-svelte";
    import { PADDING } from "@thewaver/ss-playground/App/Pages/Spotlights/SpotlightTourSteps.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/Spotlights/Spotlights.css";

    import PageButtonContent from "../../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import { renderHighlight, renderOverlay } from "../../Spotlights.const.svelte";
    import type { SpotlightPromptExampleProps } from "../../Spotlights.types";

    type Props = SpotlightPromptExampleProps;

    let { visibility = $bindable(), ...props }: Props = $props();

    let anchorRef = $state<HTMLElement>();
</script>

<div class={styles.root}>
    <Button
        bind:ref={anchorRef}
        onClick={async () => {
            if (!visibility) return;

            props.onBuy();
            visibility = false;
        }}
    >
        {#snippet renderContent(flags)}
            <PageButtonContent {flags}>Buy the potato</PageButtonContent>
        {/snippet}
    </Button>

    <Button
        onClick={async () => {
            visibility = true;
        }}
    >
        {#snippet renderContent(flags)}
            <PageButtonContent {flags}>Insist</PageButtonContent>
        {/snippet}
    </Button>

    <SpotlightPrompt elementRef={anchorRef} padding={PADDING} bind:visibility {renderHighlight} {renderOverlay} />
</div>
