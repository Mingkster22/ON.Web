<template>
  <div class="fixed top-0 left-0 w-screen flex items-center h-16 sm:h-20 px-4 md:px-8 bg-bg border-b border-grayscale-400 shadow-sm z-10">
    <button v-if="showHamburger" class="mr-4 md:mr-6 flex" @click="hamburgerClick">
      <span class="material-icons text-2xl md:text-3xl text-white/80">menu</span>
    </button>

    <div class="w-52 min-w-[208px] md:w-80 md:min-w-80">
      <nuxt-link to="/" class="flex items-center">
        <span v-if="!ProfileImageAssetId" class="material-icons-outlined text-4xl">desktop_mac</span>
        <img v-else :src="profileImageUrl" class="h-8 md:h-10 w-8 md:w-10 object-cover" />
        <p class="text-base sm:text-lg md:text-xl font-medium pl-3">{{ SiteTitle }}</p>
      </nuxt-link>
    </div>
    <div class="flex-grow sm:px-6">
      <ui-search-input placeholder="Search" class="hidden lg:block" />
    </div>
    <div class="md:w-80 md:min-w-80 px-2 h-full">
      <div v-if="!isAuthenticated" class="h-full flex items-center justify-end">
        <nuxt-link to="/login" class="font-bold text-xl text-accent">Login/Register</nuxt-link>
      </div>
      <div v-else class="h-full flex items-center justify-end">
        <nuxt-link to="/bookmarks" class="outline-none mx-3 hidden sm:flex">
          <span class="material-icons-outlined text-2xl">bookmark_border</span>
        </nuxt-link>
        <widgets-account-dropdown-menu />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      windowWidth: 0
    }
  },
  computed: {
    showHamburger() {
      return !this.isHome || (this.windowWidth && this.windowWidth < 1280)
    },
    isAuthenticated() {
      return this.$store.getters['auth/isAuthenticated']
    },
    ProfileImageAssetId() {
      return this.$store.getters['settings/ProfileImageAssetId']
    },
    SiteTitle() {
      return this.$store.getters['settings/Title']
    },
    profileImageUrl() {
      return `${this.$config.baseURL}/api/cms/asset/${this.ProfileImageAssetId}/data`
    },
    isHome() {
      return this.$route.path === '/'
    }
  },
  methods: {
    hamburgerClick() {
      this.$store.commit('setDrawerOpen', true)
    },
    resize() {
      this.windowWidth = window.innerWidth
    }
  },
  mounted() {
    this.windowWidth = window.innerWidth
    window.addEventListener('resize', this.resize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize)
  }
}
</script>
