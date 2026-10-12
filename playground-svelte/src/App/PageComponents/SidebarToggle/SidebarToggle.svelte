<script lang="ts">
    import { InteractionWrapper } from "@thewaver/ss-components-svelte";

    import PageSidebarToggleButton from "../../StyledComponents/SidebarToggleButton/SidebarToggleButton.svelte";
    import type { SidebarToggleProps } from "./SidebarToggle.types";

    let props: SidebarToggleProps = $props();

    const isDisabled = $derived(props.isDisabled ?? false);
</script>

<InteractionWrapper {isDisabled}>
    {#snippet renderControl(attachElement, flags)}
        <PageSidebarToggleButton
            {@attach attachElement}
            {flags}
            edge={props.edge}
            isExpanded={props.isExpanded}
            aria-label={props.ariaLabel}
            aria-expanded={props.isExpanded}
            aria-controls={props.sidebarId}
            aria-disabled={isDisabled || undefined}
            onclick={() => {
                if (!isDisabled) props.onToggle();
            }}
        />
    {/snippet}
</InteractionWrapper>
