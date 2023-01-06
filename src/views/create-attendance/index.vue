<script setup lang="ts">
import Pagination from '../../components/Pagination/Index.vue'
import { onMounted, reactive, ref, watch } from 'vue'
import { getTeacherCourseAll } from '../../api/course'
import { cloneDeep } from 'lodash'
import { randomTimeout } from '../../utils/common'
import moment from 'moment'
import {
  addAttendance,
  getAttendancePage,
  getStudentCheckedPage,
  updateAttendance,
  updateStudentAttendanceDetail
} from '../../api/attendance'
import {
  Attendance,
  Course,
  QueryAttendance,
  StudentAttendanceRecord,
  updateAttendanceStatusVo
} from '../../types/entity'
import {
  ElMessage,
  ElNotification,
  FormInstance,
  FormRules
} from 'element-plus'

/**
 * 处理时间
 * @param now
 * @param temp
 */
const handleTime = (now: number, temp: any): Date | undefined => {
  const duration: number = temp.duration as number
  switch (temp.type) {
    case 1:
      return new Date(now + duration * 1000)
    case 2:
      return new Date(now + duration * 60 * 1000)
    case 3:
      return new Date(now + duration * 60 * 60 * 1000)
  }
}
const handleCreate = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      dialogForm.release_time = new Date()
      dialogForm.end_time = handleTime(
        dialogForm.release_time.getTime(),
        temp
      ) as Date
      const { data } = await addAttendance(dialogForm)
      if (data.code === 200) {
        ElNotification.success('发布成功')
        dialog.show = false
        await getAttendancePageList()
        return
      }
      ElNotification.error('发布失败，请重试！')
    }
  })
}
const dialogForm: Attendance = reactive({})
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  course_id: [
    {
      required: true,
      type: 'number',
      message: '课程名称不能为空',
      trigger: 'blur'
    }
  ]
})
const courses = ref<Course[]>([])
const temp: { type?: number; duration?: number } = reactive({
  type: 2,
  duration: undefined
})
const dialog = reactive({
  show: false,
  title: '',
  operate: ''
})
const setDialog = () => {
  dialog.show = true
  dialog.title = '发布签到'
  getTeacherCourseList()
}
const getTeacherCourseList = async () => {
  const { data } = await getTeacherCourseAll()
  if (data.code === 200) courses.value = cloneDeep(data.data)
}

const tableLoading = ref<boolean>(false)
const total = ref<number>(0)
const tableData = ref<Attendance[]>([])
const query: QueryAttendance = reactive({
  currentPage: 1,
  pageSize: 10
})
const getAttendancePageList = async () => {
  tableLoading.value = true
  setTimeout(async () => {
    const { data } = await getAttendancePage(query)
    tableData.value = cloneDeep(data.data.record)
    total.value = JSON.parse(data.data.total)
    tableLoading.value = false
  }, randomTimeout(5, 500))
}
onMounted(() => getAttendancePageList())
const handleEndAttendance = async (row: Attendance) => {
  row.is_end = true
  const { data } = await updateAttendance(row)
  if (data.code === 200) {
    ElNotification.success('已结束')
    await getAttendancePageList()
    return
  }
  ElNotification.error('操作失败，请重试！')
}
const handleCurrentChange = (currentPage: number) =>
  (query.currentPage = currentPage)

const handleSizeChange = (pageSize: number) => (query.pageSize = pageSize)
watch(
  () => query,
  () => getAttendancePageList(),
  { deep: true }
)

