<script lang="ts" generics="T">
    import { untrack } from "svelte";

    import { MENU_DEFAULTS, MenuUtils, MenuStyles as styles } from "@thewaver/ss-components";
    import { Rect } from "@thewaver/ss-utils";

    import { NavigatorSvelteUtils } from "../../../Abstracts/Navigator/NavigatorSvelte.utils.svelte.js";
    import { getViewportContext } from "../../../Abstracts/Viewport/Viewport.context.js";
    import { createHeldValue } from "../../../Utils/bindableUtils.svelte.js";
    import type { ContextMenuProps, MenuItem } from "./Menu.types.js";
    import MenuLevel from "./MenuLevel.svelte";

    const EMPTY_CHECKED: never[] = [];

    const ROOT_PATH: number[] = [];
    const NO_PARENT_EXTENT = 0;

    let { visibility = $bindable(false), checked = $bindable(), ...props }: ContextMenuProps<T> = $props();

    const viewportContext = getViewportContext();
    const menuId = $props.id();

    $effect(() => untrack(() => MenuUtils.observePointerPoint()));

    let region = $state<HTMLDivElement>();
    let anchorRect = $state.raw<Rect>();

    const direction = NavigatorSvelteUtils.createDirection(() => region ?? undefined);

    const isDisabled = $derived(props.isDisabled ?? false);

    const close = () => {
        visibility = false;
    };

    const [getChecked, setChecked] = createHeldValue([
        () => checked,
        (next) => {
            checked = next;
        },
    ]);

    const checkedValues = $derived(getChecked() ?? EMPTY_CHECKED);

    const pick = (item: MenuItem<T>, radioGroupValues: T[]) => {
        const current = getChecked();

        if (MenuUtils.getIsStateful(item) && current !== undefined) {
            setChecked(MenuUtils.computeNextChecked(current, item, radioGroupValues));
        }

        props.onActivate(item.value);

        if (!MenuUtils.getStaysOpenOnPick(item)) close();
    };

    $effect(() => {
        if (!visibility || !isDisabled) return;

        visibility = false;
    });

    $effect(() => {
        const element = region;

        if (!element) return;

        return untrack(() =>
            MenuUtils.observeContextMenuRequests(element, {
                viewportContext,
                getIsDisabled: () => isDisabled,
                onRequest: (rect) => {
                    if (!anchorRect || !Rect.isSame(anchorRect, rect)) anchorRect = rect;

                    visibility = true;
                },
            }),
        );
    });
</script>

<div
    bind:this={region}
    class={styles.contextMenuRegion}
    role="group"
    tabindex={isDisabled ? -1 : 0}
    aria-label={props.regionAriaLabel}
    aria-haspopup="menu"
    aria-expanded={visibility}
    aria-controls={visibility ? menuId : undefined}
    aria-disabled={isDisabled || undefined}
>
    {@render props.renderRegion()}
</div>

<MenuLevel
    id={menuId}
    ariaLabel={props.ariaLabel}
    items={props.items}
    isOpen={visibility}
    direction={direction()}
    path={ROOT_PATH}
    parentExtent={NO_PARENT_EXTENT}
    rootExtent={NO_PARENT_EXTENT}
    anchorRef={region ?? undefined}
    {anchorRect}
    placement={props.placement}
    offset={props.offset}
    submenuPlacement={props.submenuPlacement ?? MENU_DEFAULTS.submenuPlacement[direction()]}
    submenuOffset={props.submenuOffset}
    submenuMode={props.submenuMode ?? MENU_DEFAULTS.submenuMode}
    submenuOpensOn={props.submenuOpensOn ?? MENU_DEFAULTS.submenuOpensOn}
    reservedScreenSize={props.reservedScreenSize}
    transitionDurationMs={props.transitionDurationMs}
    openerFlags={{ isOpen: visibility }}
    {checkedValues}
    computeLayout={props.computeLayout}
    computeEffect={props.computeEffect}
    computeCustomText={props.computeCustomText}
    renderItem={props.renderItem}
    renderPopup={props.renderPopup}
    floaterTransitionDurationMs={props.floaterTransitionDurationMs}
    renderHighlightFloater={props.renderHighlightFloater}
    onPick={pick}
    onClose={close}
    onDismiss={close}
/>
