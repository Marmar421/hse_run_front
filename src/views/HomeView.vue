<!-- src/views/HomeView.vue -->
<template>
  <div class="home">
    <HomeHeader />
    <main>
      <HomeStart/>
      Тут будет картинка 
      <HomeParticipation />
      Тут будут фотографии
      <HomeFAQ/>
      <HomePartners/>
    </main>
    <HomeFooter />
  </div>
</template>

<script>
import HomePartners from '@/components/Home/HomePartners.vue';
import HomeFAQ from '@/components/Home/HomeFAQ.vue';
import HomeStart from '@/components/Home/HomeStart.vue';
import HomeHeader from '@/components/Home/HomeHeader.vue';
import HomeParticipation from '@/components/Home/HomeParticipation.vue';
import HomeFooter from '@/components/Home/HomeFooter.vue';
import ProfileMain from '@/components/Profile/ProfileMain.vue';

export default {
  name: 'HomeView',
  components: {
    HomeHeader,
    HomeStart,
    HomeParticipation,
    HomeFAQ,
    HomePartners,
    HomeFooter,
    ProfileMain
  },
};
</script>

<style scoped>
</style>