/*签到详情相关*/
const detailDialog = ref<boolean>(false)
const tabQuery: QueryAttendance = reactive({
  active: 1,
  currentPage: 1,
  pageSize: 10
})
const tabData = ref<StudentAttendanceRecord[]>([])
const tabTotal = ref<number>(0)
const updateDialog = ref<boolean>(false)
const tabLoading = ref<boolean>(false)
const setTabDialog = async (row: Attendance) => {
  detailDialog.value = true
  tabQuery.attendance_id = row.attendance_id
  tabQuery.active = 1
  await handleAttendanceDetailList()
}
const handleAttendanceDetailList = async () => {
  tabLoading.value = true
  setTimeout(async () => {
    const { data } = await getStudentCheckedPage(tabQuery)
    tabData.value = cloneDeep(data.data.record)
    tabTotal.value = JSON.parse(data.data.total)
    tabLoading.value = false
  }, randomTimeout(5, 500))
}
const handleTabCurrentChange = (currentPage: number) =>
  (tabQuery.currentPage = currentPage)

const handleTabSizeChange = (pageSize: number) => (tabQuery.pageSize = pageSize)
watch(
  () => tabQuery,
  () => handleAttendanceDetailList(),
  { deep: true }
)
watch(
  () => tabQuery.active,
  async () => {
    tabData.value = []
    await handleAttendanceDetailList()
    tabQuery.currentPage = 1
    tabQuery.pageSize = 10
  }
)
const updateStatusData: updateAttendanceStatusVo = reactive({
  attendance_type: 1
})
const openConfirm = (row: StudentAttendanceRecord) => {
  updateStatusData.attendance_id = row.attendance_id
  updateStatusData.user_id = row.user_id
  updateDialog.value = true
}
const updateAttendanceStatus = async () => {
  const { data } = await updateStudentAttendanceDetail(updateStatusData)
  if (data.code === 200) {
    ElMessage.success('更改成功')
    updateDialog.value = false
    await handleAttendanceDetailList()
    return
  }
  ElMessage.error('更改失败，请重试！')
}
const handleClose = async () => await handleAttendanceDetailList()
const resetSearch = () => {
  query.course_name = undefined
  query.is_end = undefined
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
        <el-select v-model="query.is_end" placeholder="状态">
          <el-option label="签到中" :value="0" />
          <el-option label="已结束" :value="1" />
        </el-select>
      </el-col>
      <el-button icon="RefreshLeft" type="warning" @click="resetSearch">
        重置
      </el-button>
    </el-row>
    <div class="operate-box">
      <el-button @click.stop="setDialog" type="primary">发布签到</el-button>
    </div>
  </div>
  <el-table v-loading="tableLoading" width="100%" :data="tableData">
    <el-table-column prop="course.course_name" label="课程名称" width="auto" />
    <el-table-column
      prop="user.real_name"
      label="任课教师"
      width="auto"
      align="center"
    />
    <el-table-column
      prop="attendance_count"
      label="已签人数"
      width="auto"
      align="center"
    />
    <el-table-column
      prop="course_count"
      label="课程人数"
      width="auto"
      align="center"
    />
    <el-table-column label="状态" width="auto" align="center">
      <template #default="{ row }">
        <el-tag :type="row.is_end ? 'success' : 'warning'">
          {{ row.is_end ? '已结束' : '签到中' }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="发布时间" align="center" width="180">
      <template #default="{ row }">
        {{ moment(row.release_time).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center" width="200">
      <template #default="{ row }">
        <el-button type="success" @click="setTabDialog(row)"> 查看</el-button>
        <el-button
          @click="handleEndAttendance(row)"
          type="warning"
          :disabled="row.is_end"
        >
          结束
        </el-button>
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
  <!--发布签到-->
  <el-dialog
    v-model="dialog.show"
    :title="dialog.title"
    width="20%"
    :close-on-click-modal="false"
  >
    <el-form
      ref="ruleFormRef"
      :model="dialogForm"
      :rules="rules"
      label-width="80px"
    >
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="课程名称" prop="course_id">
            <el-select
              v-model="dialogForm.course_id"
              style="width: 100%"
              placeholder="请选择"
              clearable
              @clear="dialogForm.course_id = undefined"
            >
              <el-option
                v-for="(item, index) in courses"
                :key="index"
                :label="item.course_name"
                :value="item.course_id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="签到时长" prop="duration">
            <el-input type="number" v-model="temp.duration">
              <template #append>
                <el-select
                  v-model="temp.type"
                  placeholder="请选择"
                  style="width: 80px"
                  clearable
                >
                  <el-option label="秒钟" :value="1" />
                  <el-option label="分钟" :value="2" />
                  <el-option label="小时" :value="3" />
                </el-select>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialog.show = false">返回</el-button>
        <el-button type="primary" @click="handleCreate(ruleFormRef)">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
  <!--签到详情-->
  <el-dialog
    v-model="detailDialog"
    title="签到详情"
    width="60%"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-tabs v-model="tabQuery.active">
      <el-tab-pane label="已签到" :name="1">
        <el-table :data="tabData">
          <el-table-column
            prop="real_name"
            label="学生姓名"
            width="auto"
            align="center"
            v-loading="tabLoading"
          />
          <el-table-column label="性别" width="auto" align="center">
            <template #default="{ row }">
              {{ row.gender === 1 ? '男' : '女' }}
            </template>
          </el-table-column>
          <el-table-column label="状态" width="auto" align="center">
            <template #default="{ row }">
              <el-tag
                :disable-transitions="false"
                type="success"
                v-if="row.attendance_type === 1"
              >
                已签到
              </el-tag>
              <el-tag
                :disable-transitions="false"
                type="warning"
                v-else-if="row.attendance_type === 2"
              >
                请假
              </el-tag>
              <el-tag
                :disable-transitions="false"
                type="danger"
                v-else-if="row.attendance_type === 3"
              >
                缺勤
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="签到时间" width="auto" align="center">
            <template #default="{ row }">
              {{ moment(row.attendance_time).format('YYYY-MM-DD HH:mm:ss') }}
            </template>
          </el-table-column>
        </el-table>
        <Pagination
          :current-page="tabQuery.currentPage"
          :page-size="tabQuery.pageSize"
          :total="tabTotal"
          @size-change="handleTabSizeChange"
          @current-change="handleTabCurrentChange"
        />
      </el-tab-pane>
      <el-tab-pane label="未签到" :name="2">
        <el-table :data="tabData">
          <el-table-column
            prop="real_name"
            label="学生姓名"
            width="auto"
            align="center"
          />
          <el-table-column label="性别" width="auto" align="center">
            <template #default="{ row }">
              {{ row.gender === 1 ? '男' : '女' }}
            </template>
          </el-table-column>
          <el-table-column label="是否请假" width="auto" align="center">
            <template #default="{ row }">
              <el-tag
                :disable-transitions="false"
                type="success"
                v-if="row.gender === 1"
              >
                已请假
              </el-tag>
              <el-tag
                :disable-transitions="false"
                type="warning"
                v-else-if="row.gender === 2"
              >
                未请假
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="考勤操作" align="center" width="200">
            <template #default="{ row }">
              <el-button type="success" @click="openConfirm(row)">
                更改状态
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <Pagination
          :current-page="tabQuery.currentPage"
          :page-size="tabQuery.pageSize"
          :total="tabTotal"
          @size-change="handleTabSizeChange"
          @current-change="handleTabCurrentChange"
        />
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
  <!--更改状态-->
  <el-dialog
    v-model="updateDialog"
    title="更改状态"
    width="20%"
    :close-on-click-modal="false"
  >
    <el-form>
      <el-form-item label="考勤">
        <el-radio-group v-model="updateStatusData.attendance_type">
          <el-radio-button :label="1">签到</el-radio-button>
          <el-radio-button :label="2">请假</el-radio-button>
          <el-radio-button :label="3">缺勤</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="原因">
        <el-input
          v-model="updateStatusData.description"
          type="textarea"
          :rows="3"
          resize="none"
          placeholder="默认：空"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="updateDialog = false">返回</el-button>
        <el-button type="primary" @click="updateAttendanceStatus">
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
}
</style>
