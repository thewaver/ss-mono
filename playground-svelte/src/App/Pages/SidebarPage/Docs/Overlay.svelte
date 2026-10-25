<script lang="ts">
    import { Sidebar } from "@thewaver/ss-components-svelte";
    import {
        COLLAPSED_SIZE,
        EXPANDED_SIZE,
        MAILBOXES,
    } from "@thewaver/ss-playground/App/Pages/SidebarPage/SidebarPage.const";

    import PageSidebarToggle from "../../../PageComponents/SidebarToggle/SidebarToggle.svelte";
    import PageSidebarFade from "../../../StyledComponents/SidebarContent/PageSidebarFade.svelte";
    import PageSidebarFrame from "../../../StyledComponents/SidebarContent/PageSidebarFrame.svelte";
    import PageSidebarNeighbor from "../../../StyledComponents/SidebarContent/PageSidebarNeighbor.svelte";
    import PageSidebarPhase from "../../../StyledComponents/SidebarContent/PageSidebarPhase.svelte";
    import PageSidebarSurface from "../../../StyledComponents/SidebarContent/PageSidebarSurface.svelte";
    import type { SidebarOverlayDocsExampleProps } from "../SidebarPageSvelte.types";

    const SIDEBAR_ID = "overlaySidebar";

    type Props = SidebarOverlayDocsExampleProps;

    let props: Props = $props();

    let expanded = $state(false);
</script>

<PageSidebarFrame edge={"right"}>
    <Sidebar
        id={SIDEBAR_ID}
        edge={"right"}
        layout={props.layout}
        collapsedSize={COLLAPSED_SIZE}
        expandedSize={EXPANDED_SIZE}
        bind:expanded
    >
        {#snippet renderContent(phase, transitionDurationMs)}
            <PageSidebarSurface width={EXPANDED_SIZE}>
                <PageSidebarToggle
                    sidebarId={SIDEBAR_ID}
                    edge={"right"}
                    isExpanded={expanded}
                    ariaLabel={expanded ? "Collapse mailboxes" : "Expand mailboxes"}
                    onToggle={() => {
                        expanded = !expanded;
                    }}
                />

                <PageSidebarFade {phase} {transitionDurationMs}>
                    <PageSidebarPhase>{phase}</PageSidebarPhase>

                    {#each MAILBOXES as mailbox (mailbox)}
                        <div>{mailbox}</div>
                    {/each}
                </PageSidebarFade>
            </PageSidebarSurface>
        {/snippet}
    </Sidebar>

    <PageSidebarNeighbor>
        The content beside the sidebar. Overlaid, it stays where it is and the sidebar grows over it; pushed, it
        narrows as the sidebar grows.
    </PageSidebarNeighbor>
</PageSidebarFrame>
