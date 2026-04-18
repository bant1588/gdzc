<template>
  <div class="form-container">
    <h2 class="form-title">企业所得税年度纳税申报预览</h2>
    
    <el-tabs v-model="activeTab" type="border-card" class="preview-tabs">
      <el-tab-pane label="主表" name="main">
        <div class="preview-section">
          <h3>A100000 企业所得税年度纳税申报主表</h3>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="利润总额">
              {{ formatNumber(taxStore.mainForm.totalProfit) }}
            </el-descriptions-item>
            <el-descriptions-item label="应纳税所得额">
              {{ formatNumber(taxStore.mainForm.taxableIncome) }}
            </el-descriptions-item>
            <el-descriptions-item label="税率">25%</el-descriptions-item>
            <el-descriptions-item label="应纳所得税额">
              {{ formatNumber(taxStore.mainForm.taxAmount) }}
            </el-descriptions-item>
            <el-descriptions-item label="减免所得税额">
              {{ formatNumber(taxStore.mainForm.taxReduction) }}
            </el-descriptions-item>
            <el-descriptions-item label="抵免所得税额">
              {{ formatNumber(taxStore.mainForm.taxCredit) }}
            </el-descriptions-item>
            <el-descriptions-item label="实际应纳所得税额">
              {{ formatNumber(taxStore.mainForm.totalTaxAmount) }}
            </el-descriptions-item>
            <el-descriptions-item label="本年累计预缴所得税额">
              {{ formatNumber(taxStore.mainForm.prepaidTaxAmount) }}
            </el-descriptions-item>
            <el-descriptions-item label="本年应补（退）所得税额" :span="2">
              <span :class="taxStore.mainForm.finalTaxPayable >= 0 ? 'text-danger' : 'text-success'">
                {{ formatNumber(taxStore.mainForm.finalTaxPayable) }}
              </span>
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="收入情况" name="income">
        <div class="preview-section">
          <h3>收入明细汇总</h3>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="营业收入合计">
              {{ formatNumber(taxStore.incomeDetail.totalOperatingIncome) }}
            </el-descriptions-item>
            <el-descriptions-item label="主营业务收入">
              {{ formatNumber(taxStore.incomeDetail.mainBusinessIncomeTotal) }}
            </el-descriptions-item>
            <el-descriptions-item label="其他业务收入">
              {{ formatNumber(taxStore.incomeDetail.otherBusinessIncomeTotal) }}
            </el-descriptions-item>
            <el-descriptions-item label="营业外收入">
              {{ formatNumber(taxStore.incomeDetail.totalNonOperatingIncome) }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="成本费用" name="cost">
        <div class="preview-section">
          <h3>成本费用明细汇总</h3>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="营业成本合计">
              {{ formatNumber(taxStore.costDetail.totalOperatingCost) }}
            </el-descriptions-item>
            <el-descriptions-item label="主营业务成本">
              {{ formatNumber(taxStore.costDetail.mainBusinessCostTotal) }}
            </el-descriptions-item>
            <el-descriptions-item label="其他业务成本">
              {{ formatNumber(taxStore.costDetail.otherBusinessCostTotal) }}
            </el-descriptions-item>
            <el-descriptions-item label="营业外支出">
              {{ formatNumber(taxStore.costDetail.totalNonOperatingExpense) }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="税收优惠" name="incentive">
        <div class="preview-section">
          <h3>税收优惠情况</h3>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="免税、减计收入及加计扣除">
              {{ formatNumber(taxExemptionTotal) }}
            </el-descriptions-item>
            <el-descriptions-item label="减免所得税额">
              {{ formatNumber(taxReductionTotal) }}
            </el-descriptions-item>
            <el-descriptions-item label="税额抵免优惠">
              {{ formatNumber(taxCreditTotal) }}
            </el-descriptions-item>
            <el-descriptions-item label="优惠合计">
              {{ formatNumber(taxExemptionTotal + taxReductionTotal + taxCreditTotal) }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </el-tab-pane>
    </el-tabs>
    
    <div class="declaration-status">
      <el-alert
        v-if="validationStatus.isValid"
        title="数据验证通过"
        type="success"
        :description="validationStatus.message"
        show-icon
        :closable="false"
      />
      <el-alert
        v-else
        title="数据验证未通过"
        type="error"
        :description="validationStatus.message"
        show-icon
        :closable="false"
      />
    </div>
    
    <div class="form-actions">
      <el-button type="primary" size="large" @click="handleSubmit">提交申报</el-button>
      <el-button size="large" @click="handlePrint">打印申报表</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTaxStore } from '@/store/tax'
import { ElMessage, ElMessageBox } from 'element-plus'

const taxStore = useTaxStore()
const activeTab = ref('main')

const taxExemptionTotal = computed(() => {
  return taxStore.taxIncentive.taxExemption.reduce((sum, item) => sum + (item.amount || 0), 0)
})

const taxReductionTotal = computed(() => {
  return taxStore.taxIncentive.taxReduction.reduce((sum, item) => sum + (item.amount || 0), 0)
})

const taxCreditTotal = computed(() => {
  return taxStore.taxIncentive.taxCredit.reduce((sum, item) => sum + (item.amount || 0), 0)
})

const validationStatus = computed(() => {
  const mainForm = taxStore.mainForm
  const issues = []
  
  if (mainForm.totalProfit === 0) {
    issues.push('利润总额为0，请检查是否填写了相关收入数据')
  }
  
  if (mainForm.taxableIncome < 0) {
    issues.push('应纳税所得额为负数，请检查数据')
  }
  
  if (issues.length === 0) {
    return {
      isValid: true,
      message: '所有必填数据已完整，可以提交申报'
    }
  }
  
  return {
    isValid: false,
    message: issues.join('；')
  }
})

const formatNumber = (value) => {
  if (value === null || value === undefined) return '0.00'
  const num = Number(value)
  return isNaN(num) ? '0.00' : num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const handleSubmit = async () => {
  if (!validationStatus.value.isValid) {
    ElMessage.error('请先完善申报数据')
    return
  }
  
  try {
    await ElMessageBox.confirm(
      `确认提交申报吗？提交后将无法修改数据。\n本年应补（退）所得税额：${formatNumber(taxStore.mainForm.finalTaxPayable)}`,
      '提交确认',
      {
        confirmButtonText: '确认提交',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    ElMessage.success('申报提交成功！（模拟）')
  } catch {
    ElMessage.info('已取消提交')
  }
}

const handlePrint = () => {
  window.print()
  ElMessage.info('正在准备打印...')
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

.preview-tabs {
  margin-bottom: 24px;
  
  :deep(.el-tabs__content) {
    padding: 20px;
  }
}

.preview-section {
  h3 {
    font-size: 16px;
    font-weight: bold;
    color: #409eff;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 2px solid #409eff;
  }
}

.declaration-status {
  margin: 24px 0;
  
  .text-danger {
    color: #f56c6c;
    font-weight: bold;
    font-size: 18px;
  }
  
  .text-success {
    color: #67c23a;
    font-weight: bold;
    font-size: 18px;
  }
}

.form-actions {
  text-align: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

@media print {
  .app-sidebar,
  .header-actions,
  .form-actions,
  .declaration-status {
    display: none !important;
  }
  
  .form-container {
    box-shadow: none;
    padding: 0;
  }
}
</style>