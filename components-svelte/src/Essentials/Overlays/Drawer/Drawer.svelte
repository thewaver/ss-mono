<script lang="ts">
    import Modal from "../Modal/Modal.svelte";
    import type { DrawerProps } from "./Drawer.types.js";

    let { visibility = $bindable(), ...props }: DrawerProps = $props();
</script>

<Modal {...props} bind:visibility alignment={props.edge} />
