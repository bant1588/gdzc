<template>
  <div class="form-container">
    <h2 class="form-title">A107010/A107050 税收优惠明细表</h2>
    
    <el-form :model="taxIncentive" label-width="auto" class="form-section">
      <h3 class="section-title">一、免税、减计收入及加计扣除</h3>
      
      <el-table :data="taxExemptionData" border size="small">
        <el-table-column prop="rowNo" label="行次" width="60" />
        <el-table-column prop="item" label="优惠项目" min-width="250" />
        <el-table-column prop="amount" label="金额" width="180">
          <template #default="{ row }">
            <el-input-number
              v-model="row.amount"
              :min="0"
              :step="0.01"
              controls-position="right"
              class="full-width"
            />
          </template>
        </el-table-column>
      </el-table>
      
      <div class="subtotal-row">
        <span>免税、减计收入及加计扣除合计 = {{ formatNumber(taxExemptionTotal) }}</span>
      </div>
    </el-form>
    
    <el-form :model="taxIncentive" label-width="auto" class="form-section">
      <h3 class="section-title">二、减免所得税额</h3>
      
      <el-table :data="taxReductionData" border size="small">
        <el-table-column prop="rowNo" label="行次" width="60" />
        <el-table-column prop="item" label="优惠项目" min-width="250" />
        <el-table-column prop="amount" label="金额" width="180">
          <template #default="{ row }">
            <el-input-number
              v-model="row.amount"
              :min="0"
              :step="0.01"
              controls-position="right"
              class="full-width"
            />
          </template>
        </el-table-column>
      </el-table>
      
      <div class="subtotal-row">
        <span>减免所得税额合计 = {{ formatNumber(taxReductionTotal) }}</span>
      </div>
    </el-form>
    
    <el-form :model="taxIncentive" label-width="auto" class="form-section">
      <h3 class="section-title">三、税额抵免优惠</h3>
      
      <el-table :data="taxCreditData" border size="small">
        <el-table-column prop="rowNo" label="行次" width="60" />
        <el-table-column prop="item" label="优惠项目" min-width="250" />
        <el-table-column prop="amount" label="金额" width="180">
          <template #default="{ row }">
            <el-input-number
              v-model="row.amount"
              :min="0"
              :step="0.01"
              controls-position="right"
              class="full-width"
            />
          </template>
        </el-table-column>
      </el-table>
      
      <div class="subtotal-row">
        <span>税额抵免优惠合计 = {{ formatNumber(taxCreditTotal) }}</span>
      </div>
    </el-form>
    
    <div class="summary-card">
      <h3>税收优惠汇总</h3>
      <div class="summary-item">
        <span class="label">加计扣除等优惠金额：</span>
        <span class="value">{{ formatNumber(taxExemptionTotal) }}</span>
      </div>
      <div class="summary-item">
        <span class="label">减免所得税额：</span>
        <span class="value">{{ formatNumber(taxReductionTotal) }}</span>
      </div>
      <div class="summary-item">
        <span class="label">抵免所得税额：</span>
        <span class="value">{{ formatNumber(taxCreditTotal) }}</span>
      </div>
    </div>
    
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
const taxIncentive = reactive(taxStore.taxIncentive)

taxIncentive.taxExemption = [
  { rowNo: '1', item: '国债利息收入', amount: 0 },
  { rowNo: '2', item: '符合条件的居民企业之间的股息、红利等权益性投资收益', amount: 0 },
  { rowNo: '3', item: '研发费用加计扣除', amount: 0 },
  { rowNo: '4', item: '安置残疾人员所支付的工资加计扣除', amount: 0 }
]

taxIncentive.taxReduction = [
  { rowNo: '1', item: '符合条件的小型微利企业减免所得税', amount: 0 },
  { rowNo: '2', item: '国家需要重点扶持的高新技术企业减免所得税', amount: 0 },
  { rowNo: '3', item: '技术先进型服务企业减免所得税', amount: 0 },
  { rowNo: '4', item: '其他减免所得税优惠', amount: 0 }
]

taxIncentive.taxCredit = [
  { rowNo: '1', item: '专用设备投资抵免所得税', amount: 0 },
  { rowNo: '2', item: '环境保护、节能节水、安全生产专用设备投资抵免', amount: 0 }
]

const taxExemptionTotal = computed(() => {
  return taxIncentive.taxExemption.reduce((sum, item) => sum + (item.amount || 0), 0)
})

const taxReductionTotal = computed(() => {
  return taxIncentive.taxReduction.reduce((sum, item) => sum + (item.amount || 0), 0)
})

const taxCreditTotal = computed(() => {
  return taxIncentive.taxCredit.reduce((sum, item) => sum + (item.amount || 0), 0)
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
  taxIncentive.taxExemption.forEach(item => item.amount = 0)
  taxIncentive.taxReduction.forEach(item => item.amount = 0)
  taxIncentive.taxCredit.forEach(item => item.amount = 0)
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
    border-bottom: 2px solid #67c23a;
  }
}

.full-width {
  width: 100%;
}

.subtotal-row {
  padding: 12px 16px;
  margin-top: 12px;
  background: #f0f9eb;
  border-radius: 4px;
  font-weight: 500;
  color: #67c23a;
}

.summary-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 24px;
  color: white;
  margin-bottom: 24px;
  
  h3 {
    margin: 0 0 16px 0;
    font-size: 18px;
  }
  
  .summary-item {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    
    &:last-child {
      border-bottom: none;
    }
    
    .value {
      font-weight: bold;
    }
  }
}

.form-actions {
  text-align: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}
</style>