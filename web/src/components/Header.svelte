<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { t } from '$lib/i18n';
  import { logout, getSettings } from '$lib/api';
  import { getMiBeeVisionConnected, refreshMiBeeVisionStatus } from '$lib/mibeevision-status';
  import { getEffectiveTheme } from '$lib/preferences';
  import LanguageSwitcher from './LanguageSwitcher.svelte';
  import ThemeToggle from './ThemeToggle.svelte';
  import Toast from './Toast.svelte';
  import { ArrowLeft, Menu, LogOut } from 'lucide-svelte';

  // Props
  let {
    activeRoute = '',
    showBack = false,
    backLabel = ''
  }: {
    activeRoute?: string;
    showBack?: boolean;
    backLabel?: string;
  } = $props();

  // MiBeeVision connection status (shared reactive store)
  let miBeeVisionConnected = $derived(getMiBeeVisionConnected());

  // Mobile menu state
  let mobileMenuOpen = $state(false);

  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }

  function closeMobileMenu() {
    mobileMenuOpen = false;
  }

  function handleNavClick(event: Event) {
    closeMobileMenu();
  }

  // Hash change listener to keep activeRoute in sync
  function handleHashChange() {
    const hash = window.location.hash.replace('#', '') || '/surveillance';
    activeRoute = hash;
  }

  onMount(() => {
    // Sync theme — use getEffectiveTheme to handle null (system preference)
    const effectiveTheme = getEffectiveTheme();
    document.documentElement.setAttribute('data-theme', effectiveTheme);

    // Sync active route from current hash
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);

    // Check MiBeeVision API key status
    void refreshMiBeeVisionStatus();
  });

  onDestroy(() => {
    window.removeEventListener('hashchange', handleHashChange);
  });

  // Navigation items — AI Events only shown when MiBeeVision is configured
  let navItems = $derived([
    { href: '#/surveillance', labelKey: 'nav.surveillance', route: '/surveillance' },
    { href: '#/cameras', labelKey: 'nav.cameras', route: '/cameras' },
    { href: '#/recordings', labelKey: 'nav.recordings', route: '/recordings' },
    ...(miBeeVisionConnected ? [{ href: '#/ai-events', labelKey: 'nav.aiEvents', route: '/ai-events' }] : []),
    { href: '#/dashboard', labelKey: 'nav.dashboard', route: '/dashboard' },
    { href: '#/settings', labelKey: 'nav.settings', route: '/settings' },
  ]);

  function isActive(route: string): boolean {
    return activeRoute === route || activeRoute.startsWith(route + '/');
  }

  function goBack() {
    window.history.back();
  }
</script>

