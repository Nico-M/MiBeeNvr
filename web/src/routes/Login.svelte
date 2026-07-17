<script lang="ts">
  import { login, isAuthenticated } from '$lib/api';
  import ThemeToggle from '../components/ThemeToggle.svelte';
  import LanguageSwitcher from '../components/LanguageSwitcher.svelte';
  import { t } from '$lib/i18n';
  import { Eye, EyeOff } from 'lucide-svelte';

  let username = $state('');
  let password = $state('');
  let showPassword = $state(false);
  let error = $state('');
  let loginErrors = $state({ username: '', password: '' });
  let loading = $state(false);
  // Force re-render when language changes


  // Redirect if already logged in
  if (isAuthenticated()) {
    window.location.hash = '#/surveillance';
  }

  function validateUsername() {
    if (!username.trim()) {
      loginErrors.username = t('login.usernameRequired');
    } else {
      loginErrors.username = '';
    }
  }

  function validatePassword() {
    if (!password) {
      loginErrors.password = t('login.passwordRequired');
    } else {
      loginErrors.password = '';
    }
  }

  function onUsernameInput() { if (loginErrors.username) loginErrors.username = ''; }
  function onPasswordInput() { if (loginErrors.password) loginErrors.password = ''; }

  async function handleSubmit() {
    validateUsername();
    validatePassword();
    if (loginErrors.username || loginErrors.password) return;

    error = '';
    loading = true;

    try {
      await login(username, password);
      // Redirect to surveillance on success
      window.location.hash = '#/surveillance';
    } catch (e) {
      if (e instanceof Error && e.message === 'setup_required') {
        window.location.hash = '#/setup';
        return;
      }
      error = e instanceof Error ? e.message : t('login.failed');
    } finally {
      loading = false;
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  }
</script>

<div class="login-page min-h-[100dvh] flex items-center justify-center th-bg-primary px-4">
  <div class="fixed top-4 right-4 flex items-center gap-2 z-50">
    <ThemeToggle />
    <LanguageSwitcher />
  </div>

  <div class="card card-flat w-full max-w-md p-8 sm:p-10 border th-border">
    <div class="mb-8">
      <div class="flex items-center gap-2 mb-6">
        <span class="brand-mark" aria-hidden="true"></span>
        <span class="text-sm font-semibold tracking-[0.14em] uppercase th-text-tertiary">MiBee NVR</span>
      </div>
      <h1 class="text-2xl sm:text-[1.75rem] font-semibold tracking-tight th-text-primary mb-2">{t('login.title')}</h1>
      <p class="th-text-tertiary text-sm leading-relaxed">{t('login.subtitle')}</p>
    </div>

    {#if error}
      <div class="mb-6 p-3 bg-[rgba(239,68,68,0.12)] border th-border-danger rounded-[var(--radius-sm)] th-color-danger text-sm">
        {error}
      </div>
    {/if}

    <form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-5">
      <div>
        <label for="username" class="input-label">{t('login.username')}</label>
        <input
          id="username"
          type="text"
          class="input {loginErrors.username ? 'input-error' : ''}"
          bind:value={username}
          placeholder={t('login.usernamePlaceholder')}
          disabled={loading}
          onkeydown={handleKeydown}
          onblur={validateUsername}
          oninput={onUsernameInput}
          autocomplete="username"
        />
        {#if loginErrors.username}
          <p class="th-color-danger text-xs mt-1.5">{loginErrors.username}</p>
        {/if}
      </div>

      <div>
        <label for="password" class="input-label">{t('login.password')}</label>
        <div class="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            class="input pr-10 {loginErrors.password ? 'input-error' : ''}"
            bind:value={password}
            placeholder={t('login.passwordPlaceholder')}
            disabled={loading}
            onkeydown={handleKeydown}
            onblur={validatePassword}
            oninput={onPasswordInput}
            autocomplete="current-password"
          />
          <button
            type="button"
            class="absolute right-2 top-1/2 -translate-y-1/2 th-text-tertiary hover:th-text-primary transition-colors p-1"
            onclick={() => showPassword = !showPassword}
            aria-label={showPassword ? t('common.hidePassword') : t('common.showPassword')}
          >
            {#if showPassword}
              <EyeOff class="w-4 h-4" />
            {:else}
              <Eye class="w-4 h-4" />
            {/if}
          </button>
        </div>
        {#if loginErrors.password}
          <p class="th-color-danger text-xs mt-1.5">{loginErrors.password}</p>
        {/if}
      </div>

      <button type="submit" class="btn btn-primary w-full mt-1" disabled={loading}>
        {#if loading}
          <span class="spinner"></span>
          {t('login.signingIn')}
        {:else}
          {t('login.signIn')}
        {/if}
      </button>
    </form>

    <div class="mt-8 text-center text-xs th-text-tertiary">
      <p class="border-t th-border pt-5">{t('login.secureNote')}</p>
    </div>
  </div>
</div>

<style>
  .login-page {
    background:
      radial-gradient(ellipse 80% 50% at 50% -20%, rgba(var(--color-primary-rgb), 0.12), transparent 55%),
      var(--bg-primary);
  }

  .brand-mark {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 999px;
    background: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.18);
  }
</style>
