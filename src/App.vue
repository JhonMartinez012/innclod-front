<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <h1>Documentos</h1>
      </div>
      <v-spacer></v-spacer>
      <v-btn v-if="isLoggedIn" outlined @click="logout()">Log out!</v-btn>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //

  }),
  computed:{
    isLoggedIn(){
      return this.$store.state.isLoggin
    }
  },

  methods: {
    logout() {
      localStorage.removeItem('access_token')
      this.$store.commit('setLoggin', false)
      this.$router.push('/')
    }
  }
};
</script>
