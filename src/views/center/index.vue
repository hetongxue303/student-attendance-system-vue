<script setup lang="ts">
import { reactive, ref } from 'vue'
import { getCaptcha } from '../../api/login'
import { encryptMD5 } from '../../hook/encryptMD5'
import {
  ElMessage,
  ElNotification,
  FormInstance,
  FormRules
} from 'element-plus'
import {
  up_email,
  up_password,
  updateEmail,
  updatePassword
} from '../../api/user'

const imgUrl = ref<string>('')
const refreshCaptcha = async () => {
  const { data } = await getCaptcha()
  if (data.code === 200) imgUrl.value = data.data
}
const emailRuleFormRef = ref<FormInstance>()
const passwordRuleFormRef = ref<FormInstance>()
const emailRules = reactive<FormRules>({
  email: [
    {
      required: true,
      type: 'email',
      message: '请输入邮箱',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      type: 'string',
      message: '请输入密码',
      trigger: 'blur'
    }
  ],
  code: [
    {
      required: true,
      type: 'string',
      message: '请输入验证码',
      trigger: 'blur'
    }
  ]
})
const passwordRules = reactive<FormRules>({
  old_password: [
    {
      required: true,
      type: 'string',
      message: '请输入旧密码',
      trigger: 'blur'
    }
  ],
  new_password: [
    {
      required: true,
      type: 'string',
      message: '请输入新密码',
      trigger: 'blur'
    }
  ],
  confirm_password: [
    {
      required: true,
      type: 'string',
      message: '请确认密码',
      trigger: 'blur'
    }
  ]
})
const emailDialog = ref<boolean>(false)
const passwordDialog = ref<boolean>(false)
const emailForm: up_email = reactive({})
const passwordForm: up_password = reactive({})
const handleOpenDialog = () => {
  emailDialog.value = true
  refreshCaptcha()
}
const handleEmailOperate = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      const { data } = await updateEmail({
        email: emailForm.email,
        password: encryptMD5(emailForm.password as string),
        code: emailForm.code
      })
      if (data.code === 200) {
        emailDialog.value = false
        ElNotification.success('修改成功')
        return
      }
      ElNotification.success('修改失败，请重试！')
    }
  })
}
const handlePasswordOperate = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    const newPassword: String = passwordForm.new_password as string
    const confirmPassword: String = passwordForm.confirm_password as string
    if (valid) {
      if (newPassword !== confirmPassword) {
        ElMessage.warning('两次密码不一致')
        return
      }
      const { data } = await updatePassword({
        new_password: encryptMD5(passwordForm.new_password as string),
        old_password: encryptMD5(passwordForm.old_password as string),
        confirm_password: encryptMD5(passwordForm.confirm_password as string)
      })
      if (data.code === 200) {
        passwordDialog.value = false
        ElNotification.success('修改成功')
        return
      }
      ElNotification.success('修改失败，请重试！')
    }
  })
}
</script>

<template>
  <el-row :gutter="20">
    <el-col :span="6">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>个人信息</span>
          </div>
        </template>
        <div class="avatar">
          <el-avatar
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          />
        </div>
        <ul>
          <li>
            <div class="item">
              <span>登陆账号</span>
              <span>admin</span>
            </div>
          </li>
          <li>
            <div class="item">
              <span>用户昵称</span>
              <span>教师</span>
            </div>
          </li>
          <li>
            <div class="item">
              <span>手机号码</span>
              <span>15475896532</span>
            </div>
          </li>
          <li>
            <div class="item">
              <span>用户邮箱</span>
              <span>15475896532@163.com</span>
            </div>
          </li>
          <li>
            <div class="item">
              <span>安全设置</span>
              <div>
                <el-link
                  :underline="false"
                  style="color: #317ef3; margin-right: 5px; font-size: 13px"
                  @click="passwordDialog = true"
                >
                  修改密码
                </el-link>
                <el-link
                  :underline="false"
                  style="color: #317ef3; font-size: 13px"
                  @click="handleOpenDialog"
                >
                  修改邮箱
                </el-link>
              </div>
            </div>
          </li>
        </ul>
      </el-card>
    </el-col>
    <el-col :span="18" />
  </el-row>

  <!--邮箱-->
  <el-dialog
    v-model="emailDialog"
    title="修改邮箱"
    width="30%"
    :close-on-click-modal="false"
  >
    <el-form
      ref="emailRuleFormRef"
      :model="emailForm"
      :rules="emailRules"
      status-icon
      label-width="80px"
    >
      <el-form-item label="新邮箱" prop="email">
        <el-input v-model="emailForm.email" />
      </el-form-item>
      <el-form-item label="验证码" prop="code">
        <el-row :gutter="25">
          <el-col :span="14">
            <el-input v-model="emailForm.code" placeholder="验证码" />
          </el-col>
          <el-col :span="8" class="flex justify-center items-center">
            <el-image
              :src="imgUrl"
              style="cursor: pointer"
              title="点击切换验证码"
              @click.stop="refreshCaptcha"
            />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="当前密码" prop="password">
        <el-input v-model="emailForm.password" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="emailDialog = false">返回</el-button>
        <el-button type="primary" @click="handleEmailOperate(emailRuleFormRef)">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>

  <!--密码-->
  <el-dialog
    v-model="passwordDialog"
    title="修改密码"
    width="30%"
    :close-on-click-modal="false"
  >
    <el-form
      ref="passwordRuleFormRef"
      :model="passwordForm"
      :rules="passwordRules"
      status-icon
      label-width="80px"
    >
      <el-form-item label="旧密码" prop="old_password">
        <el-input v-model="passwordForm.old_password" />
      </el-form-item>
      <el-form-item label="新密码" prop="new_password">
        <el-input v-model="passwordForm.new_password" />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirm_password">
        <el-input v-model="passwordForm.confirm_password" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="passwordDialog = false">返回</el-button>
        <el-button
          type="primary"
          @click="handlePasswordOperate(passwordRuleFormRef)"
        >
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.card-header {
  height: 15px;
}

.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e7eaec;
  margin-bottom: -1px;
  padding: 11px 0;
  font-size: 13px;
}

:deep(.el-avatar) {
  height: 120px;
  width: 120px;
}
</style>
