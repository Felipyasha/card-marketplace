import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AppButton from '@/components/ui/AppButton.vue'

describe('AppButton', () => {
  it('renderiza o slot corretamente', () => {
    const wrapper = mount(AppButton, {
      slots: { default: 'Clique aqui' },
    })
    expect(wrapper.text()).toBe('Clique aqui')
  })

  it('aplica a variante primary por padrão', () => {
    const wrapper = mount(AppButton)
    expect(wrapper.classes()).toContain('bg-orange-600')
  })

  it('aplica a variante ghost corretamente', () => {
    const wrapper = mount(AppButton, {
      props: { variant: 'ghost' },
    })
    expect(wrapper.classes()).toContain('border-zinc-700')
  })

  it('aplica a variante danger corretamente', () => {
    const wrapper = mount(AppButton, {
      props: { variant: 'danger' },
    })
    expect(wrapper.classes()).toContain('text-red-400')
  })

  it('desabilita o botão quando loading é true', () => {
    const wrapper = mount(AppButton, {
      props: { loading: true },
    })
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('exibe spinner quando loading é true', () => {
    const wrapper = mount(AppButton, {
      props: { loading: true },
    })
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('aplica w-full quando fullWidth é true', () => {
    const wrapper = mount(AppButton, {
      props: { fullWidth: true },
    })
    expect(wrapper.classes()).toContain('w-full')
  })

  it('emite click ao ser clicado', async () => {
    const wrapper = mount(AppButton)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
