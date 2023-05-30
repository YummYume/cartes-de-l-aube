import { IconCards, IconClick, IconHome, IconPlayerPlay } from '@tabler/icons-vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import SideBar from '@/components/SideBar.vue';
import router from '@/router';

describe('SideBar', () => {
  const plugins = [router];
  const items = [
    { label: 'Home', to: '/', icon: IconHome },
    { label: 'Play', to: '/play', icon: IconPlayerPlay },
    { label: 'Squad', to: '/squad', icon: IconCards },
  ];

  it('renders the component', () => {
    const wrapper = mount(SideBar, { global: { plugins } });

    expect(wrapper.exists()).toBe(true);
  });

  it('renders the correct number of items', () => {
    const wrapper = mount(SideBar, {
      global: { plugins },
      props: {
        items,
      },
    });
    const renderedItems = wrapper.findAll('.flex > ol > li');

    expect(renderedItems.length).toBe(items.length);
  });

  it('renders the correct label for each item', () => {
    const wrapper = mount(SideBar, {
      global: { plugins },
      props: {
        items,
      },
    });
    const renderedItems = wrapper.findAll('.flex > ol > li');

    renderedItems.forEach((item, index) => {
      expect(item.text()).toBe(items[index].label);
    });
  });

  it('renders the correct icon for each item', () => {
    const wrapper = mount(SideBar, {
      global: { plugins },
      props: {
        items,
      },
    });
    const renderedItems = wrapper.findAll('.flex > ol > li');

    renderedItems.forEach((item, index) => {
      const icon = item.find('svg');

      if (icon) {
        const IconComponent = items[index].icon;
        const mountedIcon = mount(IconComponent, {
          props: {
            class: 'h-6 w-6',
          },
        });

        expect(mountedIcon.html()).toBe(icon.html());
      }
    });
  });

  it('emits an event when an item with onClick is clicked', async () => {
    const wrapper = mount(SideBar, {
      global: { plugins },
      props: {
        items: [
          {
            label: 'Click',
            icon: IconClick,
            onClick: () => {
              wrapper.vm.$emit('clicked');
            },
          },
          ...items,
        ],
      },
    });
    const renderedItems = wrapper.findAll('.flex > ol > li > button');

    await renderedItems[0].trigger('click');
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted().clicked).toBeTruthy();
  });
});
