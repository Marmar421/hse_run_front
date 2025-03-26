<template>
    <div>
        <HomeHeader />  
      <h1>{{ $t('previousQuests.title') }}</h1>
      <p>{{ $t('previousQuests.description') }}</p>
      <HomeFooter />
    </div>
</template>

<script>
import HomeHeader from '@/components/Home/HomeHeader.vue';
import HomeFooter from '@/components/Home/HomeFooter.vue';
import LanguageSwitcher from '@/components/UI/LanguageSwitcher.vue';

export default {
  name: 'PreviousView',
  components: {
    HomeHeader,
    HomeFooter,
    LanguageSwitcher
  }
}
</script>

