export const state = () => ({
  savedPosts: []
});

export const mutations = {
  ADD_SAVED_POST(state, post) {
    state.savedPosts.push(post);
  },
  REMOVE_SAVED_POST(state, postId) {
    state.savedPosts = state.savedPosts.filter(post => post.ContentID !== postId);
  }
};

export const actions = {
  addSavedPost({ commit }, post) {
    commit('ADD_SAVED_POST', post);
  },
  removeSavedPost({ commit }, postId) {
    commit('REMOVE_SAVED_POST', postId);
  }
};

export const getters = {
  savedPosts: state => state.savedPosts
};
