<script lang="ts">
    import type { Toast, ToastState } from "@thewaver/ss-components-svelte";
    import { InteractionSettings, Toasts } from "@thewaver/ss-components-svelte";
    import { OWN_HOTKEYS } from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.const";

    import PageToastContent from "../../../StyledComponents/ToastContent/ToastContent.svelte";
    import type { ToastDefs } from "../../../StyledComponents/ToastContent/ToastContentSvelte.types";
    import HotkeysRaisers from "./HotkeysRaisers.svelte";
</script>

<InteractionSettings toastHotkeys={OWN_HOTKEYS}>
    <Toasts ariaLabel={"Notifications on their own keys"} alignment={"top_center"}>
        <HotkeysRaisers />

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
</InteractionSettings>
