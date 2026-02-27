import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AppInput from '@/components/ui/AppInput.vue'

describe('AppInput', () => {
  it('renderiza o label corretamente', () => {
    const wrapper = mount(AppInput, {
      props: { label: 'Email' },
    })
    expect(wrapper.find('label').text()).toBe('Email')
  })

  it('não renderiza label quando não fornecido', () => {
    const wrapper = mount(AppInput)
    expect(wrapper.find('label').exists()).toBe(false)
  })

  it('exibe mensagem de erro', () => {
    const wrapper = mount(AppInput, {
      props: { error: 'Campo obrigatório' },
    })
    expect(wrapper.text()).toContain('Campo obrigatório')
  })

  it('exibe hint quando não há erro', () => {
    const wrapper = mount(AppInput, {
      props: { hint: 'Digite seu email' },
    })
    expect(wrapper.text()).toContain('Digite seu email')
  })

  it('não exibe hint quando há erro', () => {
    const wrapper = mount(AppInput, {
      props: { hint: 'Digite seu email', error: 'Campo obrigatório' },
    })
    expect(wrapper.text()).not.toContain('Digite seu email')
    expect(wrapper.text()).toContain('Campo obrigatório')
  })

  it('aplica borda vermelha quando há erro', () => {
    const wrapper = mount(AppInput, {
      props: { error: 'Erro' },
    })
    expect(wrapper.find('input').classes()).toContain('border-red-400')
  })

  it('aplica borda padrão quando não há erro', () => {
    const wrapper = mount(AppInput)
    expect(wrapper.find('input').classes()).toContain('border-zinc-700')
  })

  it('associa label ao input pelo id', () => {
    const wrapper = mount(AppInput, {
      props: { label: 'Email', inputId: 'email-field' },
    })
    expect(wrapper.find('label').attributes('for')).toBe('email-field')
    expect(wrapper.find('input').attributes('id')).toBe('email-field')
  })

  it('define aria-invalid quando há erro', () => {
    const wrapper = mount(AppInput, {
      props: { error: 'Erro' },
    })
    expect(wrapper.find('input').attributes('aria-invalid')).toBe('true')
  })
})
