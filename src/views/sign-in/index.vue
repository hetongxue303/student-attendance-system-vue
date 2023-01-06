<script setup lang="ts">
import Pagination from '../../components/Pagination/Index.vue'
import { onMounted, reactive, ref, watch } from 'vue'
import moment from 'moment'
import { cloneDeep } from 'lodash'
import { ElMessage, ElNotification, ElTable } from 'element-plus'
import { getStudentAttendancePage } from '../../api/attendance'
import { studentAttendance } from '../../api/attendance_record'
import {
  QueryStudentAttendance,
  StudentAttendanceDto
} from '../../types/entity'

const tableData = ref<StudentAttendanceDto[]>([])
const tableLoading = ref<boolean>(false)
const getAttendanceListPage = async () => {
  tableLoading.value = true
  setTimeout(async () => {
    const { data } = await getStudentAttendancePage(query)
    tableData.value = cloneDeep(data.data.record)
    total.value = JSON.parse(data.data.total)
    tableLoading.value = false
  }, Math.floor(Math.random() * (500 - 10)) + 10)
}
onMounted(() => getAttendanceListPage())

const query: QueryStudentAttendance = reactive({
  currentPage: 1,
  pageSize: 10
})

const total = ref<number>(0)
const handleCurrentChange = (currentPage: number) =>
  (query.currentPage = currentPage)

const handleSizeChange = (pageSize: number) => (query.pageSize = pageSize)

const resetSearch = () => {
  query.real_name = undefined
  query.course_name = undefined
  query.status = undefined
}

watch(
  () => query,
  async () => {
    await getAttendanceListPage()
  },
  { deep: true }
)

const handleAttendanceEnd = async (type: number, row: StudentAttendanceDto) => {
  const types = [0, 1, 2, 3]
  if (!types.includes(type)) {
    ElMessage.warning('发生错误')
    return
  }
  if (row.attendance?.is_end) {
    ElMessage.warning('签到已结束')
    return
  }
  const { data } = await studentAttendance({
    attendance_type: type,
    attendance_id: row.attendance?.attendance_id
  })
  if (data.code === 200) {
    ElNotification.success('签到成功')
    await getAttendanceListPage()
    return
  }
  ElNotification.error('签到失败，请重试！')
}
</script>

<template>
  <div class="table-tool">
    <el-row :gutter="20" class="search-box">
      <el-col :span="3">
        <el-input
          v-model="query.course_name"
          type="text"
          placeholder="课程名称"
        />
      </el-col>
      <el-col :span="3">
        <el-input
          v-model="query.real_name"
          type="text"
          placeholder="教师名称"
        />
      </el-col>
      <el-col :span="3">
        <el-select
          v-model="query.status"
          placeholder="状态"
          clearable
          @clear="query.status = undefined"
        >
          <el-option label="签到中" :value="0" />
          <el-option label="已结束" :value="1" />
        </el-select>
      </el-col>
      <el-button icon="RefreshLeft" type="warning" @click="resetSearch">
        重置
      </el-button>
    </el-row>
  </div>

  <el-table :data="tableData" width="100%" v-loading="tableLoading">
    <el-table-column
      prop="attendance.course.course_name"
      label="课程名称"
      width="auto"
    />
    <el-table-column
      prop="attendance.user.real_name"
      label="任课教师"
      width="auto"
    />
    <el-table-column label="状态" align="center" width="auto">
      <template #default="{ row }">
        <el-tag
          disable-transitions
          :type="row.attendance.is_end ? 'success' : 'warning'"
        >
          {{ row.attendance.is_end ? '已结束' : '签到中' }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="发布时间" align="center" width="180">
      <template #default="{ row }">
        {{ moment(row.attendance.release_time).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
    </el-table-column>
    <el-table-column label="结束时间" align="center" width="180">
      <template #default="{ row }">
        {{ moment(row.attendance.end_time).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center" width="200">
      <template #default="{ row }">
        <el-button
          :type="
            row.attendance.is_end || row.attendance_record
              ? 'success'
              : 'primary'
          "
          @click="handleAttendanceEnd(1, row)"
          :disabled="row.attendance.is_end || row.attendance_record"
        >
          {{ row.attendance.is_end || row.attendance_record ? '已签' : '签到' }}
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
}
</style>
