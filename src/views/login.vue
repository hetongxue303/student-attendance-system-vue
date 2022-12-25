<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { getCaptcha, login } from '../api/login'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { encryptMD5 } from '../hook/encryptMD5'
import { setToken, setTokenTime } from '../utils/auth'
import { useRoute, useRouter } from 'vue-router'
import { ILogin } from '../types/entity'
import { useCookies } from '@vueuse/integrations/useCookies'
import { decrypt, encrypt } from '../utils/jsencrypt'
import { useUserStore } from '../store/modules/user'

const route = useRoute()
const router = useRouter()
const cookie = useCookies()
const userStore = useUserStore()

const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  username: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
  password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
  code: [{ required: true, message: '验证码不能为空', trigger: 'blur' }]
})

const formData: ILogin = reactive({
  username: '',
  password: '',
  code: '',
  rememberMe: false
})

const pageData = reactive({
  loading: false,
  imgUrl: '',
  redirect: ''
})

const refreshCaptcha = async () => {
  const { data } = await getCaptcha()
  if (data.code === 200) {
    pageData.imgUrl = data.data
  }
}

const loginHandler = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      pageData.loading = true
      if (formData.rememberMe) {
        const expires: Date = new Date(new Date().getTime() + 60 * 60 * 1000)
        cookie.remove('username')
        cookie.remove('password')
        cookie.remove('rememberMe')
        cookie.set('username', formData.username, { expires })
        cookie.set('password', encrypt(formData.password), { expires })
        cookie.set('rememberMe', formData.rememberMe, { expires })
      } else {
        cookie.remove('username')
        cookie.remove('password')
        cookie.remove('rememberMe')
      }
      const { data, status } = await login({
        username: formData.username,
        password: encryptMD5(formData.password),
        code: formData.code,
        rememberMe: formData.rememberMe
      })
      if (data.code === 200 && status === 200) {
        setToken(data.access_token)
        setTokenTime(new Date().getTime() + data.expire_time)
        userStore.setUserInfo(data)
        ElMessage.success('登陆成功')
        await router.push(pageData.redirect || '/')
      } else {
        formData.code = ''
        await refreshCaptcha()
        ElMessage.warning(data.message || '登陆失败，请重试！')
      }
      pageData.loading = false
    } else {
      return false
    }
  })
}

watch(
  () => pageData.imgUrl,
  () => (formData.code = ''),
  { deep: true }
)

watch(
  () => route,
  () => (pageData.redirect = route.query && (route.query.redirect as string)),
  { immediate: true }
)
const getCookie = async () => {
  formData.username = cookie.get('username')
  formData.password = cookie.get('password')
    ? decrypt(cookie.get('password'))
    : ''
  formData.rememberMe = Boolean(cookie.get('rememberMe'))
}
onMounted(() => {
  refreshCaptcha()
  getCookie()
})
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <div class="left"></div>
      <div class="right">
        <h2 class="right-title">欢迎回来</h2>
        <div class="right-box">
          <span class="right-box-line"></span>
          <span>账号密码登录</span>
          <span class="right-box-line"></span>
        </div>
        <el-form ref="ruleFormRef" :model="formData" :rules="rules">
          <el-form-item prop="username">
            <el-input
              v-model="formData.username"
              prefix-icon="user"
              placeholder="账号"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="formData.password"
              placeholder="密码"
              show-password
              @keyup.enter="loginHandler(ruleFormRef)"
              prefix-icon="lock"
            />
          </el-form-item>
          <el-form-item prop="code">
            <el-row :gutter="10" class="w-250px">
              <el-col :span="14" class="mr-3">
                <el-input
                  v-model="formData.code"
                  placeholder="验证码"
                  @keyup.enter="loginHandler(ruleFormRef)"
                  prefix-icon="key"
                />
              </el-col>
              <el-col :span="8" class="flex justify-center items-center">
                <el-image
                  :src="pageData.imgUrl"
                  style="cursor: pointer; margin-top: 3px"
                  title="点击切换验证码"
                  @click.stop="refreshCaptcha"
                />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="formData.rememberMe">记住我</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              :loading="pageData.loading"
              @keyup.enter="loginHandler(ruleFormRef)"
              @click="loginHandler(ruleFormRef)"
            >
              <span v-if="pageData.loading">登 陆 中...</span>
              <span v-else>登 陆</span>
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-container {
  width: 100vw;
  height: 100vh;
  background-image: linear-gradient(
    to left bottom,
    #e8b7b1,
    #ecbdb3,
    #f0c4b5,
    #f4cab8,
    #f7d1bb,
    #f8cfb9,
    #f9ccb6,
    #facab4,
    #f9beae,
    #f7b2ab,
    #f4a6aa,
    #ee9bac
  );

  .login-box {
    width: 80vw;
    height: 70vh;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    background-color: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(10px);
    border-radius: 30px;
    display: flex;

    .left {
      height: 100%;
      width: 60%;
      background: radial-gradient(
          ellipse farthest-side at 76% 77%,
          rgba(245, 228, 212, 0.25) 4%,
          rgba(255, 255, 255, 0) calc(4% + 1px)
        ),
        radial-gradient(
          circle at 76% 40%,
          #fef6ec 4%,
          rgba(255, 255, 255, 0) 4.18%
        ),
        linear-gradient(135deg, #ff0000 0%, #000036 100%),
        radial-gradient(
          ellipse at 28% 0%,
          #ffcfac 0%,
          rgba(98, 149, 144, 0.5) 100%
        ),
        linear-gradient(
          180deg,
          #cd6e8a 0%,
          #f5eab0 69%,
          #d6c8a2 70%,
          #a2758d 100%
        );
      background-blend-mode: normal, normal, screen, overlay, normal;
    }

    .right {
      height: 100%;
      width: 40%;
      background-color: rgba(255, 255, 255, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      &-title {
        @apply font-bold text-3xl text-gray-800;
      }

      &-box {
        @apply space-x-2 flex justify-center items-center my-5 text-gray-300;
        &-line {
          @apply h-1px w-16 bg-gray-200;
        }
      }
    }
  }
}

:deep(.el-button) {
  width: 250px;
}
</style>
