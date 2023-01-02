<script setup lang="ts">
import Pagination from '../../../components/Pagination/Index.vue'
import { onMounted, reactive, ref, watch } from 'vue'
import { QueryUser, Role, User } from '../../../types/entity'
import { cloneDeep } from 'lodash'
import { useUserStore } from '../../../store/modules/user'
import moment from 'moment'
import {
  addUser,
  delBatchUser,
  delUser,
  getUserPage,
  updateUser
} from '../../../api/user'
import {
  ElMessage,
  ElMessageBox,
  ElNotification,
  ElTable,
  FormInstance,
  FormRules
} from 'element-plus'
import { getRoleAll } from '../../../api/role'
import { encryptMD5 } from '../../../hook/encryptMD5'

// 初始化相关
const tableData = ref<User[]>([])
const getUserListPage = async () => {
  const { data } = await getUserPage(query)
  tableData.value = cloneDeep(data.data.record)
  total.value = JSON.parse(data.data.total)
}
onMounted(() => getUserListPage())

// 表单检验
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({})

// 查询属性
const query: QueryUser = reactive({
  currentPage: 1,
  pageSize: 10
})
// 分页相关
const total = ref<number>(0)
const handleCurrentChange = (currentPage: number) => {
  query.currentPage = currentPage
  getUserListPage()
}
const handleSizeChange = (pageSize: number) => {
  query.pageSize = pageSize
  getUserListPage()
}

// 处理搜索
const handleSearch = () => {
  if (!query.username || !query.is_enable || !query.role) {
    ElMessage.warning('请选择搜索内容...')
    return
  }
  getUserListPage()
}

// 重置搜索
const resetSearch = () => {
  query.username = undefined
  getUserListPage()
}

// 监听查询属性
watch(
  () => query,
  async () => {
    await getUserListPage()
  },
  { deep: true }
)

/* 表格相关 */
const disabled = reactive({
  edit: true,
  delete: true,
  export: false
})
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<User[]>([])
const handleSelectionChange = (users: User[]) => {
  multipleSelection.value = users
}

// 单个删除
const handleDelete = async ({ user_id }: User) => {
  if (user_id) {
    const { data } = await delUser(user_id)
    if (data.code === 200) {
      await getUserListPage()
      ElNotification.success('删除成功')
      return
    }
    ElNotification.error('删除失败,请重试！')
  }
}

// 批量删除
const handleBatchDelete = async () => {
  ElMessageBox.confirm(
    `确认删除选中的${multipleSelection.value.length}条数据?`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    const ids: number[] = multipleSelection.value
      .filter((item) => item.username !== useUserStore().getUsername)
      .map((item) => {
        return item.user_id as number
      })
    const { data } = await delBatchUser(ids)
    if (data.code === 200) {
      await getUserListPage()
      ElNotification.success('删除成功')
      return
    }
    ElNotification.error('删除失败,请重试！')
  })
}

// 处理导出
const handleExport = () => {
  ElMessage.info('待开发...')
}

// 监听多选
watch(
  () => multipleSelection.value,
  () => {
    disabled.edit = multipleSelection.value.length !== 1
    disabled.delete =
      multipleSelection.value.filter(
        (item) => item.username !== useUserStore().getUsername
      ).length < 1
  },
  { immediate: true, deep: true }
)

/* 增加 编辑相关 */
const dialogForm = ref<User>({ gender: 1, is_enable: false })
const dialog = reactive({
  show: false,
  title: '',
  operate: ''
})
// 设置dialog
const setDialog = async (operate: string, row?: User) => {
  if (operate === 'insert') {
    dialog.title = '新增用户'
  }
  if (operate === 'update') {
    if (row) {
      dialogForm.value = cloneDeep(row)
    } else {
      dialogForm.value = cloneDeep(multipleSelection.value[0] as User)
    }
    dialog.title = '编辑用户'
  }
  getRoleList()
  dialog.show = true
  dialog.operate = operate
}

