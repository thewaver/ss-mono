<script lang="ts">
    import { Sidebar } from "@thewaver/ss-components-svelte";
    import {
        COLLAPSED_SIZE,
        EXPANDED_SIZE,
        MAILBOXES,
    } from "@thewaver/ss-playground/App/Pages/SidebarPage/SidebarPage.const";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

    import PageSidebarToggle from "../../../PageComponents/SidebarToggle/SidebarToggle.svelte";
    import PageSidebarFade from "../../../StyledComponents/SidebarContent/PageSidebarFade.svelte";
    import PageSidebarFrame from "../../../StyledComponents/SidebarContent/PageSidebarFrame.svelte";
    import PageSidebarNeighbor from "../../../StyledComponents/SidebarContent/PageSidebarNeighbor.svelte";
    import PageSidebarPhase from "../../../StyledComponents/SidebarContent/PageSidebarPhase.svelte";
    import PageSidebarSurface from "../../../StyledComponents/SidebarContent/PageSidebarSurface.svelte";
    import type { SidebarHoverDocsExampleProps } from "../SidebarPageSvelte.types";

    const SIDEBAR_ID = "hoverSidebar";

    type Props = SidebarHoverDocsExampleProps;

    let props: Props = $props();

    let expanded = $state(false);
</script>

<PageSidebarFrame edge={"left"}>
    <Sidebar
        id={SIDEBAR_ID}
        layout={"overlay"}
        isExpandedOnHover={props.isExpandedOnHover}
        hoverShowDelayMs={props.hoverShowDelayMs}
        collapsedSize={COLLAPSED_SIZE}
        expandedSize={EXPANDED_SIZE}
        bind:expanded
    >
        {#snippet renderContent(phase, transitionDurationMs)}
            <PageSidebarSurface width={EXPANDED_SIZE}>
                <PageSidebarToggle
                    sidebarId={SIDEBAR_ID}
                    edge={"left"}
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
        The content beside the sidebar. Rest the pointer on the sidebar to open it over this text.
    </PageSidebarNeighbor>
</PageSidebarFrame>

<div class={exampleStyles.exampleReadout} data-readout>{`Expanded: ${expanded ? "yes" : "no"}`}</div>
