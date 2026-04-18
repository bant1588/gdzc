<template>
  <div class="form-container">
    <h2 class="form-title">A100000 企业所得税年度纳税申报主表</h2>
    
    <el-form :model="mainForm" label-width="auto" class="form-section">
      <h3 class="section-title">利润总额计算</h3>
      
      <el-table :data="profitTableData" border size="small" class="main-table">
        <el-table-column prop="rowNo" label="行次" width="60" />
        <el-table-column prop="item" label="项目" min-width="300" />
        <el-table-column prop="amount" label="金额" width="180">
          <template #default="{ row }">
            <el-input-number
              v-if="row.editable"
              v-model="mainForm[row.key]"
              :min="0"
              :step="0.01"
              controls-position="right"
              class="full-width"
              @change="calculateAll"
            />
            <span v-else class="calculated-value">{{ formatNumber(mainForm[row.key]) }}</span>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="calculated-row">
        <span class="label">营业利润（第15行）=</span>
        <span class="value">{{ formatNumber(mainForm.operatingProfit) }}</span>
      </div>
      <div class="calculated-row">
        <span class="label">利润总额（第18行）=</span>
        <span class="value highlight">{{ formatNumber(mainForm.totalProfit) }}</span>
      </div>
    </el-form>
    
    <el-form :model="mainForm" label-width="auto" class="form-section">
      <h3 class="section-title">应纳税所得额计算</h3>
      
      <el-table :data="taxableIncomeTableData" border size="small" class="main-table">
        <el-table-column prop="rowNo" label="行次" width="60" />
        <el-table-column prop="item" label="项目" min-width="300" />
        <el-table-column prop="amount" label="金额" width="180">
          <template #default="{ row }">
            <el-input-number
              v-if="row.editable"
              v-model="mainForm[row.key]"
              :min="0"
              :step="0.01"
              controls-position="right"
              class="full-width"
              @change="calculateAll"
            />
            <span v-else class="calculated-value">{{ formatNumber(mainForm[row.key]) }}</span>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="calculated-row highlight">
        <span class="label">应纳税所得额（第23行）=</span>
        <span class="value">{{ formatNumber(mainForm.taxableIncome) }}</span>
      </div>
    </el-form>
    
    <el-form :model="mainForm" label-width="auto" class="form-section">
      <h3 class="section-title">应纳税额计算</h3>
      
      <div class="tax-rate-row">
        <span class="label">税率：</span>
        <span class="value">25%</span>
      </div>
      
      <el-table :data="taxAmountTableData" border size="small" class="main-table">
        <el-table-column prop="rowNo" label="行次" width="60" />
        <el-table-column prop="item" label="项目" min-width="300" />
        <el-table-column prop="amount" label="金额" width="180">
          <template #default="{ row }">
            <el-input-number
              v-if="row.editable"
              v-model="mainForm[row.key]"
              :min="0"
              :step="0.01"
              controls-position="right"
              class="full-width"
              @change="calculateAll"
            />
            <span v-else class="calculated-value">{{ formatNumber(mainForm[row.key]) }}</span>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="calculated-row">
        <span class="label">应纳所得税额（第24行）=</span>
        <span class="value">{{ formatNumber(mainForm.taxAmount) }}</span>
      </div>
      <div class="calculated-row">
        <span class="label">应纳税额（第28行）=</span>
        <span class="value">{{ formatNumber(mainForm.actualTaxAmount) }}</span>
      </div>
      <div class="calculated-row highlight">
        <span class="label">实际应纳所得税额（第31行）=</span>
        <span class="value">{{ formatNumber(mainForm.totalTaxAmount) }}</span>
      </div>
      <div class="calculated-row">
        <span class="label">本年累计预缴所得税额（第32行）=</span>
        <el-input-number
          v-model="mainForm.prepaidTaxAmount"
          :min="0"
          :step="0.01"
          controls-position="right"
          class="input-narrow"
          @change="calculateAll"
        />
      </div>
      <div class="calculated-row final">
        <span class="label">本年应补（退）所得税额（第33行）=</span>
        <span class="value" :class="mainForm.finalTaxPayable >= 0 ? 'text-primary' : 'text-danger'">
          {{ formatNumber(mainForm.finalTaxPayable) }}
        </span>
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
const mainForm = reactive(taxStore.mainForm)

const profitTableData = [
  { rowNo: '1', item: '一、营业收入（填写A101010/101020/103000）', key: 'operatingIncome', editable: true },
  { rowNo: '2', item: '减：营业成本（填写A102010/102020/103000）', key: 'operatingCost', editable: true },
  { rowNo: '3', item: '减：税金及附加', key: 'taxesAndSurcharges', editable: true },
  { rowNo: '4', item: '减：销售费用（填写A104000）', key: 'sellingExpenses', editable: true },
  { rowNo: '5', item: '减：管理费用（填写A104000）', key: 'managementExpenses', editable: true },
  { rowNo: '6', item: '减：研发费用（填写A104000）', key: 'rdExpenses', editable: true },
  { rowNo: '7', item: '减：财务费用（填写A104000）', key: 'financialExpenses', editable: true },
  { rowNo: '8', item: '加：其他收益', key: 'otherIncome', editable: true },
  { rowNo: '9', item: '加：投资收益（损失以"-"号填列）', key: 'investmentIncome', editable: true },
  { rowNo: '10', item: '加：净敞口套期收益（损失以"-"号填列）', key: 'netHedgeIncome', editable: true },
  { rowNo: '11', item: '加：公允价值变动收益（损失以"-"号填列）', key: 'fairValueChangeIncome', editable: true },
  { rowNo: '12', item: '加：信用减值损失（损失以"-"号填列）', key: 'creditImpairmentLoss', editable: true },
  { rowNo: '13', item: '加：资产减值损失（损失以"-"号填列）', key: 'assetImpairmentLoss', editable: true },
  { rowNo: '14', item: '加：资产处置收益（损失以"-"号填列）', key: 'assetDisposalIncome', editable: true },
  { rowNo: '16', item: '加：营业外收入', key: 'nonOperatingIncome', editable: true },
  { rowNo: '17', item: '减：营业外支出', key: 'nonOperatingExpenses', editable: true }
]

