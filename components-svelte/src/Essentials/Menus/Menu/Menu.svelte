<script lang="ts" generics="T">
    import { untrack } from "svelte";

    import { MENU_DEFAULTS, type MenuFlags, type MenuHighlightPosition, MenuUtils } from "@thewaver/ss-components";
    import type { Point2d } from "@thewaver/ss-utils";

    import { NavigatorSvelteUtils } from "../../../Abstracts/Navigator/NavigatorSvelte.utils.svelte.js";
    import InteractionWrapper from "../../../Primitives/InteractionWrapper/InteractionWrapper.svelte";
    import { createHeldValue } from "../../../Utils/bindableUtils.svelte.js";
    import type { MenuItem, MenuProps } from "./Menu.types.js";
    import MenuLevel from "./MenuLevel.svelte";
    import MenuTrigger from "./MenuTrigger.svelte";

    const EMPTY_CHECKED: never[] = [];

    const ROOT_PATH: number[] = [];
    const NO_PARENT_EXTENT = 0;
    const PRIMARY_BUTTON = 0;

    let { visibility = $bindable(false), checked = $bindable(), ref = $bindable(), ...props }: MenuProps<T> = $props();

    const uid = $props.id();
    const menuId = `${uid}-menu`;

    $effect(() => untrack(() => MenuUtils.observePointerPoint()));

    let triggerElement = $state<HTMLElement>();
    let initialHighlightPosition = $state<MenuHighlightPosition>("first");
    let flickOrigin = $state.raw<Point2d>();

    const anchorElement = $derived(props.anchorRef ?? triggerElement);

    const direction = NavigatorSvelteUtils.createDirection(() => anchorElement);

    let isTogglePrevented = false;

    const isDisabled = $derived(props.isDisabled ?? false);
    const isHoldable = $derived(props.opensOnHold ?? false);
    const triggerId = $derived(props.id ?? `${uid}-trigger`);

    const open = (position: MenuHighlightPosition) => {
        if (isDisabled || visibility) return;

        initialHighlightPosition = position;
        visibility = true;
    };

    $effect(() => {
        if (!visibility || !isDisabled) return;

        visibility = false;
    });

    const close = () => {
        visibility = false;
        flickOrigin = undefined;
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

    const handleTriggerPress = (e: PointerEvent) => {
        if (!isHoldable || e.button !== PRIMARY_BUTTON || visibility) return;

        isTogglePrevented = true;

        open("first");
        flickOrigin = { x: e.clientX, y: e.clientY };
    };

    const handleTriggerToggle = () => {
        if (isTogglePrevented) {
            isTogglePrevented = false;

            return;
        }

        if (visibility) close();
        else open("first");
    };

    $effect(() => {
        if (visibility) return;

        initialHighlightPosition = "first";
    });

    const handleTriggerKeyDown = (e: KeyboardEvent) => {
        if (isDisabled) return;

        const position = MenuUtils.getTriggerOpenPosition(e.key);

        if (position === undefined) return;

        e.preventDefault();

        open(position);
    };

    const extraFlags: MenuFlags = $derived({ isOpen: visibility });
</script>

<InteractionWrapper
    {...props}
    {extraFlags}
    bind:ref={
        () => ref,
        (element) => {
            triggerElement = element;
            ref = element;
        }
    }
>
    {#snippet renderControl(attachElement, flags)}
        <MenuTrigger
            {attachElement}
            id={triggerId}
            ariaLabel={props.ariaLabel}
            {menuId}
            role={props.triggerRole ?? MENU_DEFAULTS.triggerRole}
            {flags}
            renderContent={props.renderContent}
            {isHoldable}
            onToggle={handleTriggerToggle}
            onPress={handleTriggerPress}
            onKeyDown={handleTriggerKeyDown}
        />

        <MenuLevel
            id={menuId}
            labelledBy={triggerId}
            items={props.items}
            isOpen={visibility}
            direction={direction()}
            path={ROOT_PATH}
            parentExtent={NO_PARENT_EXTENT}
            rootExtent={NO_PARENT_EXTENT}
            layoutSize={props.layoutSize}
            {initialHighlightPosition}
            anchorRef={anchorElement}
            placement={props.placement}
            offset={props.offset}
            submenuPlacement={props.submenuPlacement ?? MENU_DEFAULTS.submenuPlacement[direction()]}
            submenuOffset={props.submenuOffset}
            submenuMode={props.submenuMode ?? MENU_DEFAULTS.submenuMode}
            submenuOpensOn={props.submenuOpensOn ?? MENU_DEFAULTS.submenuOpensOn}
            reservedScreenSize={props.reservedScreenSize}
            transitionDurationMs={props.transitionDurationMs}
            openerFlags={flags}
            {checkedValues}
            computeLayout={props.computeLayout}
            computeEffect={props.computeEffect}
            computeCustomText={props.computeCustomText}
            {flickOrigin}
            renderItem={props.renderItem}
            renderPopup={props.renderPopup}
            onPick={pick}
            onFlickEnd={(releasedOn) => {
                flickOrigin = undefined;

                if (!releasedOn || !triggerElement?.contains(releasedOn)) {
                    isTogglePrevented = false;
                }
            }}
            onClose={close}
            onDismiss={close}
        />
    {/snippet}
</InteractionWrapper>
