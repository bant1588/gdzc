<template>
  <div class="form-container">
    <h2 class="form-title">A105000 纳税调整项目明细表</h2>
    
    <el-form :model="taxAdjustment" label-width="auto" class="form-section">
      <h3 class="section-title">一、收入类调整项目</h3>
      
      <el-table :data="incomeAdjustmentData" border size="small">
        <el-table-column prop="rowNo" label="行次" width="60" />
        <el-table-column prop="item" label="项目" min-width="200" />
        <el-table-column prop="bookValue" label="账载金额" width="150">
          <template #default="{ row }">
            <el-input-number
              v-model="row.bookValue"
              :step="0.01"
              controls-position="right"
              class="full-width"
            />
          </template>
        </el-table-column>
        <el-table-column prop="taxValue" label="税收金额" width="150">
          <template #default="{ row }">
            <el-input-number
              v-model="row.taxValue"
              :step="0.01"
              controls-position="right"
              class="full-width"
            />
          </template>
        </el-table-column>
        <el-table-column prop="addAmount" label="调增金额" width="150">
          <template #default="{ row }">
            <el-input-number
              v-model="row.addAmount"
              :min="0"
              :step="0.01"
              controls-position="right"
              class="full-width"
            />
          </template>
        </el-table-column>
        <el-table-column prop="reduceAmount" label="调减金额" width="150">
          <template #default="{ row }">
            <el-input-number
              v-model="row.reduceAmount"
              :min="0"
              :step="0.01"
              controls-position="right"
              class="full-width"
            />
          </template>
        </el-table-column>
      </el-table>
      
      <div class="subtotal-row">
        <span>收入类调整合计：调增 {{ formatNumber(incomeTotal.add) }} | 调减 {{ formatNumber(incomeTotal.reduce) }}</span>
      </div>
    </el-form>
    
    <el-form :model="taxAdjustment" label-width="auto" class="form-section">
      <h3 class="section-title">二、扣除类调整项目</h3>
      
      <el-table :data="expenseAdjustmentData" border size="small">
        <el-table-column prop="rowNo" label="行次" width="60" />
        <el-table-column prop="item" label="项目" min-width="200" />
        <el-table-column prop="bookValue" label="账载金额" width="150">
          <template #default="{ row }">
            <el-input-number
              v-model="row.bookValue"
              :step="0.01"
              controls-position="right"
              class="full-width"
            />
          </template>
        </el-table-column>
        <el-table-column prop="taxValue" label="税收金额" width="150">
          <template #default="{ row }">
            <el-input-number
              v-model="row.taxValue"
              :step="0.01"
              controls-position="right"
              class="full-width"
            />
          </template>
        </el-table-column>
        <el-table-column prop="addAmount" label="调增金额" width="150">
          <template #default="{ row }">
            <el-input-number
              v-model="row.addAmount"
              :min="0"
              :step="0.01"
              controls-position="right"
              class="full-width"
            />
          </template>
        </el-table-column>
        <el-table-column prop="reduceAmount" label="调减金额" width="150">
          <template #default="{ row }">
            <el-input-number
              v-model="row.reduceAmount"
              :min="0"
              :step="0.01"
              controls-position="right"
              class="full-width"
            />
          </template>
        </el-table-column>
      </el-table>
      
      <div class="subtotal-row">
        <span>扣除类调整合计：调增 {{ formatNumber(expenseTotal.add) }} | 调减 {{ formatNumber(expenseTotal.reduce) }}</span>
      </div>
    </el-form>
    
    <div class="form-actions">
      <el-button type="primary" @click="handleSave">保存</el-button>
      <el-button @click="handleReset">重置</el-button>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { useTaxStore } from '@/store/tax'
import { ElMessage } from 'element-plus'

const taxStore = useTaxStore()
const taxAdjustment = reactive(taxStore.taxAdjustment)

taxAdjustment.incomeAdjustments = [
  { rowNo: '2', item: '视同销售收入', bookValue: 0, taxValue: 0, addAmount: 0, reduceAmount: 0 },
  { rowNo: '3', item: '未按权责发生制确认收入', bookValue: 0, taxValue: 0, addAmount: 0, reduceAmount: 0 },
  { rowNo: '4', item: '投资收益', bookValue: 0, taxValue: 0, addAmount: 0, reduceAmount: 0 }
]

taxAdjustment.expenseAdjustments = [
  { rowNo: '13', item: '视同成本', bookValue: 0, taxValue: 0, addAmount: 0, reduceAmount: 0 },
  { rowNo: '14', item: '职工薪酬', bookValue: 0, taxValue: 0, addAmount: 0, reduceAmount: 0 },
  { rowNo: '15', item: '业务招待费', bookValue: 0, taxValue: 0, addAmount: 0, reduceAmount: 0 },
  { rowNo: '16', item: '广告费和业务宣传费', bookValue: 0, taxValue: 0, addAmount: 0, reduceAmount: 0 }
]

const incomeAdjustmentData = computed(() => taxAdjustment.incomeAdjustments)
const expenseAdjustmentData = computed(() => taxAdjustment.expenseAdjustments)

const incomeTotal = computed(() => {
  const inc = taxAdjustment.incomeAdjustments
  return {
    add: inc.reduce((sum, item) => sum + (item.addAmount || 0), 0),
    reduce: inc.reduce((sum, item) => sum + (item.reduceAmount || 0), 0)
  }
})

const expenseTotal = computed(() => {
  const exp = taxAdjustment.expenseAdjustments
  return {
    add: exp.reduce((sum, item) => sum + (item.addAmount || 0), 0),
    reduce: exp.reduce((sum, item) => sum + (item.reduceAmount || 0), 0)
  }
})

const formatNumber = (value) => {
  if (value === null || value === undefined) return '0.00'
  const num = Number(value)
  return isNaN(num) ? '0.00' : num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const handleSave = () => {
  taxStore.saveToLocalStorage()
  ElMessage.success('数据保存成功')
}

const handleReset = () => {
  taxAdjustment.incomeAdjustments.forEach(item => {
    item.bookValue = 0
    item.taxValue = 0
    item.addAmount = 0
    item.reduceAmount = 0
  })
  taxAdjustment.expenseAdjustments.forEach(item => {
    item.bookValue = 0
    item.taxValue = 0
    item.addAmount = 0
    item.reduceAmount = 0
  })
  ElMessage.info('已重置')
}
</script>

<style lang="scss" scoped>
.form-container {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.form-title {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 24px;
  text-align: center;
}

.form-section {
  margin-bottom: 30px;
  
  .section-title {
    font-size: 16px;
    font-weight: bold;
    color: #606266;
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 2px solid #409eff;
  }
}

.full-width {
  width: 100%;
}

.subtotal-row {
  padding: 12px 16px;
  margin-top: 12px;
  background: #f5f7fa;
  border-radius: 4px;
  font-weight: 500;
  color: #606266;
}

.form-actions {
  text-align: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}
</style>