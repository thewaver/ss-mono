import { type Component, type ModelRef, type Ref, type VNodeChild, computed, getCurrentInstance, useModel } from "vue";

/**
 * Every member name of a props type, across all its arms when it is a union.
 *
 * `keyof` of a union answers only the names every arm shares, which would leave out a member that one arm carries and
 * another does not — `pressedValues` on a toolbar whose other arm is a menubar.
 */
export type PropName<TProps> = TProps extends unknown ? keyof TProps & string : never;

/**
 * What a member of a props type holds, across all its arms when it is a union.
 *
 * An arm that lacks the member, or types it `?: undefined` to rule it out, adds `undefined`, so `ariaLabel` on a props
 * type that asks for exactly one of `ariaLabel` and `ariaLabelledBy` reads `string | undefined`.
 */
export type PropValue<TProps, K extends PropertyKey> = TProps extends unknown
    ? K extends keyof TProps
        ? TProps[K]
        : undefined
    : never;

/** What each prop is declared as at runtime: `Boolean` for a prop that holds a boolean, `null` for any other. */
type PropDeclaration<TProps> = {
    [K in PropName<TProps>]: [NonNullable<PropValue<TProps, K>>] extends [never]
        ? null
        : [NonNullable<PropValue<TProps, K>>] extends [boolean]
          ? BooleanConstructor
          : null;
};

/**
 * Declares a component's props at runtime, from the props type that already describes them.
 *
 * Vue only treats as props the names a component declares; everything else lands in its attributes and is neither
 * typed nor reactive in the same way. This takes one entry per member of the props type — the compiler refuses a
 * missing member, an extra one, or the wrong kind — so the type stays the one place a prop is described and the
 * declaration cannot drift from it.
 *
 * A prop holding a boolean is declared `Boolean` so that a template may write it bare, `<Button isDisabled />`, and
 * mean `true`. It is never coerced otherwise: a boolean prop the consumer leaves out reads `undefined`, as every
 * other omitted prop does, so a component's own default applies. Every other prop is declared with no runtime type
 * at all, and is handed over exactly as given.
 *
 * A union props type is taken as it is: every member of every arm is declared once, and a member one arm rules out
 * with `?: undefined` is declared by what the other arms hold. For a generic props type, declare against it with its
 * parameters filled in by their constraints.
 *
 * @param declaration Each member of the props type, as `Boolean` or `null`.
 * @returns The `props` option to hand `defineComponent`. At runtime it is the object declaring each prop; its type
 * is the list of prop names, which is the form under which `defineComponent` keeps a generic component generic for
 * its consumers. Hand it to `defineComponent` and nowhere else.
 */
export const declareProps = <TProps extends object>(declaration: PropDeclaration<TProps>) =>
    Object.fromEntries(
        Object.entries(declaration).map(([key, type]) => [
            key,
            type === Boolean ? { type: Boolean, default: undefined } : null,
        ]),
    ) as unknown as (keyof TProps & string)[];

/**
 * The props a component declares, picked out of a wider set, leaving out any that were not given.
 *
 * For a component built on another that takes a subset of its props: spreading the whole set onto the inner one
 * would hand it attributes it does not declare, which Vue then writes onto its root element. Props that were left
 * out are left out here too, so the inner component sees them as absent rather than as given `undefined`.
 *
 * The result is typed as the whole outer set, though it holds only what the inner component declares: it exists to be
 * spread onto that component, where the members it does not declare are never read, and the whole type is what keeps
 * a required member required and a union props type — one of `ariaLabel` and `ariaLabelledBy` — intact on the way in.
 *
 * Never forward a two-way prop this way. Whether it is bound is read off the props it was handed, so a component
 * passing one on reads it with {@link useTwoWay} and hands the inner component its value and a setter of its own.
 *
 * Never set beside the spread a callback the forwarded set may already carry. Vue joins two handlers of one `on*` name
 * given to the same element into a list, so the consumer's would run as well as the component's own, and a component
 * that calls the prop directly would be handed a list rather than a function. A component setting one of those writes
 * it inside the same object literal as the forwarded set, after it, where it replaces the forwarded one:
 * `{...{ ...forwardProps(props, Inner), "onChange": handleChange }}`.
 *
 * @param props The outer component's props.
 * @param component The inner component.
 * @returns The props the inner component declares, as given.
 */
