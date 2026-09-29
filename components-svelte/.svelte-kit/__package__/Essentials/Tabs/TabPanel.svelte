<script lang="ts">
    import type { TabPanelProps } from "./Tabs.types.js";

    let props: TabPanelProps = $props();
</script>

<div id={props.id} role="tabpanel" aria-labelledby={props.tabId} tabindex="0">
    {@render props.children?.()}
</div>
