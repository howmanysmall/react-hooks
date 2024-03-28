//!native
//!nonstrict
//!optimize 2

import React, { useMemo } from "@rbxts/react";
import Error from "../utilities/error";
import { None, assign, values } from "../utilities/object-utilities";

export interface CreateContextOptions<T> {
	readonly contextName: string;
	readonly defaultValue?: T;
	readonly providerName: string;
}

/**
 * Creates a context with the given options.
 *
 * @param options - The options for creating the context.
 * @param options.contextName - The name of the context.
 * @param options.defaultValue - The default value for the context.
 * @param options.providerName - The name of the provider component.
 * @return A tuple containing the provider component, the useContext hook, the memoized provider component, and the context itself.
 */
export function createContext<T extends object>(options: CreateContextOptions<T>) {
	const { contextName, defaultValue, providerName } = options;
	const Context = React.createContext<T | undefined>(defaultValue);
	Context.displayName = contextName;

	function useContext(componentName: string): T {
		const context = React.useContext(Context);
		if (context === undefined) {
			const exception = new Error(`<${componentName} /> is missing a parent <${providerName} /> component.`);
			Error.captureStackTrace(exception, useContext);
			throw exception;
		}

		return context;
	}

	function Provider(properties: React.PropsWithChildren<T>) {
		const context: T = assign({}, properties, { children: None });
		// eslint-disable-next-line react-hooks/exhaustive-deps
		const value = useMemo(() => context, values(context));

		return <Context.Provider value={value}>{properties.children}</Context.Provider>;
	}

	const ProviderMemo = React.memo(Provider);
	ProviderMemo.displayName = providerName;
	return $tuple<Tuple<T>>(Provider, useContext, ProviderMemo, Context);
}

type Tuple<T extends object> = [
	Provider: React.FC<T>,
	useContext: (componentName: string) => T,
	ProviderMemo: React.MemoExoticComponent<React.FC<T>>,
	Context: React.Context<T | undefined>,
];
