import type { ToolbarButtonsProps, ToolbarCompositeProps, ToolbarMenusProps } from "./Toolbar.types.js";
declare function $$render<T>(): {
    props: ToolbarCompositeProps<T> & Pick<ToolbarButtonsProps<T>, "pressedValues"> & Pick<ToolbarMenusProps<T>, "checked">;
    exports: {};
    bindings: "checked" | "pressedValues";
    slots: {};
    events: {};
};
declare class __sveltets_Render<T> {
    props(): ReturnType<typeof $$render<T>>['props'];
    events(): ReturnType<typeof $$render<T>>['events'];
    slots(): ReturnType<typeof $$render<T>>['slots'];
    bindings(): "checked" | "pressedValues";
    exports(): {};
}
interface $$IsomorphicComponent {
    new <T>(options: import('svelte').ComponentConstructorOptions<ReturnType<__sveltets_Render<T>['props']>>): import('svelte').SvelteComponent<ReturnType<__sveltets_Render<T>['props']>, ReturnType<__sveltets_Render<T>['events']>, ReturnType<__sveltets_Render<T>['slots']>> & {
        $$bindings?: ReturnType<__sveltets_Render<T>['bindings']>;
    } & ReturnType<__sveltets_Render<T>['exports']>;
    <T>(internal: unknown, props: ReturnType<__sveltets_Render<T>['props']> & {}): ReturnType<__sveltets_Render<T>['exports']>;
    z_$$bindings?: ReturnType<__sveltets_Render<any>['bindings']>;
}
declare const ToolbarComposite: $$IsomorphicComponent;
type ToolbarComposite<T> = InstanceType<typeof ToolbarComposite<T>>;
export default ToolbarComposite;
