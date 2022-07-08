import Vue from "vue";
import VueRouter from "vue-router";
import NotFound from "../views/NotFound.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/categories",
    name: "category",
    component: () =>
      import(
        /* webpackChunkName: "categories" */ "../views/category/Category.vue"
      ),
  },
  {
    path: "/publicity",
    name: "publicity",
    component: () => import("../views/publicity/Publicity.vue"),
  },
  {
    path: "*",
    name: "error",
    component: NotFound,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  linkActiveClass: "active",
  linkExactActiveClass: "active"
});



export default router;
