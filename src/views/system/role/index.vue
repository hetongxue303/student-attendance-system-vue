<script setup lang="ts">
import Pagination from '../../../components/Pagination/Index.vue'
import { QueryRole, Role } from '../../../types/entity'
import { onMounted, reactive, ref, watch } from 'vue'
import { addRole, delRole, getRolePage, updateRole } from '../../../api/role'
import { cloneDeep } from 'lodash'
import {
  ElMessage,
  ElMessageBox,
  ElNotification,
  ElTable,
  FormInstance,
  FormRules
} from 'element-plus'
import moment from 'moment'

const tableData = ref<Role[]>([])
const roleMultipleRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<Role[]>([])
const total = ref<number>(0)
const dialogForm = ref<Role>({ is_enable: false })
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  role_name: [
    {
      required: true,
      type: 'string',
      message: '角色名称不能为空',
      trigger: 'blur'
    }
  ],
  role_key: [
    {
      required: true,
      type: 'string',
      message: '角色标识不能为空',
      trigger: 'blur'
    }
  ],
  is_enable: [
    {
      required: true,
      type: 'boolean',
      message: '请选择是否启用',
      trigger: 'blur'
    }
  ]
})
const disabled = reactive({
  edit: true,
  delete: true,
  export: false
})
const dialog = reactive({
  show: false,
  title: '',
  operate: ''
})
const query: QueryRole = reactive({
  currentPage: 1,
  pageSize: 10
})
const getRoleListPage = async () => {
  const { data } = await getRolePage(query)
  tableData.value = cloneDeep(data.data.record)
  total.value = JSON.parse(data.data.total)
}
const handleSelectionChange = (roles: Role[]) => {
  multipleSelection.value = roles
}
const handleCurrentChange = (currentPage: number) => {
  query.currentPage = currentPage
  getRoleListPage()
}
const handleSizeChange = (pageSize: number) => {
  query.pageSize = pageSize
  getRoleListPage()
}

const setDialog = async (operate: string, row?: Role) => {
  if (operate === 'insert') {
    dialog.title = '新增角色'
  }
  if (operate === 'update') {
    if (row) {
      dialogForm.value = cloneDeep(row)
    } else {
      dialogForm.value = cloneDeep(multipleSelection.value[0] as Role)
    }
    dialog.title = '编辑角色'
  }
  dialog.show = true
  dialog.operate = operate
}
const handleOperate = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      if (dialog.operate === 'insert') {
        const { data } = await addRole(dialogForm.value)
        if (data.code === 200) {
          await getRoleListPage()
          dialog.show = false
          ElNotification.success('添加成功')
          return
        }
        ElNotification.error('添加失败,请重试！')
      }
      if (dialog.operate === 'update') {
        const { data } = await updateRole(dialogForm.value)
        if (data.code === 200) {
          await getRoleListPage()
          dialog.show = false
          ElNotification.success('更新成功')
          return
        }
        ElNotification.error('更新失败,请重试！')
      }
    }
  })
}
const handleDelete = async ({ role_id }: Role) => {
  if (role_id) {
    const { data } = await delRole(role_id)
    if (data.code === 200) {
      await getRoleListPage()
      ElNotification.success('删除成功')
      return
    }
    ElNotification.error('删除失败,请重试！')
  }
}
const handleBatchDelete = async () => {
  ElMessageBox.confirm(
    `确认删除选中的${multipleSelection.value.length}条数据吗?`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    const ids: Array<number> = multipleSelection.value.map((item) => {
      return item.role_id as number
    })
    ElMessage.warning('待完善')
    // const { data } = await delBatchRole(ids)
    // if (data.code === 200) {
    //   await getRoleListPage()
    //   ElNotification.success('删除成功')
    //   return
    // }
    // ElNotification.error('删除失败,请重试！')
  })
}
const handleExport = () => {
  ElMessage.warning('待完善')
}
const handleSearch = () => {
  if (!query.role_name) {
    ElMessage.warning('请选择搜索内容...')
    return
  }
  getRoleListPage()
}
const resetSearch = () => {
  query.role_name = undefined
  getRoleListPage()
}
watch(
  () => query,
  async () => {
    await getRoleListPage()
  },
  { deep: true }
)
watch(
  () => multipleSelection.value,
  () => {
    disabled.edit = multipleSelection.value.length !== 1
    disabled.delete = multipleSelection.value.length < 1
  },
  { immediate: true, deep: true }
)
onMounted(() => getRoleListPage())
</script>

<template>
  <!--表格工具-->
  <div class="table-tool">
    <el-row :gutter="20" class="search-box">
      <el-col :span="4">
        <el-input
          v-model="query.role_name"
          type="text"
          placeholder="角色名称"
        />
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
  <el-row :gutter="20">
    <el-col :span="18">
      <el-card>
        <template #header>
          <div class="header-box">
            <span>角色列表</span>
          </div>
        </template>
        <el-table
          ref="roleMultipleRef"
          :data="tableData"
          highlight-current-row
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="role_name" label="角色名称" width="auto" />
          <el-table-column prop="role_key" label="角色标识" width="auto" />
          <el-table-column label="创建时间" align="center" width="180">
            <template #default="{ row }">
              <span>
                {{ moment(row.create_time).format('YYYY-MM-DD HH:mm:ss') }}
              </span>
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
                  <el-button type="danger" icon="Delete" />
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <Pagination
          :current-page="query.currentPage"
          :page-size="query.pageSize"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card>
        <template #header>
          <div class="header-box">
            <span>菜单分配</span>
            <el-button
              :disabled="saveDisabled"
              type="primary"
              icon="Check"
              size="small"
              @click="handleSaveMenu"
            >
              保存
            </el-button>
          </div>
        </template>
        菜单树
      </el-card>
    </el-col>
  </el-row>
  <!--对话框-->
  <el-dialog
    v-model="dialog.show"
    :title="dialog.title"
    width="40%"
    destroy-on-close
    :close-on-click-modal="false"
  >
    <el-form
      ref="ruleFormRef"
      :model="dialogForm"
      :rules="rules"
      status-icon
      label-width="80px"
    >
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="角色名称" prop="role_name">
            <el-input v-model="dialogForm.role_name" clearable type="text" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="角色标识" prop="role_key">
            <el-input v-model="dialogForm.role_key" clearable type="text" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="是否启用" prop="is_enable">
            <el-radio-group v-model="dialogForm.is_enable">
              <el-radio :label="true">启用</el-radio>
              <el-radio :label="false">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="描述信息">
            <el-input
              v-model="dialogForm.description"
              type="textarea"
              :rows="5"
              resize="none"
              clearable
              placeholder="描述信息(默认：空)"
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

.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;

  span:first-child {
    font-weight: bold;
  }
}
</style>
