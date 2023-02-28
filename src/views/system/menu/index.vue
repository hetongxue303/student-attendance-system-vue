<script setup lang="ts">
import { Menu, MenuTreeDto, QueryMenuTree } from '../../../types/entity'
import { onMounted, reactive, ref, watch } from 'vue'
import { ElMessageBox, ElNotification, ElTable } from 'element-plus'
import { delayRequest } from '../../../utils/common'
import { deleteMenu, getMenuTreeList, updateMenuShow } from '../../../api/menu'
import { cloneDeep } from 'lodash'
import moment from 'moment'
import { DATE_TIME_FORMAT, DURATION_TIME } from '../../../settings'

const tableData = ref<MenuTreeDto[]>([])
const tableSelectionRef = ref<InstanceType<typeof ElTable>>()
const tableSelection = ref<MenuTreeDto[]>([])
const tableLoading = ref<boolean>(false)
const query: QueryMenuTree = reactive({})
const showLoading = ref<boolean>(false)
const expand = ref<boolean>(false)
const handleSelection = (data: MenuTreeDto[]) => (tableSelection.value = data)
watch(
  () => query,
  (value) => {
    if (value.menu_title === '') query.menu_title = undefined
    getTableList()
  },
  { deep: true }
)
const getTableList = () => {
  tableLoading.value = true
  delayRequest(
    () => {
      getMenuTreeList(query)
        .then(({ data }) => {
          if (data.code === 200) tableData.value = cloneDeep(data.data)
        })
        .finally(() => (tableLoading.value = false))
    },
    5,
    500
  )
}
const handleShow = (row: Menu) => {
  showLoading.value = true
  updateMenuShow(row)
    .then(({ data }) => {
      if (data.code === 200) {
        ElNotification.success({
          message: '更新成功',
          duration: DURATION_TIME
        })
        getTableList()
        return
      }
      ElNotification.error({
        message: '删除失败，请重试！',
        duration: DURATION_TIME
      })
    })
    .catch(() => (row.is_show = !row.is_show))
    .finally(() => (showLoading.value = false))
}
watch(
  () => query,
  () => getTableList(),
  { deep: true }
)
onMounted(() => getTableList())

const isDialog = ref<boolean>(false)
const dialogTitle = ref<string>('')
const dialogOperate = ref<string>('')
const dialogForm = ref<MenuTreeDto>({})

enum operates {
  insert = 'insert',
  update = 'update'
}

const openDialog = (operate: operates, row?: MenuTreeDto) => {
  if (operate === operates.insert) {
    dialogTitle.value = '新增'
  } else {
    dialogTitle.value = '编辑'
    if (row) {
      dialogForm.value = cloneDeep(row)
    } else {
      dialogForm.value = cloneDeep(tableSelection.value[0])
    }
  }
  dialogOperate.value = operate
  isDialog.value = true
}
const handleOperate = () => {}
const handleDelete = (menu_id: number) => {
  ElMessageBox.confirm('确认删除该菜单吗？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '返回',
    type: 'warning'
  }).then(() => {
    deleteMenu(menu_id).then(({ data }) => {
      if (data.code === 200) {
        ElNotification.success({
          message: '删除成功',
          duration: DURATION_TIME
        })
        getTableList()
        return
      }
      ElNotification.error({
        message: '删除失败，请重试!',
        duration: DURATION_TIME
      })
    })
  })
}
</script>

