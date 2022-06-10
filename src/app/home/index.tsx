import Vue from "vue";
import VueRouter from "vue-router";
import ElementUI from "element-ui";
import router from "./router";

Vue.use(VueRouter);
Vue.use(ElementUI);

new Vue({
  router,
  render() {
    return <router-view />;
  },
}).$mount("#app");
