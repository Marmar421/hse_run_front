<template>
    <section class="HomeFooter">
    <router-link to="/" class="nav-link">{{ $t('header.about') }}</router-link>
    <router-link to="/previous" class="nav-link">{{ $t('header.previousQuests') }}</router-link>
    <router-link to="/registration" class="nav-link">{{ $t('header.registration') }}</router-link>
    <p>{{ $t('footer.coordinator') }}</p>
    <p> {{ $t('footer.copyright') }}</p> 
    </section>
    
</template>

<script>  
import LanguageSwitcher from '@/components/UI/LanguageSwitcher.vue';
export default {
    name: 'HomeFooter',
    components: {
        LanguageSwitcher,
    },
}
</script>

<style scoped>
.HomeFooter {
    padding-top: 143px;

    display: flex;
    flex-direction: column;
    align-items: start;
    max-width: 1360px;
    margin: 0 auto;
    background-color: #F3F3F3;
    font-size: 32px;
    gap: 12px;
    font-family: 'InvolveMedium';
}

.nav-link {
    color: #000000;
    text-decoration: none;
    transition: font-family 0.3s;
}

.nav-link:hover {
    font-family: 'InvolveBold';
}

p {
    margin: 0;
    color: #666;
    font-size: 14px;
}
</style>