// 处理dialog操作
const handleOperate = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      if (dialog.operate === 'insert') {
        if (dialogForm.value.password) {
          dialogForm.value.password = encryptMD5(dialogForm.value.password)
        }
        const { data } = await addUser(dialogForm.value)
        if (data.code === 200) {
          await getUserListPage()
          dialog.show = false
          ElNotification.success('添加成功')
          return
        }
        ElNotification.error('添加失败,请重试！')
      }
      if (dialog.operate === 'update') {
        const { data } = await updateUser(dialogForm.value)
        if (data.code === 200) {
          await getUserListPage()
          dialog.show = false
          ElNotification.success('更新成功')
          return
        }
        ElNotification.error('更新失败,请重试！')
      }
    }
  })
}

// 监听dialog显示
watch(
  () => dialog,
  (newValue) => {
    // 关闭表单时重置表单
    if (!newValue.show) ruleFormRef.value?.resetFields()
  },
  { deep: true }
)

// switch改变处理
const switchLoading = ref<boolean>(false)
const handleSwitchChange = (user: User) => {
  switchLoading.value = true
  ElMessageBox.confirm(
    `确定要${user.is_enable ? '启用' : '禁用'} ${user.real_name} 吗?`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(async () => {
      const { data } = await updateUser(user)
      data.code === 200
        ? ElNotification.success(`${user.is_enable ? '启用' : '禁用'}成功`)
        : ElNotification.error(
            `${user.is_enable ? '启用' : '禁用'}成功，请重试！`
          )
    })
    .catch(() => (user.is_enable = !user.is_enable))
    .finally(() => (switchLoading.value = false))
}

// 获取所有角色信息
const roleList = ref<Role[]>([])
const getRoleList = () => {
  getRoleAll().then(
    ({ data }) => (roleList.value = cloneDeep(data.data.record))
  )
}

// 重置密码
const resetPassword = () => {
  ElMessageBox.confirm(
    `确认重置${dialogForm.value.real_name}的密码吗?`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    dialogForm.value.password = encryptMD5('123456')
    const { data } = await updateUser(dialogForm.value)
    if (data.code === 200) {
      ElNotification.success('重置成功')
      await getUserListPage()
      return
    }
    ElNotification.error('重置失败，请重试！')
  })
}
</script>

