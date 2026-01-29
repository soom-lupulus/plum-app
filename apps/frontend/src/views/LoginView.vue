<script setup>
import { ref, onMounted } from 'vue'
import { userLogin } from '@/api/user';
import { createDiscreteApi } from 'naive-ui'
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores'

const userStore = useUserStore()
const { message } = createDiscreteApi(['message'])
const router = useRouter()
const formRef = ref(null)
const loadingRef = ref(false)
const showPassword = ref(false)

const loginForm = ref({
    userName: '',
    passWord: ''
})

const login = () => {
    formRef.value?.validate((errors) => {
        if (!errors) {
            loadingRef.value = true
            userLogin(loginForm.value).then(({ data, msg }) => {
                message.success(msg)
                localStorage.setItem('token', data.token)
                router.replace({
                    name: 'home',
                })
                userStore.$patch({
                    userInfo: data.user
                })
            }).catch((error) => {
                message.error(error.response?.data?.msg || '登录失败，请重试')
            }).finally(() => {
                loadingRef.value = false
            })
        } else {
            message.error('请填写正确的登录信息')
        }
    })
}

const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
        login()
    }
}

const rules = {
    userName: [
        {
            required: true,
            message: '请输入用户名！',
            trigger: ['input', 'blur']
        },
        {
            trigger: ['input', 'blur'],
            validator(_rule, value) {
                if (value.length > 16) {
                    return new Error('不能超过16个字符！')
                }
                return true
            }
        }
    ],
    passWord: [
        {
            required: true,
            message: '请输入密码！',
            trigger: ['input', 'blur']
        },
        {
            trigger: ['input', 'blur'],
            validator(_rule, value) {
                if (value.length > 16) {
                    return new Error('不能超过16个字符！')
                }
                return true
            }
        }
    ],
}

onMounted(() => {
    const token = localStorage.getItem('token')
    if (token) {
        router.replace({ name: 'home' })
    }
})
</script>

<template>
    <div class="login-container">
        <!-- 登录表单区域 -->
        <div class="form-wrapper">
            <n-form ref="formRef" :model="loginForm" :rules="rules" size="large" class="login-form">
                <div class="form-title">
                    <h2>登录</h2>
                    <p>梅花易数和六爻的占卜工具</p>
                </div>

                <n-form-item path="userName" :show-label="false">
                    <n-input v-model:value="loginForm.userName" placeholder="用户名" size="large"
                        :input-props="{ autocomplete: 'username' }" @keypress="handleKeyPress">
                        <template #prefix>
                            <n-icon size="20" class="input-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            </n-icon>
                        </template>
                    </n-input>
                </n-form-item>

                <n-form-item path="passWord" :show-label="false">
                    <n-input v-model:value="loginForm.passWord" :type="showPassword ? 'text' : 'password'"
                        placeholder="密码" size="large" :input-props="{ autocomplete: 'current-password' }"
                        @keypress="handleKeyPress">
                        <template #prefix>
                            <n-icon size="20" class="input-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                            </n-icon>
                        </template>
                        <template #suffix>
                            <n-button quaternary size="small" @click="showPassword = !showPassword"
                                class="password-toggle">
                                <n-icon size="18">
                                    <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round">
                                        <path
                                            d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24">
                                        </path>
                                        <line x1="1" y1="1" x2="23" y2="23"></line>
                                    </svg>
                                </n-icon>
                            </n-button>
                        </template>
                    </n-input>
                </n-form-item>

                <n-button type="primary" size="large" :loading="loadingRef" @click="login" class="login-button"
                    :disabled="!loginForm.userName || !loginForm.passWord">
                    {{ loadingRef ? '登录中...' : '登录' }}
                </n-button>

                <div class="form-footer">
                    <p class="hint-text">忘记密码？请联系管理员</p>
                    <p class="version-text">小卜两下 v1.0</p>
                </div>
            </n-form>
        </div>
    </div>
