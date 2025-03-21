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
    background-color: #F3F3F3;
    padding: 20px;
    text-align: center;
    margin-top: auto; /* Важно для прилипания футера */
}

.nav-link {
    color: #4369AC;
    margin: 0 15px;
    text-decoration: none;
    transition: color 0.3s;
}

.nav-link:hover {
    color: #2c4e8c;
    text-decoration: underline;
}

p {
    margin: 10px 0;
    color: #666;
    font-size: 14px;
}
</style>