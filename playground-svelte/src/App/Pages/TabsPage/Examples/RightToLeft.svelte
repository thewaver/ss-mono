<script lang="ts">
    import { RIGHT_TO_LEFT_TABS } from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";

    import type { TabsExampleProps } from "../TabsPage.types";
    import RowExample from "./Row.svelte";

    type Props = TabsExampleProps;

    let props: Props = $props();
</script>

<div dir={"rtl"}>
    <RowExample
        selectedValue={props.selectedValue}
        tabs={RIGHT_TO_LEFT_TABS}
        idPrefix={"rtl"}
        onSelectionChange={props.onSelectionChange}
    />
</div>
