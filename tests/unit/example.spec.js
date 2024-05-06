import Vue from "vue";
import { shallowMount, createLocalVue } from "@vue/test-utils";
import tag from "@/components/tags";
import ElementUI from "element-ui";
import Aside from "../../src/components/Aside.vue";
import { CopyObj } from "../../src/plugins/until";
import VueRouter from "vue-router";

const localVue = createLocalVue();
localVue.use(ElementUI);
localVue.use(VueRouter);

const router = new VueRouter();
const res = {
  data: {
    code: 0,
    data: {
      roleName: "aa"
    }
  }
};

describe("tag.vue", () => {
  const tagList = [
    { name: "标签1", type: "info" },
    { name: "标签2", type: "info" },
    { name: "标签3", type: "info" },
    { name: "标签4", type: "info" },
    { name: "标签5", type: "info" }
  ];

  it("测试tag子组件 的渲染", async () => {
    const wrapper = shallowMount(tag, {
      localVue
    });
    expect(wrapper.findAll(".tag").length).toBe(5);
  });

  it("测试删除功能", async () => {
    const wrapper = shallowMount(tag, {
      propsData: { tagList },
      localVue
    });

    wrapper.vm.close({ name: "标签5", type: "info" });
    await wrapper.setProps({ tagList: CopyObj(wrapper.vm.tagList) });
    expect(
      wrapper.findAll(".tag").filter(w => w.text() === "标签5").length
    ).toBe(0);
  });
});

describe("Aside组件", () => {
  localVue.prototype.$axios = {
    post: () => new Promise(resolve => resolve(res))
  };
  const wrapper = shallowMount(Aside, {
    localVue,
    router
  });
  it("mounted测试", async () => {
    const wrapper = shallowMount(Aside, { localVue, router });
    await Vue.nextTick();
    expect(wrapper.vm.roleName).toMatch(/\w+/);
  });
  it("ClickIndex测试", () => {
    wrapper.vm.ClickIndex(100);
    expect(wrapper.vm.index).toBe(100);
  });
  it("gopath测试", () => {
    const push = jest.spyOn(wrapper.vm.$router, "push");
    wrapper.vm.gopath("/");
    expect(push).toBeCalled();
  });
  test("menuHover测试", () => {
    wrapper.vm.menuHover();
    expect(wrapper.vm.hideText).toBe(false);
  });
  it("mouseOut测试", async () => {
    wrapper.vm.$refs.homeLeft = { offsetWidth: 50 };
    wrapper.vm.mouseOut();
    await setTimeout(() => {
      expect(wrapper.vm.hideText).toBe(true);
    }, 1000);
  });
  it("监听hideText测试", async () => {
    wrapper.setData({ hideText: false });
    await Vue.nextTick();
    expect(wrapper.vm.hideText).toBe(false);
    wrapper.vm.$refs.homeLeft = { offsetWidth: 50 };
    wrapper.setData({ hideText: true });
    await Vue.nextTick();
    expect(wrapper.vm.hideText).toBe(true);
    expect(wrapper.vm.index).toBe(-1);
  });
});