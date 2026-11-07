import { createContext, useContext } from "solid-js";

import type { NavLinkGroupContextType } from "./NavLink.contextSolid.types";

const NavLinkGroupContext = createContext<NavLinkGroupContextType>();

export const NavLinkGroupContextProvider = NavLinkGroupContext.Provider;

export const useNavLinkGroupContext = () => useContext(NavLinkGroupContext);
