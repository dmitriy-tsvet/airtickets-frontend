<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
import store from './store';

export default {
  store,
  data: () => ({
    isClickEventAttached: false
  }),
  mounted() {
    // window.Telegram.WebApp.onEvent('backButtonClicked', () => {
    //   this.$router.push({ path: '/'});
    // })

    window.Telegram.WebApp.onEvent('invoiceClosed', (data) => {
      window.Telegram.WebApp.BackButton.hide()
      window.Telegram.WebApp.MainButton.hide()
      if (data.status === "paid") {
        this.$router.push({ path: '/successfulPaid'});
      }
      else {
        this.$router.push({ path: '/failedPaid'});
      }
    });
  }
}

</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap');
@import url('https://fonts.cdnfonts.com/css/sf-pro-display');

html, body {
  font-family: 'SF Pro Display', sans-serif !important;
  color: var(--tg-theme-text-color);
  background-color: var(--tg-theme-bg-color);
  touch-action: manipulation !important;
}

p {
  color: var(--tg-theme-hint-color);
}


</style>