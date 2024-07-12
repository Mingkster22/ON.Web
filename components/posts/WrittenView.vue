<template>
  <div class="w-full max-w-3xl mx-auto h-full py-4">
    <div v-if="featuredImageSrc" class="w-full aspect-[2] rounded-3xl overflow-hidden">
      <img :src="featuredImageSrc" class="w-full object-cover" />
    </div>
    <div class="py-4 w-full">
      <h2 class="text-2xl font-bold mb-1">{{ Title }}</h2>
      <div class="flex items-center py-1">
        <p class="text-gray-300 font-bold text-sm">{{ publishDateDistance }} by {{ Author }}</p>
        <div class="flex-grow" />
        <button class="flex items-center mx-3" :class="LikedByUser ? 'text-accent-darker hover:text-accent' : 'text-grayscale-900 hover:text-white'" @click.stop="likeClick">
          <span class="material-icons-outlined text-2xl">favorite_border</span>
          <p class="pl-1.5 text-sm font-bold">{{ Likes || 'Like' }}</p>
        </button>
        <div class="flex items-center text-grayscale-900 hover:text-white cursor-pointer mx-3">
          <span class="material-icons-outlined text-2xl">share</span>
          <p class="pl-1.5 text-sm font-bold">Share</p>
        </div>
        <button class="flex items-center mx-3" :class="SavedByUser ? 'text-accent-darker hover:text-accent' : 'text-grayscale-900 hover:text-white'" @click.stop="saveClick">
          <span class="material-icons-outlined text-2xl">bookmark_border</span>
          <p class="pl-1.5 text-sm font-bold">{{ saveStatusText }}</p>
        </button>
      </div>
      <div class="flex justify-end py-3 -mx-1">
        <ui-tag-pill v-for="tag in Tags" :key="tag" :tag="tag" class="mx-1" />
      </div>
      <div class="py-4">
        <div class="rich-text prose prose-invert w-full max-w-none" v-html="HtmlBody" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  props: {
    content: {
      type: Object,
      default: () => {}
    },
    stats: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      userLikedNow: undefined,
      userSavedNow: undefined
    }
  },
  computed: {
    ContentID() {
      return this.content.ContentID;
    },
    ContentData() {
      return this.content.Data || {}
    },
    Title() {
      return this.content.Data.Title;
    },
    Author() {
      return this.ContentData.Author
    },
    HtmlBody() {
      return this.ContentData.Written.HtmlBody
    },
    Tags() {
      return this.ContentData.Tags || []
    },
    PublishOnUTC() {
      return this.content.PublishOnUTC || ''
    },
    publishDateDistance() {
      if (!this.$dateDistanceFromNow) return ''
      return this.$dateDistanceFromNow(new Date(this.PublishOnUTC).valueOf())
    },
    FeaturedImageAssetID() {
      return this.ContentData.FeaturedImageAssetID
    },
    featuredImageSrc() {
      if (!this.FeaturedImageAssetID) return null
      return `${this.$config.baseURL}/api/cms/asset/${this.FeaturedImageAssetID}/data`
    },
    statsData() {
      return this.stats.Record || {}
    },
    LikedByUser() {
      if (this.userLikedNow !== undefined) return this.userLikedNow
      return !!this.stats.LikedByUser
    },
    Likes() {
      if (this.LikedByUser) return this.LikesByOtherUsers + 1
      return this.LikesByOtherUsers
    },
    LikesByOtherUsers() {
      if (this.stats.LikedByUser) return Number(this.statsData.Likes || 0) - 1
      return Number(this.statsData.Likes || 0)
    },
    Views() {
      return Number(this.statsData.Views || 0)
    },
    SavedByOtherUsers() {
      return Number(this.statsData.Saves || 0);
    },
    SavedByUser() {
      if (this.userSavedNow !== undefined) return this.userSavedNow;
      return !!this.stats.SavedByUser;
    },
    Saves() {
      if (this.SavedByUser) return this.SavedByOtherUsers + 1;
      return this.SavedByOtherUsers;
    },
    saveStatusText() {
      return this.SavedByUser ? 'Saved' : 'Save';
    }
  },
  methods: {
    ...mapActions('userBookmarks', ['addSavedPost', 'removeSavedPost']),
    likeClick() {
      const currentLikeVal = this.LikedByUser;
      this.userLikedNow = !this.LikedByUser;
      const endpoint = this.userLikedNow ? 'like' : 'unlike';
      this.$axios.$post(`/api/stats/${this.ContentID}/${endpoint}`, { ContentID: this.ContentID }).catch((error) => {
        console.error('Failed to like post', error);
        this.userLikedNow = currentLikeVal;
      });
    },
    saveClick() {
      const currentSaveVal = this.SavedByUser;
      this.userSavedNow = !this.SavedByUser;
      const endpoint = this.userSavedNow ? 'save' : 'unsave';
      this.$axios.$post(`/api/stats/${this.ContentID}/${endpoint}`, { ContentID: this.ContentID })
        .then(() => {
          this.userSavedNow = !currentSaveVal;
          if (this.userSavedNow) {
            this.addSavedPost(this.content);
          } else {
            this.removeSavedPost(this.ContentID);
          }
        })
        .catch((error) => {
          console.error('Failed to save post', error);
          this.userSavedNow = currentSaveVal;
        });
    }
  }
};
</script>