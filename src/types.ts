//!native
//!nonstrict
//!optimize 2

export interface ConnectionLike {
	Disconnect(): void;
}

export interface SignalLike<T extends Callback = Callback> {
	Connect?(callback: T): ConnectionLike;
	connect?(callback: T): ConnectionLike;
}

export type InferSignalParameters<S> = S extends SignalLike
	? Parameters<
			Parameters<
				S["Connect"] extends Callback ? S["Connect"] : S["connect"] extends Callback ? S["connect"] : never
			>[0]
		>
	: never;

export interface Vector2Like {
	X: number;
	Y: number;
}

export type OnActivated<T extends GuiButton = GuiButton> = (rbx: T, inputObject: InputObject, count: number) => void;
export type OnInput<T extends GuiObject = GuiObject> = (rbx: T, inputObject: InputObject) => void;
export type BindingOrValue<T> = React.Binding<T> | T;
