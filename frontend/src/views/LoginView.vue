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
const loginForm = ref({
    userName: '',
    passWord: ''
})
const login = () => {
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
    }).finally(loadingRef.value = false)
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
    console.log(token);

})
</script>

<template>
    <div class="wrapper">
        <div class="background">
            <div class="shape"></div>
            <div class="shape"></div>
        </div>
        <n-form ref="formRef" :label-width="80" :model="loginForm" :rules="rules" :size="size">
            <n-form-item label="用户名" path="userName">
                <n-input v-model:value="loginForm.userName" placeholder="请输入用户名" />
            </n-form-item>
            <n-form-item label="密码" path="passWord">
                <n-input v-model:value="loginForm.passWord" placeholder="请输入密码" />
            </n-form-item>
            <n-button @click="login" :loading="loadingRef" class="loginBtn">
                登录
            </n-button>
        </n-form>
        <!-- <form>
            <h3>Login Here</h3>

            <label for="username">Username</label>
            <input type="text" placeholder="Email or Phone" id="username">

            <label for="password">Password</label>
            <input type="password" placeholder="Password" id="password">

            <button>Log In</button>
            <div class="social">
        n.000000000000000000000000000000.l       <div class="go"><i class="fab fa-google"></i> Google</div>
                <div class="fb"><i class="fab fa-facebook"></i> Facebook</div>
            </div>
        </form> -->
    </div>
</template>

<style scoped>
.loginBtn {
    width: 100%;
}
</style>

<!-- <style media="screen" scoped>
*,
*:before,
*:after {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
}

.wrapper {
    height: 100vh;
    background-color: #080710;
}

.background {
    width: 430px;
    height: 520px;
    position: absolute;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
}

.background .shape {
    height: 200px;
    width: 200px;
    position: absolute;
    border-radius: 50%;
}

.shape:first-child {
    background: linear-gradient(#1845ad,
            #23a2f6);
    left: -80px;
    top: -80px;
}

.shape:last-child {
    background: linear-gradient(to right,
            #ff512f,
            #f09819);
    right: -30px;
    bottom: -80px;
}

form {
    height: 520px;
    width: 400px;
    background-color: rgba(255, 255, 255, 0.13);
    position: absolute;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    border-radius: 10px;
    backdrop-filter: blur(10px);
    border: 2px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 40px rgba(8, 7, 16, 0.6);
    padding: 50px 35px;
}

form * {
    font-family: 'Poppins', sans-serif;
    color: #ffffff;
    letter-spacing: 0.5px;
    outline: none;
    border: none;
}

form h3 {
    font-size: 32px;
    font-weight: 500;
    line-height: 42px;
    text-align: center;
}

label {
    display: block;
    margin-top: 30px;
    font-size: 16px;
    font-weight: 500;
}

input {
    display: block;
    height: 50px;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.07);
    border-radius: 3px;
    padding: 0 10px;
    margin-top: 8px;
    font-size: 14px;
    font-weight: 300;
}

::placeholder {
    color: #e5e5e5;
}

button {
    margin-top: 50px;
    width: 100%;
    background-color: #ffffff;
    color: #080710;
    padding: 15px 0;
    font-size: 18px;
    font-weight: 600;
    border-radius: 5px;
    cursor: pointer;
}

.social {
    margin-top: 30px;
    display: flex;
}

.social div {
    background: red;
    width: 150px;
    border-radius: 3px;
    padding: 5px 10px 10px 5px;
    background-color: rgba(255, 255, 255, 0.27);
    color: #eaf0fb;
    text-align: center;
}

.social div:hover {
    background-color: rgba(255, 255, 255, 0.47);
}

.social .fb {
    margin-left: 25px;
}

.social i {
    margin-right: 4px;
}
</style> -->