<script setup lang="ts">
import Pagination from '../../components/Pagination/Index.vue'
import { onMounted, reactive, ref, watch } from 'vue'
import moment from 'moment'
import { cloneDeep } from 'lodash'
import { ElMessage, ElTable, FormInstance, FormRules } from 'element-plus'
import { Course, QueryCourse } from '../../types/entity'
import { getStudentCoursePage } from '../../api/course'

const tableData = ref<Course[]>([])
const tableLoading = ref<boolean>(false)
const getStudentCourseListPage = async () => {
  tableLoading.value = true
  setTimeout(async () => {
    const { data } = await getStudentCoursePage(query)
    tableData.value = cloneDeep(data.data.record)
    total.value = JSON.parse(data.data.total)
    tableLoading.value = false
  }, Math.floor(Math.random() * (500 - 10)) + 10)
}
onMounted(() => getStudentCourseListPage())

const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({})

const query: QueryCourse = reactive({
  currentPage: 1,
  pageSize: 10
})

const total = ref<number>(0)
const handleCurrentChange = (currentPage: number) =>
  (query.currentPage = currentPage)

const handleSizeChange = (pageSize: number) => (query.pageSize = pageSize)

const handleSearch = () => {
  if (!query.course_name) {
    ElMessage.info('请输入搜索内容...')
    return
  }
  getStudentCourseListPage()
}

const resetSearch = () => (query.course_name = undefined)

watch(
  () => query,
  async () => {
    await getStudentCourseListPage()
  },
  { deep: true }
)

const dialogShow = ref<boolean>(false)
const dialogForm: Course = reactive({})

// const handleOperate = async (formEl: FormInstance | undefined) => {
//   if (!formEl) return
//   await formEl.validate(async (valid) => {
//     if (valid) {
//       if (dialog.operate === 'insert') {
//         const { data } = await addCourse(dialogForm.value)
//         if (data.code === 200) {
//           await getStudentCourseListPage()
//           dialog.show = false
//           ElNotification.success('添加成功')
//           return
//         }
//         ElNotification.error('添加失败,请重试！')
//       }
//       if (dialog.operate === 'update') {
//         const { data } = await updateCourse(dialogForm.value)
//         if (data.code === 200) {
//           await getStudentCourseListPage()
//           dialog.show = false
//           ElNotification.success('更新成功')
//           return
//         }
//         ElNotification.error('更新失败,请重试！')
//       }
//     }
//   })
// }

// 监听dialog显示
watch(
  () => dialogShow,
  (newValue) => {
    if (!newValue) ruleFormRef.value?.resetFields()
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
  </div>

  <!--表格-->
  <el-table
    ref="multipleTableRef"
    :data="tableData"
    width="100%"
    v-loading="tableLoading"
  >
    <el-table-column prop="course_name" label="专业名称" width="auto" />
    <el-table-column prop="teacher.real_name" label="任课教师" width="auto" />
    <el-table-column prop="class_time" label="课时" width="auto" />
    <el-table-column label="已选" width="auto" align="center">
      <template #default="{ row }">
        <el-tag type="success"> {{ row.choice }}人</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="剩余" v width="auto">
      <template #default="{ row }">
        <el-tag :type="row.count === row.choice ? 'danger' : 'success'">
          {{
            row.count === row.choice ? '已满' : `${row.count - row.choice}人`
          }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="总人数" width="auto" align="center">
      <template #default="{ row }">
        <el-tag type="warning" effect="dark"> {{ row.count }}人</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="description" label="课程描述" width="auto" />
    <el-table-column label="发布时间" align="center" width="180">
      <template #default="{ row }">
        {{ moment(row.create_time).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center" width="200">
      <template #default="{ row }">
        <el-button type="primary" @click="dialogShow = true">
          查看详情
        </el-button>
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
    v-model="dialogShow"
    title="课程详情"
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
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="dialogShow = false">关闭</el-button>
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

.dialog-footer {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
