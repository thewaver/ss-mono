<script lang="ts">
    import { TabPanel } from "@thewaver/ss-components-svelte";
    import type { TabPanelProps } from "@thewaver/ss-components-svelte";

    import PageTabPanelContent from "../../StyledComponents/TabContent/PageTabPanelContent.svelte";

    let props: TabPanelProps = $props();
</script>

<TabPanel id={props.id} tabId={props.tabId}>
    <PageTabPanelContent>{@render props.children?.()}</PageTabPanelContent>
</TabPanel>
