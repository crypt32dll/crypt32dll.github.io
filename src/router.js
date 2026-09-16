import Vue from "vue";
import Router from "vue-router";
import DateAskPage from "./views/DateAskPage.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "DateAsk",
      component: DateAskPage,
    },
    {
      path: "*",
      redirect: "/",
    },
  ],
  scrollBehavior: () => ({ x: 0, y: 0 }),
});
