import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import CardTile from '@/components/cards/CardTile.vue'
import type { Card } from '@/types'

const mockCard: Card = {
  id: '1',
  name: 'Card A',
  imageUrl: 'http://img.com/a.jpg',
  description: 'Descrição A',
  createdAt: '2024-01-01',
}

describe('CardTile', () => {
  it('renderiza o nome da carta', () => {
    const wrapper = mount(CardTile, {
      props: { card: mockCard },
    })
    expect(wrapper.text()).toContain('Card A')
  })

  it('renderiza a imagem com alt correto', () => {
    const wrapper = mount(CardTile, {
      props: { card: mockCard },
    })
    expect(wrapper.find('img').attributes('alt')).toBe('Card A')
  })

  it('renderiza como div quando não é selecionável', () => {
    const wrapper = mount(CardTile, {
      props: { card: mockCard },
    })
    expect(wrapper.find('button').exists()).toBe(false)
    expect(wrapper.find('div').exists()).toBe(true)
  })

  it('renderiza como button quando é selecionável', () => {
    const wrapper = mount(CardTile, {
      props: { card: mockCard, selectable: true },
    })
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('emite evento select ao clicar quando selecionável', async () => {
    const wrapper = mount(CardTile, {
      props: { card: mockCard, selectable: true },
    })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('select')).toBeTruthy()
    expect(wrapper.emitted('select')?.[0]).toEqual(['1'])
  })

  it('não emite select quando não é selecionável', async () => {
    const wrapper = mount(CardTile, {
      props: { card: mockCard },
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('select')).toBeFalsy()
  })

  it('exibe overlay de selecionado quando selected é true', () => {
    const wrapper = mount(CardTile, {
      props: { card: mockCard, selectable: true, selected: true },
    })
    expect(wrapper.find('button').classes()).toContain('border-orange-500')
  })

  it('define aria-pressed corretamente', () => {
    const wrapper = mount(CardTile, {
      props: { card: mockCard, selectable: true, selected: true },
    })
    expect(wrapper.find('button').attributes('aria-pressed')).toBe('true')
  })

  it('emite select ao pressionar Enter', async () => {
    const wrapper = mount(CardTile, {
      props: { card: mockCard, selectable: true },
    })
    await wrapper.find('button').trigger('keydown.enter')
    expect(wrapper.emitted('select')).toBeTruthy()
  })
})
