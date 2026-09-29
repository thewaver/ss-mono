<script lang="ts" generics="T">
    import { FanMenuUtils } from "@thewaver/ss-components";

    import Menu from "../Menu/Menu.svelte";
    import type { FanMenuProps } from "./FanMenu.types.js";

    let {
        visibility = $bindable(false),
        checked = $bindable(),
        ref = $bindable(),
        ...props
    }: FanMenuProps<T> = $props();

    const computeLayout = $derived(FanMenuUtils.createLayout(props.layoutDefs));
</script>

<Menu {...props} bind:visibility bind:checked bind:ref submenuMode="replace" submenuOpensOn="press" {computeLayout} />
