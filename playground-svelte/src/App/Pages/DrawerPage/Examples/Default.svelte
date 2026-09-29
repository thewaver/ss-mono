<script lang="ts">
    import { Button, Drawer } from "@thewaver/ss-components-svelte";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import PageDrawerPanel from "../../../StyledComponents/DrawerPanel/DrawerPanel.svelte";
    import PageModalOverlay from "../../../StyledComponents/ModalOverlay/ModalOverlay.svelte";
    import type { DrawerExampleProps } from "../DrawerPage.types";

    type Props = DrawerExampleProps;

    let { visibility = $bindable(), ...props }: Props = $props();
</script>

<Button
    onClick={() => {
        visibility = true;
    }}
>
    {#snippet renderContent(flags)}
        <PageButtonContent {flags}>Open {props.edge}</PageButtonContent>
    {/snippet}
</Button>

<Drawer bind:visibility edge={props.edge} ariaLabel={`${props.edge} drawer`}>
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

            {#each props.fillers as caption (caption)}
                <div>{caption}</div>
            {/each}
        </PageDrawerPanel>
    {/snippet}
</Drawer>
