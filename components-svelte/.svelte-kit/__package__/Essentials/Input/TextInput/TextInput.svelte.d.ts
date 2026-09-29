import type { TextInputProps } from "./TextInput.types.js";
declare function $$render<T = string>(): {
    props: TextInputProps<T>;
    exports: {};
    bindings: "value" | "ref";
    slots: {};
    events: {};
};
declare class __sveltets_Render<T = string> {
    props(): ReturnType<typeof $$render<T>>['props'];
    events(): ReturnType<typeof $$render<T>>['events'];
    slots(): ReturnType<typeof $$render<T>>['slots'];
    bindings(): "value" | "ref";
    exports(): {};
}
interface $$IsomorphicComponent {
    new <T = string>(options: import('svelte').ComponentConstructorOptions<ReturnType<__sveltets_Render<T>['props']>>): import('svelte').SvelteComponent<ReturnType<__sveltets_Render<T>['props']>, ReturnType<__sveltets_Render<T>['events']>, ReturnType<__sveltets_Render<T>['slots']>> & {
        $$bindings?: ReturnType<__sveltets_Render<T>['bindings']>;
    } & ReturnType<__sveltets_Render<T>['exports']>;
    <T = string>(internal: unknown, props: ReturnType<__sveltets_Render<T>['props']> & {}): ReturnType<__sveltets_Render<T>['exports']>;
    z_$$bindings?: ReturnType<__sveltets_Render<any>['bindings']>;
}
declare const TextInput: $$IsomorphicComponent;
type TextInput<T = string> = InstanceType<typeof TextInput<T>>;
export default TextInput;
