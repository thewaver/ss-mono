<script lang="ts">
    import type { MenuExampleProps } from "../MenuPageSvelte.types";
    import SubmenusExample from "./Submenus.svelte";

    type Props = MenuExampleProps;

    let props: Props = $props();
</script>

<div dir={"rtl"}>
    <SubmenusExample onActivate={props.onActivate} />
</div>
