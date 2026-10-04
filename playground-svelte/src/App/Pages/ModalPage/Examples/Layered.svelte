<script lang="ts">
    import type { Snippet } from "svelte";

    import { Button, Modal, Select } from "@thewaver/ss-components-svelte";
    import type { AnchorPlacement, SelectOption } from "@thewaver/ss-components-svelte";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PageModalOverlay from "../../../StyledComponents/ModalOverlay/ModalOverlay.svelte";
    import PageModalPanel from "../../../StyledComponents/ModalPanel/PageModalPanel.svelte";
    import PagePopoverSurface from "../../../StyledComponents/PopoverSurface/PopoverSurface.svelte";
    import PageSelectContent from "../../../StyledComponents/SelectContent/SelectContent.svelte";
    import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.svelte";
    import type { ModalLayeredExampleProps } from "../ModalPage.types";

    const LAYERED_TITLE_ID = "modal-page-layered-title";

    const COUNTRIES: SelectOption<string>[] = [{ value: "Denmark" }, { value: "Portugal" }, { value: "Sweden" }];

    type Props = ModalLayeredExampleProps;

    let { visibility = $bindable(), value = $bindable() }: Props = $props();
</script>

<Button
    id={"openLayers"}
    onClick={() => {
        visibility = true;
    }}
>
    {#snippet renderContent(flags)}
        <PageButtonContent {flags}>Open layers</PageButtonContent>
    {/snippet}
</Button>

<Modal bind:visibility ariaLabelledBy={LAYERED_TITLE_ID}>
    {#snippet renderOverlay(visibilityTarget, transitionDurationMs)}
        <PageModalOverlay {visibilityTarget} {transitionDurationMs} />
    {/snippet}

    {#snippet renderContent(visibilityTarget, transitionDurationMs)}
        <PageModalPanel {visibilityTarget} {transitionDurationMs}>
            <div id={LAYERED_TITLE_ID}>Where are you flying from?</div>

            <Select
                renderHighlightFloater={renderPageHighlightFloater}
                bind:value
                options={COUNTRIES}
                ariaLabel={"Country"}
                renderPopup={countryPopup}
            >
                {#snippet renderContent(selectedOption, flags)}
                    <PageSelectContent {flags}>{selectedOption?.value ?? "Pick one"}</PageSelectContent>
                {/snippet}

                {#snippet renderOption(option, flags)}
                    <PageSelectOptionContent isGliding {flags}>{option.value}</PageSelectOptionContent>
                {/snippet}
            </Select>
        </PageModalPanel>
    {/snippet}
</Modal>

{#snippet countryPopup(
    renderOptions: Snippet,
    popupVisibilityTarget: 0 | 1,
    popupTransitionDurationMs: number,
    placement: AnchorPlacement,
)}
    <PagePopoverSurface
        visibilityTarget={popupVisibilityTarget}
        transitionDurationMs={popupTransitionDurationMs}
        {placement}
    >
        {@render renderOptions()}
    </PagePopoverSurface>
{/snippet}
