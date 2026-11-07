import { createContext } from "svelte";

import type { NavLinkGroupContextType } from "./NavLink.contextSvelte.types";

const [getContext, setContext, hasContext] = createContext<NavLinkGroupContextType>();

export const setNavLinkGroupContext = (context: NavLinkGroupContextType) => setContext(context);

export const getNavLinkGroupContext = (): NavLinkGroupContextType | undefined =>
    hasContext() ? getContext() : undefined;
