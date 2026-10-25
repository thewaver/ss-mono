<script lang="ts">
    import { Button, getToastsContext } from "@thewaver/ss-components-svelte";
    import { MESSAGES } from "@thewaver/ss-playground/App/Pages/ToastsPage/ToastsPage.const";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import type { ToastDefs } from "../../../StyledComponents/ToastContent/ToastContentSvelte.types";
    import type { ToastsDurationRaisersProps } from "../ToastsPageSvelte.types";

    type Props = ToastsDurationRaisersProps;

    let props: Props = $props();

    const toasts = getToastsContext<ToastDefs>();

    const raise = (durationMs: number | undefined) => {
        toasts.show({
            value: { kind: "success", message: MESSAGES.success },
            announcement: MESSAGES.success,
            durationMs,
            onShow: props.onShow,
            onHide: props.onHide,
        });
    };
</script>

<Button id={"durationTimed"} onClick={() => raise(props.durationMs)}>
    {#snippet renderContent(flags)}
        <PageButtonContent {flags}>Timed</PageButtonContent>
    {/snippet}
</Button>
<Button id={"durationSticky"} onClick={() => raise(undefined)}>
    {#snippet renderContent(flags)}
        <PageButtonContent {flags}>Sticky</PageButtonContent>
    {/snippet}
</Button>
