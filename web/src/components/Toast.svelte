<script lang="ts">
	import { onMount } from 'svelte';
	import { toasts, dismissToast } from '$lib/toast';
	import { fade, fly } from 'svelte/transition';
	import { X } from 'lucide-svelte';

	let toastContainer: HTMLElement;


	function handleKeydown(e: KeyboardEvent, id: string) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			dismissToast(id);
		}
	}
	// Position container to fixed top-right
	onMount(() => {
		if (toastContainer) {
			toastContainer.style.position = 'fixed';
		toastContainer.style.top = '5rem';
		toastContainer.style.zIndex = '1100';
			toastContainer.style.flexDirection = 'column';
			toastContainer.style.gap = '0.5rem';
			toastContainer.style.alignItems = 'flex-end';
		}
	});
</script>

<div bind:this={toastContainer}>
	{#each $toasts as toast (toast.id)}
<div
class="toast"
class:toast-success={toast.type === 'success'}
class:toast-error={toast.type === 'error'}
class:toast-info={toast.type === 'info'}
class:toast-warning={toast.type === 'warning'}
			transition:fly={{ y: -20, duration: 300 }}
			role="button"
			aria-label="Dismiss notification"
			tabindex="0"

			on:click={() => dismissToast(toast.id)}
			on:keydown={(e) => handleKeydown(e, toast.id)}
		>
{toast.message}
			<button
				class="toast-close"
				on:click|stopPropagation={() => dismissToast(toast.id)}
			>
			<X size={16} />
			</button>
		</div>
	{/each}
</div>

<style>
	.toast {
		position: relative;
		min-width: 280px;
		max-width: 400px;
		padding: 0.875rem 1rem;
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-lg);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		font-weight: 500;
		font-size: 0.875rem;
		transition: opacity 0.3s var(--ease-out);
		color: #ffffff;
		border: 1px solid transparent;
		backdrop-filter: blur(8px);
	}

	.toast-close {
		background: none;
		border: none;
		color: rgba(255, 255, 255, 0.75);
		cursor: pointer;
		padding: 0.25rem;
		font-size: 1rem;
		transition: color var(--duration-fast) var(--ease-out);
		flex-shrink: 0;
	}

	.toast-close:hover {
		color: #ffffff;
	}

	.toast-success {
		background-color: rgba(16, 185, 129, 0.92);
		border-color: rgba(16, 185, 129, 0.4);
	}

	.toast-error {
		background-color: rgba(239, 68, 68, 0.92);
		border-color: rgba(239, 68, 68, 0.4);
	}

	.toast-info {
		background-color: rgba(20, 184, 166, 0.92);
		border-color: rgba(20, 184, 166, 0.4);
	}

	.toast-warning {
		background-color: rgba(245, 158, 11, 0.95);
		border-color: rgba(245, 158, 11, 0.4);
		color: #1c1917;
	}

	.toast-warning .toast-close {
		color: rgba(28, 25, 23, 0.65);
	}

	.toast-warning .toast-close:hover {
		color: #1c1917;
	}
</style>