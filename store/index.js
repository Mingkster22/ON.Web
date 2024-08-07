import utils from '@/assets/js/utils';
import userBookmarks from './userBookmarks';

export const state = () => ({
  isDrawerOpen: false
});

export const getters = {};

export const actions = {
  async nuxtServerInit({ commit, dispatch }, { req }) {
    const success = await dispatch('settings/fetchSettings', null, { root: true });
    if (success) {
      var cookies = req.headers.cookie ? utils.parseCookies(req.headers.cookie) : null;
      if (cookies && cookies.ontoken) {
        var ontoken = cookies.ontoken;
        commit('auth/setToken', ontoken, { root: true });
        await dispatch('auth/fetchUser', null, { root: true });
      }
    }
  }
};

export const mutations = {
  setDrawerOpen(state, val) {
    state.isDrawerOpen = val;
  }
};

export const modules = {
  userBookmarks
};
