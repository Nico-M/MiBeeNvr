<script lang="ts">
  import { t } from '$lib/i18n';
  import { Settings, Cpu, AlertTriangle } from 'lucide-svelte';
  import Tab from '$lib/components/Tab.svelte';
  import GeneralTab from './settings/GeneralTab.svelte';
  import FeaturesTab from './settings/FeaturesTab.svelte';
  import AdvancedTab from './settings/AdvancedTab.svelte';

  let activeSettingsTab = $state('general');
  let settingsTabs = $derived([
    { id: 'general', label: t('settings.tabs.general'), shortLabel: 'Gen', icon: Settings },
    { id: 'features', label: t('settings.tabs.features'), shortLabel: 'Feat', icon: Cpu },
    { id: 'advanced', label: t('settings.tabs.advanced'), shortLabel: 'Adv', icon: AlertTriangle },
  ]);
</script>

<div class="min-h-screen th-bg-primary pt-[var(--navbar-height)]">
  <main class="page-shell">
    <div class="mb-6">
      <h2 class="page-title">{t('settings.title')}</h2>
    </div>
    <Tab tabs={settingsTabs} activeTab={activeSettingsTab} onchange={(id) => activeSettingsTab = id} />
    <div class="space-y-6 mt-6">
      {#if activeSettingsTab === 'general'}
        <GeneralTab />
      {:else if activeSettingsTab === 'features'}
        <FeaturesTab />
      {:else if activeSettingsTab === 'advanced'}
        <AdvancedTab />
      {/if}
    </div>
  </main>
</div>