</template>

<style scoped>
.login-container {
    /* min-height: calc(100vh - 60px); */
    /* 减去标题高度 */
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    /* overflow: hidden; */
}

.form-wrapper {
    width: 100%;
    max-width: 400px;
    height: calc(60vh);
}

.login-form {
    background: white;
    border-radius: 16px;
    padding: 32px 24px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    /* 更中性的阴影 */
    border: 1px solid #e2e8f0;
    /* 更中性的边框 */
}

.form-title {
    text-align: center;
    margin-bottom: 32px;
}

.form-title h2 {
    font-size: 28px;
    font-weight: 600;
    color: #1e293b;
    /* 更深的灰色文字 */
    margin: 0 0 8px 0;
    font-family: '幼圆', sans-serif;
    /* 与全局标题保持一致 */
}

.form-title p {
    font-size: 14px;
    color: #64748b;
    /* 中性灰色 */
    margin: 0;
    opacity: 0.8;
}

:deep(.n-form-item) {
    margin-bottom: 24px;
}

:deep(.n-input) {
    border-radius: 12px;
    border: 1px solid #cbd5e1;
    /* 更中性的边框颜色 */
    transition: all 0.2s ease;
}

/* 确保输入框内容垂直居中 */
:deep(.n-input__input-el) {
    height: 100%;
}

:deep(.n-input__input-area) {
    display: flex;
    align-items: center;
}

:deep(.n-input:focus-within) {
    border-color: #0891B2;
}


.input-icon {
    color: #64748b;
    /* 中性灰色图标 */
    opacity: 0.7;
}

.password-toggle {
    color: #64748b;
    /* 中性灰色图标 */
    opacity: 0.7;
}

.password-toggle:hover {
    color: #0891B2;
    opacity: 1;
}

.login-button {
    width: 100%;
    height: 48px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 16px;
    background: #0891B2;
    /* 纯色代替渐变 */
    border: none;
    transition: all 0.2s ease;
    margin-top: 8px;
}

.login-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(8, 145, 178, 0.3);
    background: #0ea5e9;
    /* 悬停时稍亮的蓝色 */
}

.login-button:active {
    transform: translateY(0);
}

.login-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    background: #94a3b8;
    /* 禁用状态灰色 */
}

.form-footer {
    margin-top: 32px;
    text-align: center;
}

.hint-text {
    font-size: 14px;
    color: #64748B;
    margin: 0 0 16px 0;
    opacity: 0.7;
}

.version-text {
    font-size: 12px;
    color: #94A3B8;
    margin: 0;
    opacity: 0.5;
}

/* 移动端自适应 */
@media (max-width: 767px) {
    .login-container {
        padding: 16px;
        min-height: calc(100vh - 100px);
    }

    .form-wrapper {
        max-width: 100%;
    }

    .login-form {
        padding: 24px 20px;
        border-radius: 12px;
    }

    .form-title h2 {
        font-size: 24px;
    }
}

/* 小屏幕手机 */
@media (max-width: 374px) {
    .login-container {
        padding: 12px;
    }

    .login-form {
        padding: 20px 16px;
    }

    .form-title h2 {
        font-size: 22px;
    }
}

/* 平板和桌面 */
@media (min-width: 768px) {
    .login-container {
        padding: 40px;
    }

    .login-form {
        padding: 40px 32px;
    }
}

/* 防止滚动条 */
html,
body {
    overflow: hidden;
}

.login-container {
    overflow: hidden;
}

/* 动画效果 */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.login-form {
    animation: fadeIn 0.4s ease-out;
}

/* 触摸优化 */
@media (hover: none) and (pointer: coarse) {
    .login-button {
        min-height: 52px;
    }

    :deep(.n-input) {
        min-height: 52px;
    }

    .password-toggle {
        min-width: 48px;
        min-height: 48px;
    }
}
</style>