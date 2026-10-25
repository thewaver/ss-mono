<script lang="ts">
    import { Button, Drawer } from "@thewaver/ss-components-svelte";
    import { FILLERS } from "@thewaver/ss-playground/App/Pages/DrawerPage/DrawerPage.const";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import PageDrawerPanel from "../../../StyledComponents/DrawerPanel/DrawerPanel.svelte";
    import PageModalOverlay from "../../../StyledComponents/ModalOverlay/ModalOverlay.svelte";
    import type { DrawerBasicDocsExampleProps } from "../DrawerPageSvelte.types";

    type Props = DrawerBasicDocsExampleProps;

    let props: Props = $props();

    let visibility = $state(false);
</script>

<Button
    id={"openDrawer"}
    onClick={() => {
        visibility = true;
    }}
>
    {#snippet renderContent(flags)}
        <PageButtonContent {flags}>Open drawer</PageButtonContent>
    {/snippet}
</Button>

<Drawer
    bind:visibility
    edge={props.edge}
    transitionDurationMs={props.transitionDurationMs}
    ariaLabel={"Trees"}
>
    {#snippet renderOverlay(visibilityTarget, transitionDurationMs)}
        <PageModalOverlay {visibilityTarget} {transitionDurationMs} />
    {/snippet}

    {#snippet renderContent(visibilityTarget, transitionDurationMs)}
        <PageDrawerPanel edge={props.edge} {visibilityTarget} {transitionDurationMs}>
            <div>Attached to the {props.edge} edge.</div>

            {#each ["First", "Second"] as caption (caption)}
                <Button>
                    {#snippet renderContent(flags)}
                        <PageButtonContent {flags}>{caption}</PageButtonContent>
                    {/snippet}
                </Button>
            {/each}

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
