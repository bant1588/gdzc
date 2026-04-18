<template>
  <el-container class="app-container">
    <el-header class="app-header">
      <h1 class="app-title">企业所得税年报申报模拟系统</h1>
      <div class="header-actions">
        <el-button type="primary" @click="handleExport">导出数据</el-button>
        <el-button @click="handleImport">导入数据</el-button>
        <el-button type="success" @click="handleSave">保存数据</el-button>
      </div>
      <input ref="fileInput" type="file" accept=".json" style="display: none" @change="onFileImport" />
    </el-header>
    
    <el-container>
      <el-aside width="220px" class="app-sidebar">
        <el-menu :default-active="currentRoute" router class="sidebar-menu">
          <el-menu-item index="/basic-info">
            <el-icon><Document /></el-icon>
            <span>基础信息</span>
          </el-menu-item>
          <el-menu-item index="/main-form">
            <el-icon><Grid /></el-icon>
            <span>主表</span>
          </el-menu-item>
          <el-menu-item index="/income-detail">
            <el-icon><Money /></el-icon>
            <span>收入明细表</span>
          </el-menu-item>
          <el-menu-item index="/cost-detail">
            <el-icon><Coin /></el-icon>
            <span>成本费用明细表</span>
          </el-menu-item>
          <el-menu-item index="/period-cost">
            <el-icon><Clock /></el-icon>
            <span>期间费用明细表</span>
          </el-menu-item>
          <el-menu-item index="/tax-adjustment">
            <el-icon><Setting /></el-icon>
            <span>纳税调整</span>
          </el-menu-item>
          <el-menu-item index="/tax-incentive">
            <el-icon><Gift /></el-icon>
            <span>税收优惠</span>
          </el-menu-item>
          <el-menu-item index="/preview">
            <el-icon><View /></el-icon>
            <span>申报预览</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      
      <el-main class="app-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTaxStore } from '@/store/tax'
import { ElMessage } from 'element-plus'
import {
  Document, Grid, Money, Coin, Clock, Setting, Gift, View
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const taxStore = useTaxStore()
const fileInput = ref(null)

const currentRoute = computed(() => route.path)

onMounted(() => {
  taxStore.loadFromLocalStorage()
})

const handleExport = () => {
  taxStore.exportData()
  ElMessage.success('数据导出成功')
}

const handleImport = () => {
  fileInput.value.click()
}

const onFileImport = async (event) => {
  const file = event.target.files[0]
  if (file) {
    try {
      await taxStore.importData(file)
      ElMessage.success('数据导入成功')
    } catch (error) {
      ElMessage.error('数据导入失败：' + error.message)
    }
  }
}

const handleSave = () => {
  taxStore.saveToLocalStorage()
  ElMessage.success('数据保存成功')
}
</script>

<style lang="scss" scoped>
.app-container {
  height: 100vh;
  width: 100%;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  
  .app-title {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
  }
  
  .header-actions {
    display: flex;
    gap: 10px;
  }
}

.app-sidebar {
  background: #f5f7fa;
  border-right: 1px solid #e4e7ed;
  
  .sidebar-menu {
    border: none;
    background: transparent;
    
    .el-menu-item {
      border-radius: 8px;
      margin: 4px 8px;
      
      &.is-active {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }
    }
  }
}

.app-main {
  background: #f8f9fa;
  padding: 20px;
  overflow-y: auto;
}
</style>