const taxableIncomeTableData = [
  { rowNo: '19', item: '四、纳税调整后所得', key: 'incomeTaxAdjustment', editable: true },
  { rowNo: '20', item: '减：所得减免', key: 'incomeReduction', editable: true },
  { rowNo: '21', item: '减：弥补以前年度亏损', key: 'lossCarryforward', editable: true },
  { rowNo: '22', item: '减：抵扣应纳税所得额', key: 'deductionFromIncome', editable: true }
]

const taxAmountTableData = [
  { rowNo: '26', item: '减：减免所得税额', key: 'taxReduction', editable: true },
  { rowNo: '27', item: '减：抵免所得税额', key: 'taxCredit', editable: true },
  { rowNo: '29', item: '加：境外所得应纳所得税额', key: 'overseasTaxAmount', editable: true },
  { rowNo: '30', item: '减：境外所得抵免所得税额', key: 'overseasTaxCredit', editable: true }
]

const formatNumber = (value) => {
  if (value === null || value === undefined) return '0.00'
  const num = Number(value)
  return isNaN(num) ? '0.00' : num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const calculateAll = () => {
  mainForm.operatingProfit = 
    mainForm.operatingIncome
    - mainForm.operatingCost
    - mainForm.taxesAndSurcharges
    - mainForm.sellingExpenses
    - mainForm.managementExpenses
    - mainForm.rdExpenses
    - mainForm.financialExpenses
    + mainForm.otherIncome
    + mainForm.investmentIncome
    + mainForm.netHedgeIncome
    + mainForm.fairValueChangeIncome
    + mainForm.creditImpairmentLoss
    + mainForm.assetImpairmentLoss
    + mainForm.assetDisposalIncome

  mainForm.totalProfit = mainForm.operatingProfit + mainForm.nonOperatingIncome - mainForm.nonOperatingExpenses

  mainForm.taxableIncome = Math.max(0,
    mainForm.totalProfit
    + mainForm.incomeTaxAdjustment
    - mainForm.incomeReduction
    - mainForm.lossCarryforward
    - mainForm.deductionFromIncome
  )

  mainForm.taxAmount = mainForm.taxableIncome * 0.25
  mainForm.actualTaxAmount = mainForm.taxAmount - mainForm.taxReduction - mainForm.taxCredit
  mainForm.totalTaxAmount = mainForm.actualTaxAmount + mainForm.overseasTaxAmount - mainForm.overseasTaxCredit
  mainForm.finalTaxPayable = mainForm.totalTaxAmount - mainForm.prepaidTaxAmount
}

const handleCalculate = () => {
  calculateAll()
  ElMessage.success('计算完成')
}

const handleSave = () => {
  calculateAll()
  taxStore.saveToLocalStorage()
  ElMessage.success('数据保存成功')
}

const handleReset = () => {
  Object.assign(mainForm, {
    operatingIncome: 0, operatingCost: 0, taxesAndSurcharges: 0, sellingExpenses: 0,
    managementExpenses: 0, rdExpenses: 0, financialExpenses: 0, otherIncome: 0,
    investmentIncome: 0, netHedgeIncome: 0, fairValueChangeIncome: 0,
    creditImpairmentLoss: 0, assetImpairmentLoss: 0, assetDisposalIncome: 0,
    operatingProfit: 0, nonOperatingIncome: 0, nonOperatingExpenses: 0, totalProfit: 0,
    incomeTaxAdjustment: 0, incomeReduction: 0, lossCarryforward: 0,
    deductionFromIncome: 0, taxableIncome: 0, taxAmount: 0, taxReduction: 0,
    taxCredit: 0, actualTaxAmount: 0, overseasTaxAmount: 0, overseasTaxCredit: 0,
    totalTaxAmount: 0, prepaidTaxAmount: 0, finalTaxPayable: 0
  })
  ElMessage.info('已重置')
}

onMounted(() => {
  calculateAll()
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
  
  .section-title {
    font-size: 16px;
    font-weight: bold;
    color: #606266;
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 2px solid #409eff;
  }
}

.main-table {
  margin-bottom: 16px;
}

.full-width {
  width: 100%;
}

.calculated-row {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 8px 16px;
  margin: 8px 0;
  background: #f5f7fa;
  border-radius: 4px;
  
  .label {
    margin-right: 12px;
    font-weight: 500;
    color: #606266;
  }
  
  .value {
    font-weight: bold;
    font-size: 16px;
    color: #303133;
    
    &.highlight {
      color: #409eff;
      font-size: 18px;
    }
  }
  
  &.highlight {
    background: #ecf5ff;
    border: 1px solid #b3d8ff;
  }
  
  &.final {
    background: #fef0f0;
    border: 1px solid #fbc4c4;
    
    .value {
      &.text-primary {
        color: #409eff;
      }
      &.text-danger {
        color: #f56c6c;
      }
    }
  }
}

.input-narrow {
  width: 200px;
}

.tax-rate-row {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 8px 16px;
  margin-bottom: 16px;
  background: #fdf6ec;
  border-radius: 4px;
  
  .label {
    margin-right: 12px;
    color: #606266;
  }
  
  .value {
    font-weight: bold;
    color: #e6a23c;
  }
}

.calculated-value {
  font-weight: 600;
  color: #409eff;
}

.form-actions {
  text-align: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}
</style>