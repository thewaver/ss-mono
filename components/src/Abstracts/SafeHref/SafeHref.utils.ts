import { StringUtils } from "@thewaver/ss-utils";

const warnedAddresses = new Set<string>();

export namespace SafeHrefUtils {
    /**
     * A consumer's link address, ready to write into an `href`, or `undefined` where it must not be written.
     *
     * {@link StringUtils.toSafeHref} for a component drawing an item as a link: an address beginning `javascript:`,
     * however disguised, is refused, and the component draws the item as it would with no address, following no
     * link. Each refused address is warned about once in development, naming the component. Every other address
     * passes unchanged.
     *
     * @param href The address the consumer gave, if any.
     * @param component The component's name, for the warning.
     * @returns The address, or `undefined` when none was given or it was refused.
     */
    export const resolve = (href: string | undefined, component: string) => {
        const safeHref = StringUtils.toSafeHref(href);

        if (process.env.NODE_ENV === "production" || href === undefined || safeHref !== undefined) return safeHref;

        const key = `${component}\n${href}`;

        if (!warnedAddresses.has(key)) {
            warnedAddresses.add(key);
            console.warn(
                `${component}: the link address "${href}" would run script when followed, so it is not written and the item follows no link.`,
            );
        }

        return safeHref;
    };
}
