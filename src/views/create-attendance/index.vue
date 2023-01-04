<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Attendance, Course } from '../../types/entity'
import {
  ElNotification,
  FormInstance,
  FormRules,
  TabsPaneContext
} from 'element-plus'
import { getTeacherCourseAll } from '../../api/course'
import { cloneDeep } from 'lodash'
import { addAttendance, getCourseStudentInfo } from '../../api/attendance'

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
        return
      }
      ElNotification.error('发布失败，请重试！')
    }
  })
}
const dialogForm: Attendance = reactive({})
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({})
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

const tabs = ref<number>(1)
const handleTabClick = (pane: TabsPaneContext) => {
  tabs.value = pane.props.name as number
}

const getCourseStudent = async () => {
  const { data } = await getCourseStudentInfo()
  if (data.code === 200) {
    alert('获取成功')
  }
}
</script>

<template>
  <button @click.stop="setDialog" class="btn-grad">发布签到</button>
  <el-tabs type="border-card" v-model="tabs" @tab-click="handleTabClick">
    <el-tab-pane :name="1" label="已签到">
      <el-table></el-table>
    </el-tab-pane>
    <el-tab-pane :name="2" label="未签到">未签到</el-tab-pane>
    <el-tab-pane :name="3" label="历史记录">历史记录</el-tab-pane>
  </el-tabs>
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
        <el-col :span="12">
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
        <el-col :span="12">
          <el-form-item label="签到时长" prop="duration">
            <el-input type="number" v-model="temp.duration">
              <template #append>
                <el-select
                  v-model="temp.type"
                  placeholder="请选择"
                  style="width: 80px"
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
</template>

<style scoped lang="scss">
.btn-grad {
  background-image: linear-gradient(
    to right,
    #1fa2ff 0%,
    #12d8fa 51%,
    #1fa2ff 100%
  );
  margin: 10px;
  padding: 10px 25px;
  text-align: center;
  text-transform: uppercase;
  transition: 0.5s;
  background-size: 200% auto;
  color: white;
  box-shadow: 0 0 20px #eee;
  border-radius: 10px;
  display: block;
}

.btn-grad:hover {
  background-position: right center; /* change the direction of the change here */
  color: #fff;
  text-decoration: none;
}
</style>