export const forwardProps = <TProps extends object>(props: TProps, component: Component): TProps => {
    const declared = (component as { props?: Record<string, unknown> }).props ?? {};
    const source = props as Record<string, unknown>;

    return Object.fromEntries(
        Object.keys(declared).flatMap((key) => (source[key] === undefined ? [] : [[key, source[key]]])),
    ) as TProps;
};

/** How {@link useTwoWay} treats a prop the consumer bound nothing to. */
export type TwoWayOptions = {
    /**
     * Whether the component keeps a value of its own while nothing is bound. On by default, which is right wherever
     * the React and Solid components keep one too. Switch it off where theirs only reports — writes to the pair when
     * one is given, and otherwise to nobody — so that a Vue consumer who binds nothing sees what theirs sees: the
     * write reaches an `onUpdate:<name>` if one was given, and the ref goes on reading the prop, or `initial`.
     */
    keepsOwnValue?: boolean;
};

/**
 * A two-way prop as one writable ref, whether or not the consumer bound it.
 *
 * The Vue side of two-way state, and what `v-model:value` binds to: a prop of the given name with an
 * `onUpdate:<name>` beside it. Bound, the ref reads the consumer's value and a write is handed to them; a write they
 * refuse leaves the ref reading what they hold. Not bound, the component keeps a value of its own, starting at
 * `initial`, and writes still reach any `onUpdate:<name>` given — unless `options.keepsOwnValue` is off, in which case
 * the ref always reads the prop and a write only reaches the listener. A write equal to what the ref holds changes
 * nothing.
 *
 * Both names must be declared as props. A props type that is a union is taken as it is, and `name` may be a member
 * that only some of its arms carry.
 *
 * @param props The component's props.
 * @param name The prop's name.
 * @param initial What the ref reads while nothing was given, bound or not.
 * @param options Whether the component keeps a value of its own; see {@link TwoWayOptions}.
 * @returns The ref.
 */
export function useTwoWay<TProps extends object, K extends PropName<TProps>>(
    props: TProps,
    name: K,
): ModelRef<PropValue<TProps, K>>;
export function useTwoWay<TProps extends object, K extends PropName<TProps>>(
    props: TProps,
    name: K,
    initial: NonNullable<PropValue<TProps, K>>,
): ModelRef<NonNullable<PropValue<TProps, K>>>;
export function useTwoWay<TProps extends object, K extends PropName<TProps>>(
    props: TProps,
    name: K,
    initial: undefined,
    options: TwoWayOptions,
): Ref<PropValue<TProps, K>>;
export function useTwoWay<TProps extends object, K extends PropName<TProps>>(
    props: TProps,
    name: K,
    initial: NonNullable<PropValue<TProps, K>>,
    options: TwoWayOptions,
): Ref<NonNullable<PropValue<TProps, K>>>;
export function useTwoWay<TProps extends object, K extends PropName<TProps>>(
    props: TProps,
    name: K,
    initial?: NonNullable<PropValue<TProps, K>>,
    options?: TwoWayOptions,
) {
    const source = props as Record<string, unknown>;

    if (options?.keepsOwnValue === false) {
        const instance = getCurrentInstance();
        const read = () => source[name] ?? initial;

        return computed({
            get: read,
            set: (next) => {
                if (Object.is(next, read())) return;

                instance?.emit(`update:${name}`, next);
            },
        });
    }

    if (initial === undefined) return useModel(source, name);

    return useModel(source, name, { get: (value: unknown) => value ?? initial });
}

/**
 * Draws a slot, or nothing when the consumer left it out.
 *
 * A slot's type can say it is expected, but a Vue consumer can always leave one out, so every slot is called
 * through this rather than directly. A `render*` callback of the other frameworks is a slot of the same name here,
 * handed one value: the callback's argument as it is, or one object holding every argument under its name.
 *
 * @param slot The slot, from the component's `slots`.
 * @param value What the slot is handed.
 * @returns What the slot drew.
 */
export const callSlot = <T>(slot: ((value: T) => VNodeChild) | undefined, value: T): VNodeChild => slot?.(value);
