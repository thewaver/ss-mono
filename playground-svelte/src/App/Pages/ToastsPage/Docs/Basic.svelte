<script lang="ts">
    import type { Toast, ToastState } from "@thewaver/ss-components-svelte";
    import { Toasts } from "@thewaver/ss-components-svelte";

    import PageToastContent from "../../../StyledComponents/ToastContent/ToastContent.svelte";
    import type { ToastDefs } from "../../../StyledComponents/ToastContent/ToastContentSvelte.types";
    import BasicRaisers from "./BasicRaisers.svelte";
</script>

<Toasts ariaLabel={"Notifications"}>
    <BasicRaisers />

    {#snippet renderToast(
        toast: Toast<ToastDefs>,
        visibilityTarget: 0 | 1,
        transitionDurationMs: number,
        state: ToastState,
        dismiss: () => boolean,
    )}
        <PageToastContent {toast} {state} {visibilityTarget} {transitionDurationMs} onDismiss={dismiss} />
    {/snippet}
</Toasts>