<template>
  <!--表格工具-->
  <div class="table-tool">
    <el-row :gutter="20" class="search-box">
      <el-col :span="4">
        <el-input v-model="query.username" type="text" placeholder="用户姓名" />
      </el-col>
      <el-col :span="3">
        <el-select v-model="query.is_enable" placeholder="状态" clearable>
          <el-option label="启用" :value="true" />
          <el-option label="禁用" :value="false" />
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select v-model="query.role" placeholder="角色" clearable>
          <el-option label="管理员" :value="1" />
          <el-option label="教师" :value="2" />
          <el-option label="学生" :value="3" />
        </el-select>
      </el-col>
      <el-button icon="Search" type="success" @click="handleSearch">
        搜索
      </el-button>
      <el-button icon="RefreshLeft" type="warning" @click="resetSearch">
        重置
      </el-button>
    </el-row>
    <div class="operate-box">
      <el-button icon="Plus" type="primary" @click="setDialog('insert')">
        新增
      </el-button>
      <el-button
        icon="EditPen"
        :disabled="disabled.edit"
        type="success"
        @click="setDialog('update')"
      >
        修改
      </el-button>
      <el-button
        icon="Delete"
        :disabled="disabled.delete"
        type="danger"
        @click="handleBatchDelete"
      >
        删除
      </el-button>
      <el-button
        icon="Bottom"
        :disabled="disabled.export"
        type="warning"
        @click="handleExport"
      >
        导出
      </el-button>
    </div>
  </div>

  <!--表格-->
  <el-table
    ref="multipleTableRef"
    :data="tableData"
    width="100%"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="50" align="center" />
    <el-table-column prop="username" label="账户" width="auto" />
    <el-table-column prop="real_name" label="姓名" width="auto" />
    <el-table-column label="性别" width="auto">
      <template #default="{ row }">
        {{ row.gender === 1 ? '男' : '女' }}
      </template>
    </el-table-column>
    <el-table-column prop="phone" label="电话" align="center" width="auto" />
    <el-table-column prop="email" label="邮箱" align="center" width="200" />
    <el-table-column prop="is_enable" label="状态" align="center" width="auto">
      <template #default="{ row }">
        <el-switch
          v-model="row.is_enable"
          :loading="switchLoading"
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
          :disabled="row.username === useUserStore().getUsername"
          @change="handleSwitchChange(row)"
        />
      </template>
    </el-table-column>
    <el-table-column label="注册时间" align="center" width="180">
      <template #default="{ row }">
        {{ moment(row.create_time).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center" width="200">
      <template #default="{ row }">
        <el-button
          icon="EditPen"
          type="primary"
          @click="setDialog('update', row)"
        />
        <el-popconfirm
          title="确定删除本条数据吗？"
          @confirm="handleDelete(row)"
        >
          <template #reference>
            <el-button
              type="danger"
              :disabled="row.username === useUserStore().getUsername"
              icon="Delete"
            />
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>

  <!--分页-->
  <Pagination
    :current-page="query.currentPage"
    :page-size="query.pageSize"
    :total="total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />

  <!--对话框-->
  <el-dialog
    v-model="dialog.show"
    :title="dialog.title"
    width="50%"
    :close-on-click-modal="false"
  >
    <el-form
      ref="ruleFormRef"
      :model="dialogForm"
      :rules="rules"
      status-icon
      label-width="70px"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="账户" prop="username">
            <el-input
              v-model="dialogForm.username"
              type="text"
              clearable
              @clear="dialogForm.username = undefined"
            />
          </el-form-item>
        </el-col>
        <el-col
          v-show="dialog.operate === 'update'"
          :span="4"
          style="margin-left: 30px"
        >
          <el-link
            type="primary"
            :underline="false"
            @click.stop="resetPassword"
          >
            重置密码
          </el-link>
        </el-col>
      </el-row>
      <el-row :gutter="20" v-show="dialog.operate === 'insert'">
        <el-col :span="12">
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="dialogForm.password"
              type="text"
              clearable
              show-password
              @clear="dialogForm.password = undefined"
              placeholder="默认密码：123456"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="姓名" prop="real_name">
            <el-input
              v-model="dialogForm.real_name"
              @clear="dialogForm.real_name = undefined"
              type="text"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电话" prop="phone">
            <el-input
              v-model="dialogForm.phone"
              :controls="false"
              type="text"
              @clear="dialogForm.phone = undefined"
              maxlength="11"
              minlength="6"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="昵称" prop="nick_name">
            <el-input
              v-model="dialogForm.nick_name"
              @clear="dialogForm.nick_name = undefined"
              type="text"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input
              v-model="dialogForm.email"
              @clear="dialogForm.email = undefined"
              type="text"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="dialogForm.gender">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="isEnable">
            <el-radio-group v-model="dialogForm.is_enable">
              <el-radio :label="true">启用</el-radio>
              <el-radio :label="false">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="角色" prop="role">
            <el-select
              v-model="dialogForm.role"
              style="width: 100%"
              placeholder="请选择"
              clearable
              @clear="dialogForm.role = undefined"
            >
              <el-option
                v-for="(item, index) in roleList"
                :key="index"
                :label="item.role_name"
                :value="item.role_id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="描述" prop="description">
            <el-input
              v-model="dialogForm.description"
              type="textarea"
              :rows="5"
              resize="none"
              clearable
              @clear="dialogForm.description = undefined"
              placeholder="用户描述(默认：空)"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialog.show = false">返回</el-button>
        <el-button type="primary" @click="handleOperate(ruleFormRef)">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.table-tool {
  padding: 15px 0 15px 0;

  .search-box {
    margin-bottom: 15px;
  }

  .operate-box {
    margin-bottom: 15px;
  }
}
</style>
