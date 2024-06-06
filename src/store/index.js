import { createStore } from 'vuex';

const store = createStore({
  state: {
    isLoggedIn: false,
    userRole: '',
  },
  mutations: {
    setLoggedIn(state, isLoggedIn) {
      state.isLoggedIn = isLoggedIn;
    },
    setUserRole(state, userRole) {
      state.userRole = userRole;
    },
  },
  actions: {
    login({ commit }, { token, userRole }) {
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', userRole);
      commit('setLoggedIn', true);
      commit('setUserRole', userRole);
    },
    logout({ commit }) {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      commit('setLoggedIn', false);
      commit('setUserRole', '');
    },
    checkUserInfo({ commit }) {
      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('userRole');
      if (token && userRole) {
        commit('setLoggedIn', true);
        commit('setUserRole', userRole);
      }
    },
  },
});

export default store;