<script setup lang="ts">
import Pagination from '../../../components/Pagination/Index.vue'
import { onMounted, reactive, ref, watch } from 'vue'
import moment from 'moment'
import { cloneDeep } from 'lodash'
import { Course, QueryCourse, User } from '../../../types/entity'
import {
  ElMessage,
  ElMessageBox,
  ElNotification,
  ElTable,
  FormInstance,
  FormRules
} from 'element-plus'
import {
  addCourse,
  delCourse,
  getCoursePage,
  updateCourse
} from '../../../api/course'
import { getUserAll } from '../../../api/user'

// 初始化相关
const tableData = ref<Course[]>([])
const tableLoading = ref<boolean>(false)
const getCourseListPage = async () => {
  tableLoading.value = true
  setTimeout(async () => {
    const { data } = await getCoursePage(query)
    tableData.value = cloneDeep(data.data.record)
    total.value = JSON.parse(data.data.total)
    tableLoading.value = false
  }, Math.floor(Math.random() * (500 - 10)) + 10)
}
onMounted(() => getCourseListPage())

// 表单检验
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  course_name: [
    {
      required: true,
      type: 'string',
      message: '课程名称不能为空',
      trigger: 'blur'
    }
  ],
  count: [
    {
      required: true,
      type: 'number',
      message: '课程人数不能为空',
      trigger: 'blur'
    },
    {
      required: true,
      type: 'number',
      min: 5,
      max: 200,
      message: '课程人数介于5~200人',
      trigger: 'blur'
    }
  ],
  teacher_id: [
    {
      required: true,
      type: 'number',
      message: '请选择任课教师',
      trigger: 'blur'
    }
  ]
})

// 查询属性
const query: QueryCourse = reactive({
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
  if (!query.course_name) {
    ElMessage.info('请输入搜索内容...')
    return
  }
  getCourseListPage()
}

// 重置搜索
const resetSearch = () => (query.course_name = undefined)

// 监听查询属性
watch(
  () => query,
  async () => {
    await getCourseListPage()
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
const multipleSelection = ref<Course[]>([])
const handleSelectionChange = (courses: Course[]) =>
  (multipleSelection.value = courses)

// 单个删除
const handleDelete = async ({ course_id }: Course) => {
  if (course_id) {
    const { data } = await delCourse(course_id)
    if (data.code === 200) {
      await getCourseListPage()
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
const dialogForm = ref<Course>({ count: 5, time: 4 })
const dialog = reactive({
  show: false,
  title: '',
  operate: ''
})

// 设置dialog
const setDialog = async (operate: string, row?: Course) => {
  if (operate === 'insert') {
    dialog.title = '新增课程'
    multipleSelection.value = []
  }
  if (operate === 'update') {
    if (row) {
      dialogForm.value = cloneDeep(row)
    } else {
      dialogForm.value = cloneDeep(multipleSelection.value[0] as Course)
    }
    dialog.title = '编辑课程'
  }
  dialog.show = true
  dialog.operate = operate
  getSelectUserList(2)
}

// 处理dialog操作
const handleOperate = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      if (dialog.operate === 'insert') {
        const { data } = await addCourse(dialogForm.value)
        if (data.code === 200) {
          await getCourseListPage()
          dialog.show = false
          ElNotification.success('添加成功')
          return
        }
        ElNotification.error('添加失败,请重试！')
      }
      if (dialog.operate === 'update') {
        const { data } = await updateCourse(dialogForm.value)
        if (data.code === 200) {
          await getCourseListPage()
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

// 下拉框数据
const teachers = ref<User[]>([])
const getSelectUserList = (role: number) => {
  getUserAll(role).then(({ data }) => (teachers.value = cloneDeep(data.data)))
}
// 处理选课/退课
const handleChoiceCourse = (row: Course) => {
  ElMessage.info('待处理...')
}
const handleQuitCourse = (row: Course) => {
  ElMessage.info('待处理...')
}
</script>

<template>
  <!--表格工具-->
  <div class="table-tool">
    <el-row :gutter="20" class="search-box">
      <el-col :span="4">
        <el-input
          v-model="query.course_name"
          type="text"
          placeholder="课程名称..."
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
    <el-table-column prop="course_name" label="专业名称" width="auto" />
    <el-table-column prop="teacher.real_name" label="任课教师" width="auto" />
    <el-table-column prop="time" label="课时" width="auto" />
    <el-table-column label="已选" width="auto" align="center">
      <template #default="{ row }">
        <el-tag type="success"> {{ row.choice }}人</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="剩余" v width="auto">
      <template #default="{ row }">
        <el-tag v-if="row.count === row.choice" effect="dark" type="warning">
          已满
        </el-tag>
        <el-tag v-else effect="dark" type="success">
          {{ row.count - row.choice }}人
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="总人数" width="auto" align="center">
      <template #default="{ row }">
        <el-tag type="info" effect="dark"> {{ row.count }}人</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="description" label="课程描述" width="auto" />
    <el-table-column label="创建时间" align="center" width="180">
      <template #default="{ row }">
        {{ moment(row.create_time).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center" width="300">
      <template #default="{ row }">
        <el-button type="primary" @click="handleChoiceCourse(row)">
          选择
        </el-button>
        <el-button type="primary" @click="handleQuitCourse(row)">
          退选
        </el-button>
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
          <el-form-item label="课程名称" prop="course_name">
            <el-input
              v-model="dialogForm.course_name"
              type="text"
              placeholder="课程名称"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="任课老师" prop="teacher_id">
            <el-select
              style="width: 100%"
              v-model="dialogForm.teacher_id"
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in teachers"
                :key="index"
                :label="item.real_name"
                :value="item.user_id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="课程人数" prop="count">
            <template #default="{ row }">
              <el-input-number
                v-model="dialogForm.count"
                controls-position="right"
                :min="5"
                :max="200"
                style="width: 100%"
              >
                {{ row.count }}
              </el-input-number>
            </template>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="课时" prop="time">
            <template #default="{ row }">
              <el-input-number
                :min="4"
                :max="20"
                controls-position="right"
                v-model="dialogForm.time"
                style="width: 100%"
              >
                {{ row.time }}
              </el-input-number>
            </template>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="课程描述" prop="description">
            <el-input
              v-model="dialogForm.description"
              type="textarea"
              :rows="5"
              resize="none"
              placeholder="课程描述(默认：空)"
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