<header class="navbar glass">
  <div class="navbar-inner">
    <div class="navbar-left">
      {#if showBack}
        <button class="back-btn" onclick={goBack}>
          <ArrowLeft size={20} />
          <span>{backLabel || t('detail.back')}</span>
        </button>
      {/if}
      <a href="#/surveillance" class="logo">MiBee NVR</a>
      
      <!-- Desktop Navigation -->
      <nav class="nav-links">
        {#each navItems as item}
          <a
            href={item.href}
            class="nav-link"
            class:active={isActive(item.route)}
            aria-label={t(item.labelKey)}
          >
            {t(item.labelKey)}
          </a>
        {/each}
      </nav>
      
      <!-- Mobile Hamburger Button -->
      <button
        class="hamburger-btn md:hidden"
        onclick={toggleMobileMenu}
        aria-label="Toggle navigation menu"
        aria-expanded={mobileMenuOpen}
      >
        <Menu size={20} />
      </button>
    </div>
    
    <!-- Mobile Menu Overlay -->
    <div class="mobile-menu md:hidden" class:open={mobileMenuOpen}>
      <nav class="mobile-nav-links">
        {#each navItems as item}
          <a
            href={item.href}
            class="mobile-nav-link"
            class:active={isActive(item.route)}
            onclick={handleNavClick}
          >
            {t(item.labelKey)}
          </a>
        {/each}
      </nav>
    </div>
    
    <div class="navbar-right">
      <ThemeToggle />
      <LanguageSwitcher />
      <button class="btn btn-ghost logout-btn" onclick={logout}>
        <LogOut size={20} />
        <span>{t('nav.logout')}</span>
      </button>
    </div>
  </div>
</header>

<!-- Toast container — rendered at top level so it's always visible -->
<Toast />

<style>
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    height: var(--navbar-height);
    border-bottom: 1px solid var(--border);
  }

  .navbar-inner {
    max-width: var(--content-max);
    margin: 0 auto;
    padding: 0 1rem;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  @media (min-width: 640px) {
    .navbar-inner {
      padding: 0 1.5rem;
    }
  }

  @media (min-width: 1024px) {
    .navbar-inner {
      padding: 0 2rem;
    }
  }

  .navbar-left {
    display: flex;
    align-items: center;
    gap: 1rem;
    min-width: 0;
  }

  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    color: var(--text-secondary);
    background: none;
    border: none;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    padding: 0.375rem 0.625rem;
    border-radius: var(--radius-sm);
    transition:
      color var(--duration-fast) var(--ease-out),
      background-color var(--duration-fast) var(--ease-out);
  }

  .back-btn:hover {
    color: var(--text-primary);
    background-color: var(--bg-tertiary);
  }

  .logo {
    font-size: 1.0625rem;
    font-weight: 650;
    letter-spacing: -0.03em;
    text-decoration: none;
    white-space: nowrap;
    color: var(--text-primary);
  }

  .logo:hover {
    color: var(--color-primary-light);
  }

  .nav-links {
    display: none;
    gap: 0.125rem;
    align-items: center;
  }

  @media (min-width: 768px) {
    .nav-links {
      display: flex;
    }
  }

  .nav-link {
    position: relative;
    padding: 0.4rem 0.7rem;
    border-radius: var(--radius-sm);
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--text-secondary);
    text-decoration: none;
    transition:
      color var(--duration-fast) var(--ease-out),
      background-color var(--duration-fast) var(--ease-out);
  }

  .nav-link:hover {
    color: var(--text-primary);
    background-color: var(--bg-hover);
  }

  .nav-link.active {
    color: var(--text-primary);
    background: rgba(var(--color-primary-rgb), 0.12);
  }

  .nav-link.active::after {
    content: '';
    position: absolute;
    left: 0.7rem;
    right: 0.7rem;
    bottom: 0.15rem;
    height: 2px;
    border-radius: 999px;
    background: var(--color-primary);
  }

  .navbar-right {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    flex-shrink: 0;
  }

  .logout-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
  }

  @media (max-width: 639px) {
    .logout-btn span {
      display: none;
    }
  }

  .hamburger-btn {
    display: none;
    background: none;
    border: none;
    color: var(--text-primary);
    cursor: pointer;
    padding: 0.5rem;
    transition: background-color var(--duration-fast) var(--ease-out);
    border-radius: var(--radius-sm);
  }

  .hamburger-btn:hover {
    background-color: var(--bg-tertiary);
  }

  @media (max-width: 767px) {
    .hamburger-btn {
      display: flex;
    }
  }

  .mobile-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--glass-bg);
    backdrop-filter: blur(var(--glass-blur));
    -webkit-backdrop-filter: blur(var(--glass-blur));
    border: 1px solid var(--border);
    border-top: none;
    max-height: 0;
    overflow: hidden;
    transition:
      max-height var(--duration-normal) var(--ease-out),
      opacity var(--duration-normal) var(--ease-out);
    opacity: 0;
  }

  .mobile-menu.open {
    max-height: calc(100dvh - var(--navbar-height));
    opacity: 1;
    box-shadow: var(--shadow-lg);
    border-bottom: 1px solid var(--border);
  }

  .mobile-nav-links {
    display: flex;
    flex-direction: column;
    padding: 0.5rem;
    gap: 0.125rem;
  }

  .mobile-nav-link {
    padding: 0.7rem 1rem;
    border-radius: var(--radius-sm);
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-secondary);
    text-decoration: none;
    transition:
      color var(--duration-fast) var(--ease-out),
      background-color var(--duration-fast) var(--ease-out);
    white-space: nowrap;
    border-left: 2px solid transparent;
  }

  .mobile-nav-link:hover {
    color: var(--text-primary);
    background-color: var(--bg-tertiary);
  }

  .mobile-nav-link.active {
    background: rgba(var(--color-primary-rgb), 0.12);
    color: var(--text-primary);
    border-left-color: var(--color-primary);
  }
</style>
