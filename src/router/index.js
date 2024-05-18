import Vue from "vue";
import VueRouter from "vue-router";
import LoginView from "@/views/loginView.vue";
import documentosView from "@/views/Documentos/documentosView.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "login",
    component: LoginView,
  },
  {
    path: "/lista-documentos",
    name: "lista-documentos",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
    component: documentosView,
    meta: { requiresAuth: true },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("access_token");
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!token) {
      if (this.$route.path !== "/") {
        this.$router.push('/');
      }
    } else {
      // Puedes agregar aquí lógica adicional para validar el token si es necesario
      next();
    }
  } else {
    next();
  }
});

export default router;
