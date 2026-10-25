<script lang="ts">
    import { Button, Drawer } from "@thewaver/ss-components-svelte";
    import { FILLERS } from "@thewaver/ss-playground/App/Pages/DrawerPage/DrawerPage.const";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import PageDrawerPanel from "../../../StyledComponents/DrawerPanel/DrawerPanel.svelte";
    import PageModalOverlay from "../../../StyledComponents/ModalOverlay/ModalOverlay.svelte";
    import type { DrawerSwipeDocsExampleProps } from "../DrawerPageSvelte.types";

    type Props = DrawerSwipeDocsExampleProps;

    let props: Props = $props();

    let visibility = $state(false);
</script>

<Button
    id={"openSheet"}
    onClick={() => {
        visibility = true;
    }}
>
    {#snippet renderContent(flags)}
        <PageButtonContent {flags}>Open sheet</PageButtonContent>
    {/snippet}
</Button>

<Drawer
    bind:visibility
    edge={"bottom"}
    isDismissableOnOverlayClick={props.isDismissableOnOverlayClick}
    ariaLabel={"Trees"}
>
    {#snippet renderOverlay(visibilityTarget, transitionDurationMs)}
        <PageModalOverlay {visibilityTarget} {transitionDurationMs} />
    {/snippet}

    {#snippet renderContent(visibilityTarget, transitionDurationMs)}
        <PageDrawerPanel edge={"bottom"} {visibilityTarget} {transitionDurationMs}>
            <div>Attached to the bottom edge.</div>

            <Button
                onClick={() => {
                    visibility = false;
                }}
            >
                {#snippet renderContent(flags)}
                    <PageButtonContent {flags}>Close</PageButtonContent>
                {/snippet}
            </Button>

            {#each FILLERS as caption (caption)}
                <div>{caption}</div>
            {/each}
        </PageDrawerPanel>
    {/snippet}
</Drawer>
