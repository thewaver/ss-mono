<script lang="ts">
    import { Sidebar } from "@thewaver/ss-components-svelte";

    import PageSidebarToggle from "../../../PageComponents/SidebarToggle/SidebarToggle.svelte";
    import PageSidebarFade from "../../../StyledComponents/SidebarContent/PageSidebarFade.svelte";
    import PageSidebarFrame from "../../../StyledComponents/SidebarContent/PageSidebarFrame.svelte";
    import PageSidebarNeighbor from "../../../StyledComponents/SidebarContent/PageSidebarNeighbor.svelte";
    import PageSidebarPhase from "../../../StyledComponents/SidebarContent/PageSidebarPhase.svelte";
    import PageSidebarSurface from "../../../StyledComponents/SidebarContent/PageSidebarSurface.svelte";
    import type { SidebarExampleProps } from "../SidebarPage.types";

    type Props = SidebarExampleProps;

    const COLLAPSED_WIDTH = 48;
    const EXPANDED_WIDTH = 200;
    const ENTRIES = ["Inbox", "Drafts", "Sent", "Archive", "Spam"];

    let { expanded = $bindable(), ...props }: Props = $props();

    const sidebarId = $props.id();
</script>

<PageSidebarFrame edge={props.edge}>
    <Sidebar
        id={sidebarId}
        edge={props.edge}
        layout={props.layout}
        collapsedWidth={COLLAPSED_WIDTH}
        expandedWidth={EXPANDED_WIDTH}
        isExpandedOnHover={props.isExpandedOnHover}
        bind:expanded
    >
        {#snippet renderContent(phase, transitionDurationMs)}
            <PageSidebarSurface width={EXPANDED_WIDTH}>
                <PageSidebarToggle
                    {sidebarId}
                    edge={props.edge}
                    isExpanded={expanded}
                    ariaLabel={expanded ? "Collapse mailboxes" : "Expand mailboxes"}
                    onToggle={() => {
                        expanded = !expanded;
                    }}
                />

                <PageSidebarFade {phase} {transitionDurationMs}>
                    <PageSidebarPhase>{phase}</PageSidebarPhase>

                    {#each ENTRIES as entry (entry)}
                        <div>{entry}</div>
                    {/each}
                </PageSidebarFade>
            </PageSidebarSurface>
        {/snippet}
    </Sidebar>

    <PageSidebarNeighbor>
        The content beside the sidebar. Pushed, it narrows as the sidebar grows; overlaid, it stays where it is and the
        sidebar grows over it.
    </PageSidebarNeighbor>
</PageSidebarFrame>
