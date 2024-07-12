<template>
  <div class="bookmarks-page py-8 px-4 md:px-8">
    <h1 class="text-3xl font-bold mb-6">Your Bookmarks</h1>
    <div v-for="post in savedPosts" :key="post.ContentID" class="rounded-lg p-4 mb-4">
      <h2 class="text-xl font-semibold mb-2">{{ post.Data.Title }}</h2>
      <p class="text-gray-600" v-html="post.Data.Written.HtmlBody"></p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters('userBookmarks', ['savedPosts'])
  }
};
</script>
