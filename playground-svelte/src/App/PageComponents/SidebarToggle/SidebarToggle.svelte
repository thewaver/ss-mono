<script lang="ts">
    import { InteractionWrapper } from "@thewaver/ss-components-svelte";

    import PageSidebarToggleButton from "../../StyledComponents/SidebarToggleButton/SidebarToggleButton.svelte";
    import type { SidebarToggleProps } from "./SidebarToggle.types";

    let props: SidebarToggleProps = $props();
</script>

<InteractionWrapper>
    {#snippet renderControl(attachElement, flags)}
        <PageSidebarToggleButton
            {@attach attachElement}
            {flags}
            edge={props.edge}
            isExpanded={props.isExpanded}
            aria-label={props.ariaLabel}
            aria-expanded={props.isExpanded}
            aria-controls={props.sidebarId}
            onclick={() => props.onToggle()}
        />
    {/snippet}
</InteractionWrapper>
