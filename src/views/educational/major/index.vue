<script setup lang="ts">
import Pagination from '../../../components/Pagination/Index.vue'
import { onMounted, reactive, ref, watch } from 'vue'
import moment from 'moment'
import { cloneDeep } from 'lodash'
import { Major, QueryMajor } from '../../../types/entity'
import {
  ElMessage,
  ElMessageBox,
  ElNotification,
  ElTable,
  FormInstance,
  FormRules
} from 'element-plus'
import {
  addMajor,
  delMajor,
  getMajorPage,
  updateMajor
} from '../../../api/major'

// 初始化相关
const tableData = ref<Major[]>([])
const tableLoading = ref<boolean>(false)
const getMajorListPage = async () => {
  tableLoading.value = true
  setTimeout(async () => {
    const { data } = await getMajorPage(query)
    tableData.value = cloneDeep(data.data.record)
    total.value = JSON.parse(data.data.total)
    tableLoading.value = false
  }, Math.floor(Math.random() * (500 - 10)) + 10)
}
onMounted(() => getMajorListPage())

// 表单检验
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  major_name: [
    {
      required: true,
      type: 'string',
      message: '学院名称不能为空',
      trigger: 'blur'
    }
  ]
})

// 查询属性
const query: QueryMajor = reactive({
  currentPage: 1,
  pageSize: 10
})

// 分页相关
const total = ref<number>(0)
const handleCurrentChange = (currentPage: number) =>
  (query.currentPage = currentPage)

const handleSizeChange = (pageSize: number) => (query.pageSize = pageSize)

// 处理搜索
const handleSearch = () => {
  if (!query.major_name) {
    ElMessage.info('请输入搜索内容...')
    return
  }
  getMajorListPage()
}

// 重置搜索
const resetSearch = () => (query.major_name = undefined)

// 监听查询属性
watch(
  () => query,
  async () => {
    await getMajorListPage()
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
const multipleSelection = ref<Major[]>([])
const handleSelectionChange = (majors: Major[]) =>
  (multipleSelection.value = majors)

// 单个删除
const handleDelete = async ({ major_id }: Major) => {
  if (major_id) {
    const { data } = await delMajor(major_id)
    if (data.code === 200) {
      await getMajorListPage()
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
    ElMessage.info('待完善...')
    /**
     const ids: number[] = multipleSelection.value.map((item) => {
      return item.college_id as number
    })
     const { data } = await delBatchCollege(ids)
     if (data.code === 200) {
      await getCollegeListPage()
      ElNotification.success('删除成功')
      return
    }
     ElNotification.error('删除失败,请重试！')
     */
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
    disabled.delete = multipleSelection.value.length < 1
  },
  { immediate: true, deep: true }
)

/* 增加 编辑相关 */
const dialogForm = ref<Major>({})
const dialog = reactive({
  show: false,
  title: '',
  operate: ''
})

// 设置dialog
const setDialog = async (operate: string, row?: Major) => {
  if (operate === 'insert') {
    dialog.title = '新增学院'
    multipleSelection.value = []
  }
  if (operate === 'update') {
    if (row) {
      dialogForm.value = cloneDeep(row)
    } else {
      dialogForm.value = cloneDeep(multipleSelection.value[0] as Major)
    }
    dialog.title = '编辑学院'
  }
  dialog.show = true
  dialog.operate = operate
}

// 处理dialog操作
const handleOperate = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      if (dialog.operate === 'insert') {
        const { data } = await addMajor(dialogForm.value)
        if (data.code === 200) {
          await getMajorListPage()
          dialog.show = false
          ElNotification.success('添加成功')
          return
        }
        ElNotification.error('添加失败,请重试！')
      }
      if (dialog.operate === 'update') {
        const { data } = await updateMajor(dialogForm.value)
        if (data.code === 200) {
          await getMajorListPage()
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
    if (!newValue.show) ruleFormRef.value?.resetFields()
  },
  { deep: true }
)
</script>

<template>
  <!--表格工具-->
  <div class="table-tool">
    <el-row :gutter="20" class="search-box">
      <el-col :span="4">
        <el-input
          v-model="query.major_name"
          type="text"
          placeholder="学院名称..."
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

  <!--表格-->
  <el-table
    ref="multipleTableRef"
    :data="tableData"
    width="100%"
    @selection-change="handleSelectionChange"
    v-loading="tableLoading"
  >
    <el-table-column type="selection" width="50" align="center" />
    <el-table-column prop="major_name" label="专业名称" width="auto" />
    <el-table-column prop="description" label="专业描述" width="auto" />
    <el-table-column label="创建时间" align="center" width="180">
      <template #default="{ row }">
        {{ moment(row.create_time).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center" width="200">
      <template #default="scope">
        <el-button
          icon="EditPen"
          type="primary"
          @click="setDialog('update', scope.row)"
        />
        <el-popconfirm
          title="确定删除本条数据吗？"
          @confirm="handleDelete(scope.row)"
        >
          <template #reference>
            <el-button type="danger" icon="Delete" />
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
    width="40%"
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
          <el-form-item label="专业名称" prop="major_name">
            <el-input
              v-model="dialogForm.major_name"
              type="text"
              placeholder="专业名称"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="专业描述" prop="description">
            <el-input
              v-model="dialogForm.description"
              type="textarea"
              :rows="5"
              resize="none"
              placeholder="专业描述(默认：空)"
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
