<template>
  <div class="form-container">
    <h2 class="form-title">A104000 期间费用明细表</h2>
    
    <el-form :model="periodCost" label-width="auto" class="form-section">
      <el-table :data="expenseData" border size="small" show-summary>
        <el-table-column prop="rowNo" label="行次" width="60" />
        <el-table-column prop="item" label="项目" min-width="200" />
        <el-table-column prop="selling" label="销售费用" width="150">
          <template #default="{ row }">
            <el-input-number
              v-model="periodCost.selling[row.key]"
              :min="0"
              :step="0.01"
              controls-position="right"
              class="full-width"
              @change="calculateTotals"
            />
          </template>
        </el-table-column>
        <el-table-column prop="management" label="管理费用" width="150">
          <template #default="{ row }">
            <el-input-number
              v-model="periodCost.management[row.key]"
              :min="0"
              :step="0.01"
              controls-position="right"
              class="full-width"
              @change="calculateTotals"
            />
          </template>
        </el-table-column>
        <el-table-column prop="financial" label="财务费用" width="150">
          <template #default="{ row }">
            <el-input-number
              v-model="periodCost.financial[row.key]"
              :min="0"
              :step="0.01"
              controls-position="right"
              class="full-width"
              @change="calculateTotals"
            />
          </template>
        </el-table-column>
      </el-table>
      
      <div class="total-row">
        <span>合计：销售费用 {{ formatNumber(totals.sellingTotal) }} | 管理费用 {{ formatNumber(totals.managementTotal) }} | 财务费用 {{ formatNumber(totals.financialTotal) }}</span>
      </div>
    </el-form>
    
    <div class="form-actions">
      <el-button type="primary" @click="handleCalculate">计算</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
      <el-button @click="handleReset">重置</el-button>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted } from 'vue'
import { useTaxStore } from '@/store/tax'
import { ElMessage } from 'element-plus'

const taxStore = useTaxStore()
const periodCost = reactive(taxStore.periodCost)

const expenseData = [
  { rowNo: '1', item: '一、职工薪酬', key: 'employeeCompensation' },
  { rowNo: '2', item: '二、劳务费', key: 'laborFee' },
  { rowNo: '3', item: '三、咨询顾问费', key: 'consultingFee' },
  { rowNo: '4', item: '四、业务招待费', key: 'entertainmentFee' },
  { rowNo: '5', item: '五、广告费和业务宣传费', key: 'advertisingFee' },
  { rowNo: '6', item: '六、佣金和手续费', key: 'commissionFee' },
  { rowNo: '7', item: '七、资产折旧摊销费', key: 'depreciationFee' },
  { rowNo: '8', item: '八、财产损耗、盘亏及毁损损失', key: 'lossDamageFee' },
  { rowNo: '9', item: '九、办公费', key: 'officeFee' },
  { rowNo: '10', item: '十、董事会费', key: 'boardFee' },
  { rowNo: '11', item: '十一、租赁费', key: 'rentFee' },
  { rowNo: '12', item: '十二、诉讼费', key: 'litigationFee' },
  { rowNo: '13', item: '十三、差旅费', key: 'travelFee' },
  { rowNo: '14', item: '十四、保险费', key: 'insuranceFee' },
  { rowNo: '15', item: '十五、运输、仓储费', key: 'transportationFee' },
  { rowNo: '16', item: '十六、修理费', key: 'repairFee' },
  { rowNo: '17', item: '十七、包装费', key: 'packagingFee' },
  { rowNo: '18', item: '十八、技术转让费', key: 'technologyFee' },
  { rowNo: '19', item: '十九、研究费用', key: 'researchFee' },
  { rowNo: '20', item: '二十、各项税费', key: 'taxesFee' },
  { rowNo: '21', item: '二十一、利息收支', key: 'interestFee' },
  { rowNo: '22', item: '二十二、汇兑差额', key: 'exchangeDiffFee' },
  { rowNo: '23', item: '二十三、现金折扣', key: 'cashDiscountFee' },
  { rowNo: '24', item: '二十四、其他', key: 'otherFee' }
]

const totals = computed(() => {
  const calcTotal = (section) => Object.values(section).reduce((sum, val) => sum + (Number(val) || 0), 0)
  return {
    sellingTotal: calcTotal(periodCost.selling),
    managementTotal: calcTotal(periodCost.management),
    financialTotal: calcTotal(periodCost.financial)
  }
})

const formatNumber = (value) => {
  if (value === null || value === undefined) return '0.00'
  const num = Number(value)
  return isNaN(num) ? '0.00' : num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const calculateTotals = () => {
  const t = taxStore.calculatePeriodCostTotals()
  Object.assign(totals, t)
}

const handleCalculate = () => {
  calculateTotals()
  ElMessage.success('计算完成')
}

const handleSave = () => {
  taxStore.saveToLocalStorage()
  ElMessage.success('数据保存成功')
}

const handleReset = () => {
  const resetSection = (section) => {
    Object.keys(section).forEach(key => section[key] = 0)
  }
  resetSection(periodCost.selling)
  resetSection(periodCost.management)
  resetSection(periodCost.financial)
  ElMessage.info('已重置')
}

onMounted(() => {
  calculateTotals()
})
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
}

.full-width {
  width: 100%;
}

.total-row {
  padding: 16px;
  margin-top: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  color: white;
  font-weight: bold;
  text-align: center;
}

.form-actions {
  text-align: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}
</style>