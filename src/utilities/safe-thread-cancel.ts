//!native
//!nonstrict
//!optimize 2

export default function safeThreadCancel(thread: thread) {
	let cancelled: boolean | undefined = undefined;
	if (coroutine.running() !== thread) [cancelled] = pcall(() => task.cancel(thread));

	if (!cancelled) {
		const threadReference = thread;
		task.defer(() => task.cancel(threadReference));
	}
}
