import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLoggin : false
  },
  getters: {
    isLoggin: state => state.isLoggin
  },
  mutations: {
    setLoggin(state, value) {
      state.isLoggin = value;
    }
  },
  actions: {},
  modules: {},
});