<template>
  <el-dialog v-model="isDialog" :title="dialogTitle">
    <template #footer>
      <el-button type="danger" text @click="isDialog = false">返回</el-button>
      <el-button type="primary" @click="handleOperate">确定</el-button>
    </template>
  </el-dialog>
  <el-card body-style="padding:0">
    <el-row
      :gutter="10"
      style="
        height: 60px;
        display: flex;
        align-items: center;
        padding: 0 0 0 20px;
      "
    >
      <el-col :span="18">
        <el-button
          class="header-button"
          icon="Refresh"
          color="#000000"
          @click="getTableList"
        />
        <el-button
          class="header-button"
          icon="Plus"
          color="#000000"
          type="primary"
          @click="openDialog(operates.insert)"
        >
          添加
        </el-button>
        <el-button
          class="header-button"
          icon="EditPen"
          color="#000000"
          type="primary"
          @click="openDialog(operates.update)"
        >
          编辑
        </el-button>
        <el-button class="header-button" icon="Delete" color="#000000">
          删除
        </el-button>
        <el-button
          v-if="!expand"
          class="header-button"
          color="#000000"
          @click="expand = true"
        >
          展开所有
        </el-button>
        <el-button
          v-else
          class="header-button"
          color="#000000"
          @click="expand = false"
        >
          收缩所有
        </el-button>
      </el-col>
      <el-col :span="4">
        <el-input
          v-model="query.menu_title"
          placeholder="通过标题模糊搜索"
          clearable
          @clear="query.menu_title = undefined"
        />
      </el-col>
      <el-col :span="1">
        <el-dropdown>
          <el-button icon="Grid" class="grid-button" />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>标题</el-dropdown-item>
              <el-dropdown-item>图标</el-dropdown-item>
              <el-dropdown-item>名称</el-dropdown-item>
              <el-dropdown-item>地址</el-dropdown-item>
              <el-dropdown-item>类型</el-dropdown-item>
              <el-dropdown-item>显示</el-dropdown-item>
              <el-dropdown-item>状态</el-dropdown-item>
              <el-dropdown-item>修改时间</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-col>
    </el-row>
    <el-table
      ref="tableSelectionRef"
      v-loading="tableLoading"
      :data="tableData"
      :style="{ width: '100%' }"
      border
      stripe
      :default-expand-all="expand"
      empty-text="暂无菜单"
      class-name="table-style"
      header-row-class-name="table-header-row-style"
      table-layout="fixed"
      row-key="menu_id"
      @selection-change="handleSelection"
    >
      <el-table-column type="selection" width="40" align="center" />
      <el-table-column prop="menu_title" label="标题" width="150" />
      <el-table-column label="图标" align="center" width="60">
        <template #default="{ row }">
          <svg-icon :name="row.icon" :ml="10" />
        </template>
      </el-table-column>
      <el-table-column prop="menu_name" label="名称" align="center" />
      <el-table-column
        prop="path"
        label="地址"
        align="center"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="类型" width="100" align="center">
        <template #default="{ row }">
          <el-tag
            v-if="row.menu_type === 1 && !row.is_sub"
            type="danger"
            disable-transitions
          >
            菜单选项
          </el-tag>
          <el-tag
            v-else-if="row.menu_type === 1 && row.is_sub"
            type="success"
            disable-transitions
          >
            菜单目录
          </el-tag>
          <el-tag v-else type="info" disable-transitions>页面按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="显示" align="center" width="80">
        <template #default="{ row }">
          <el-switch
            v-model="row.is_show"
            :loading="showLoading"
            @change="handleShow(row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="修改时间"
        width="180"
        align="center"
        :show-overflow-tooltip="true"
      >
        <template #default="{ row }">
          {{ moment(row.update_time).format(DATE_TIME_FORMAT) }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150" align="center">
        <template #default="{ row }">
          <el-tooltip content="拖动排序" placement="top" effect="dark">
            <el-button class="table-button" icon="Rank" type="info" />
          </el-tooltip>
          <el-tooltip content="编辑" placement="top" effect="dark">
            <el-button
              class="table-button"
              icon="EditPen"
              type="primary"
              @click="openDialog(operates.update, row)"
            />
          </el-tooltip>
          <el-tooltip content="删除" placement="top" effect="dark">
            <el-button
              icon="Delete"
              class="table-button"
              type="danger"
              @click="handleDelete(row.menu_id)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<style scoped lang="scss">
@mixin flex-default {
  display: flex;
  justify-content: center;
  align-items: center;
}

:deep(.el-button.grid-button):hover {
  color: #000000;
  background-color: rgb(222, 223, 224);
}

:deep(.el-button.header-button) {
  height: 32px;
  width: 76px;
  border: none;

  &:hover {
    background-color: white;
    opacity: 0.7;
  }

  &:nth-child(1) {
    height: 32px;
    width: 43px;
    background-color: rgb(64, 72, 91);
  }

  &:nth-child(2) {
    background-color: rgb(64, 158, 255);
  }

  &:nth-child(3) {
    background-color: rgb(64, 158, 255);
  }

  &:nth-child(4) {
    background-color: rgb(245, 108, 108);
  }

  &:nth-child(5) {
    background-color: rgb(230, 162, 60);
  }
}

:deep(.el-button.table-button) {
  height: 25px;
  width: 25px;
  padding: 5px;
  margin-right: -2px;

  &:last-child {
    margin-right: 0;
  }
}

.table-style {
  font-size: 14px;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, SimSun, sans-serif;
}

:deep(.table-header-row-style) {
  font-weight: bold;
  color: black;
}
</style>
