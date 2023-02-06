<script setup lang="ts">
import Pagination from '../../components/Pagination/Index.vue'
import { onMounted, reactive, ref, watch } from 'vue'
import moment from 'moment'
import { cloneDeep } from 'lodash'
import { ElMessage, ElMessageBox, ElNotification, ElTable } from 'element-plus'
import { Course, QueryCourse } from '../../types/entity'
import {
  getCoursePage,
  updateCourseChoice,
  updateCourseQuit
} from '../../api/course'
import { randomTimeout } from '../../utils/common'

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
  }, randomTimeout(5, 500))
}
onMounted(() => getCourseListPage())

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

// 处理选课/退课
const handleCourseChoice = async (row: any) => {
  if (row.course.count === row.course.choice) {
    ElMessage.warning('课程已满')
    return
  }
  ElMessageBox.confirm(
    `确认选择 ${row.course.teacher?.real_name}老师 的《${row.course.course_name}》课程吗?`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    const { data } = await updateCourseChoice(row.course.course_id as number)
    if (data.code === 200) {
      ElNotification.success('选课成功')
      await getCourseListPage()
      return
    }
    ElNotification.success('选课失败，请重试！')
  })
}
const handleCourseQuit = (row: any) => {
  ElMessageBox.confirm(
    `确认退选 ${row.course.teacher?.real_name}老师 的《${row.course.course_name}》课程吗?`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    const { data } = await updateCourseQuit(row.course.course_id as number)
    if (data.code === 200) {
      ElNotification.success('退选成功')
      await getCourseListPage()
      return
    }
    ElNotification.success('退选失败，请重试！')
  })
}
</script>

<template>
  <!--表格工具-->
  <div class="table-tool">
    <el-row :gutter="20" class="search-box">
      <el-col :span="3">
        <el-input
          v-model="query.course_name"
          type="text"
          placeholder="课程名称"
        />
      </el-col>
      <el-button icon="RefreshLeft" type="warning" @click="resetSearch">
        重置
      </el-button>
    </el-row>
  </div>

  <!--表格-->
  <el-table :data="tableData" width="100%" v-loading="tableLoading">
    <el-table-column prop="course.course_name" label="课程名称" width="auto" />
    <el-table-column
      prop="course.teacher.real_name"
      label="任课教师"
      width="auto"
    />
    <el-table-column prop="course.class_time" label="课时" width="auto" />
    <el-table-column label="已选" width="auto" align="center">
      <template #default="{ row }">
        <el-tag disable-transitions type="info">
          {{ row.course.choice }}人
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="剩余" v width="auto">
      <template #default="{ row }">
        <el-tag
          disable-transitions
          :type="row.course.count === row.course.choice ? 'danger' : 'info'"
        >
          {{
            row.course.count === row.course.choice
              ? '已满'
              : `${row.course.count - row.course.choice}人`
          }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="总人数" width="auto" align="center">
      <template #default="{ row }">
        <el-tag disable-transitions type="info" effect="dark">
          {{ row.course.count }}人
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="course.description" label="课程描述" width="auto" />
    <el-table-column label="发布时间" align="center" width="180">
      <template #default="{ row }">
        {{ moment(row.course.create_time).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center" width="200">
      <template #default="{ row }">
        <el-button
          :type="row.is_choice ? 'success' : 'primary'"
          :disabled="row.course.count === row.course.choice || row.is_choice"
          @click="handleCourseChoice(row)"
        >
          {{ row.is_choice ? '已选' : '选择' }}
        </el-button>
        <el-button
          type="danger"
          @click="handleCourseQuit(row)"
          :disabled="!row.is_choice"
        >
          退选
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
