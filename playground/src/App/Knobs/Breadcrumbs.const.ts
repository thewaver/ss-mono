export namespace BreadcrumbKnobs {
    export const STARTING_IS_DISABLED = false;

    export const SEPARATOR_TEXT = {
        label: "Separator",
        hint: 'What is drawn between the crumbs. Choosing "none" leaves the slot out, so nothing sits between the crumbs and no empty element is rendered. Where drawn, it is hidden from assistive technology.',
        controls: 'Passes BreadcrumbsProps.renderSeparator, or omits it for "none"',
    };

    export const IS_DISABLED_TEXT = {
        label: "Disabled",
        hint: "Turns every crumb off: it refuses the press and says it is disabled, without the native attribute.",
        controls: "Sets Breadcrumb.isDisabled on every example crumb sent to BreadcrumbsProps.crumbs",
    };

    export const HAS_LINK_COMPONENT_TEXT = {
        label: "Custom link component",
        hint: "Draws the crumbs with a custom link component, as a router's link would be. Off, they use the native HTML anchor element.",
        controls: "Sets BreadcrumbsProps.linkComponent",
    };
}
