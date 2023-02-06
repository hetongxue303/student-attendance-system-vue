<script setup lang="ts">
import Pagination from '../../components/Pagination/Index.vue'
import { onMounted, reactive, ref, watch } from 'vue'
import moment from 'moment'
import { cloneDeep } from 'lodash'
import { Choice, QueryChoice } from '../../types/entity'
import { ElMessageBox, ElNotification, ElTable } from 'element-plus'
import {
  getChoicePage,
  updateBatchChoice,
  updateChoice
} from '../../api/choice'

const tableData = ref<Choice[]>([])
const tableLoading = ref<boolean>(false)
const getChoiceListPage = async () => {
  tableLoading.value = true
  setTimeout(async () => {
    const { data } = await getChoicePage(query)
    tableData.value = cloneDeep(data.data.record)
    total.value = JSON.parse(data.data.total)
    tableLoading.value = false
  }, Math.floor(Math.random() * (500 - 10)) + 10)
}
onMounted(() => getChoiceListPage())
const query: QueryChoice = reactive({
  currentPage: 1,
  pageSize: 10
})
const total = ref<number>(0)
const handleCurrentChange = (currentPage: number) =>
  (query.currentPage = currentPage)
const handleSizeChange = (pageSize: number) => (query.pageSize = pageSize)
const resetSearch = () => {
  query.status = undefined
  query.real_name = undefined
  query.course_name = undefined
}
watch(
  () => query,
  async () => {
    await getChoiceListPage()
  },
  { deep: true }
)
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<Choice[]>([])
const handleSelectionChange = (choices: Choice[]) =>
  (multipleSelection.value = choices)
const handleBatchRecord = async (result: boolean) => {
  ElMessageBox.confirm(
    `确认${result ? '同意' : '拒绝'}选中的 ${
      multipleSelection.value.length
    }条 记录吗?`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    const ids: number[] = multipleSelection.value.map((item) => {
      return item.choice_id as number
    })
    const { data } = await updateBatchChoice(result, ids)
    if (data.code === 200) {
      ElNotification.success(`${result ? '同意' : '拒绝'}成功`)
      await getChoiceListPage()
      return
    }
    ElNotification.error('处理失败，请重试！')
  })
}
const handleRecord = async (result: boolean, row: Choice) => {
  result ? (row.status = 1) : (row.status = 2)
  const { data } = await updateChoice(row)
  if (data.code === 200) {
    ElNotification.success(result ? '已同意' : '已拒绝')
    await getChoiceListPage()
    return
  }
  ElNotification.success('处理失败，请重试！')
}
</script>

<template>
  <!--表格工具-->
  <div class="table-tool">
    <el-row :gutter="20" class="search-box">
      <el-col :span="3">
        <el-input
          v-model="query.real_name"
          type="text"
          placeholder="学生姓名"
        />
      </el-col>
      <el-col :span="3">
        <el-input
          v-model="query.course_name"
          type="text"
          placeholder="课程名称"
        />
      </el-col>
      <el-col :span="3">
        <el-select
          v-model="query.status"
          placeholder="选课状态"
          clearable
          @clear="query.status = undefined"
        >
          <el-option label="待确认" :value="0" />
          <el-option label="已同意" :value="1" />
          <el-option label="已拒绝" :value="2" />
        </el-select>
      </el-col>
      <el-button icon="RefreshLeft" type="warning" @click="resetSearch">
        重置
      </el-button>
    </el-row>
    <div class="operate-box">
      <el-button
        type="primary"
        @click="handleBatchRecord(true)"
        :disabled="
          multipleSelection.length === 0 ||
          query.status === undefined ||
          query.status === 0
        "
      >
        同意
      </el-button>
      <el-button
        type="danger"
        @click="handleBatchRecord(false)"
        :disabled="
          multipleSelection.length === 0 ||
          query.status === undefined ||
          query.status === 0
        "
      >
        拒绝
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
    <el-table-column
      type="selection"
      width="50"
      align="center"
      v-if="query.status === undefined || query.status === 0"
    />
    <el-table-column prop="user.real_name" label="学生姓名" width="auto" />
    <el-table-column prop="course.course_name" label="课程名称" width="auto" />
    <el-table-column label="总人数" width="auto">
      <template #default="{ row }">
        <el-tag type="info" disable-transitions>
          {{ row.course.count }}人
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="状态" width="auto" align="center">
      <template #default="{ row }">
        <el-tag type="warning" disable-transitions v-if="row.status === 0">
          待确认
        </el-tag>
        <el-tag type="success" disable-transitions v-else-if="row.status === 1">
          已同意
        </el-tag>
        <el-tag type="danger" disable-transitions v-else> 已拒绝</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="申请时间" align="center" width="auto">
      <template #default="{ row }">
        {{ moment(row.create_time).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
    </el-table-column>
    <el-table-column
      label="操作"
      align="center"
      width="200"
      v-if="query.status === undefined || query.status === 0"
    >
      <template #default="{ row }">
        <el-button
          type="primary"
          :disabled="row.status !== 0"
          @click="handleRecord(true, row)"
        >
          同意
        </el-button>
        <el-button
          type="danger"
          :disabled="row.status !== 0"
          @click="handleRecord(false, row)"
        >
          拒绝
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
