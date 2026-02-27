<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import { toast } from 'vue-sonner'

const router = useRouter()
const auth = useAuthStore()
const formError = ref('')

const schema = toTypedSchema(
    z.object({
        email: z.string().email('E-mail inválido'),
        password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
    })
)

const { handleSubmit, defineField, errors } = useForm({ validationSchema: schema })

const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')

const onSubmit = handleSubmit(async (values) => {
    formError.value = ''
    try {
        await auth.login(values.email, values.password)
        toast.success('Bem-vindo de volta!')
        router.push({ name: 'marketplace' })
    } catch (err) {
        formError.value = err instanceof Error ? err.message : 'E-mail ou senha inválidos'
    }
})
</script>

<template>
    <div class="min-h-[80vh] flex items-center justify-center px-4">
        <div class="w-full max-w-md">
            <div class="bg-zinc-800 border border-zinc-700 rounded-xl p-8">


                <div class="text-center mb-8">
                    <div
                        class="inline-flex items-center justify-center p-3 bg-orange-600/10 border border-orange-600/20 rounded-full mb-4">
                        <img src="/trocarta_icon.png" alt="Trocarta" class="w-10 h-auto" />
                    </div>
                    <h1 class="font-display font-bold text-2xl text-white tracking-wider">Entrar</h1>
                    <p class="text-zinc-400 mt-1">Acesse sua conta Trocarta</p>
                </div>


                <div v-if="formError"
                    class="flex items-center gap-2 bg-red-400/10 border border-red-400/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-5">

                    <span>{{ formError }}</span>
                </div>


                <form @submit.prevent="onSubmit" class="flex flex-col gap-5">
                    <AppInput v-model="email" v-bind="emailAttrs" label="E-mail" type="email"
                        placeholder="voce@email.com" :error="errors.email" />
                    <AppInput v-model="password" v-bind="passwordAttrs" label="Senha" type="password"
                        placeholder="••••••••" :error="errors.password" />

                    <AppButton type="submit" variant="primary" size="lg" :loading="auth.isLoading" :full-width="true">
                        Entrar
                    </AppButton>
                </form>


                <p class="text-center text-zinc-400 mt-6">
                    Não tem uma conta?
                    <RouterLink to="/register"
                        class="text-orange-500 font-bold hover:text-orange-400 transition-colors">
                        Registre-se
                    </RouterLink>
                </p>

            </div>
        </div>
    </div>
</template>
