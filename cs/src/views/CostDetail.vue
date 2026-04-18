<template>
  <div class="form-container">
    <h2 class="form-title">A102010 一般企业成本支出明细表</h2>
    
    <el-form :model="costDetail" label-width="auto" class="form-section">
      <h3 class="section-title">一、营业成本</h3>
      
      <el-table :data="mainBusinessCostData" border size="small">
        <el-table-column prop="rowNo" label="行次" width="60" />
        <el-table-column prop="item" label="项目" min-width="300" />
        <el-table-column prop="amount" label="金额" width="180">
          <template #default="{ row }">
            <el-input-number
              v-model="costDetail[row.key]"
              :min="0"
              :step="0.01"
              controls-position="right"
              class="full-width"
              @change="calculateTotals"
            />
          </template>
        </el-table-column>
      </el-table>
      
      <div class="subtotal-row">
        <span>（一）主营业务成本合计 = {{ formatNumber(costDetail.mainBusinessCostTotal) }}</span>
      </div>
      
      <el-table :data="otherBusinessCostData" border size="small" class="mt-3">
        <el-table-column prop="rowNo" label="行次" width="60" />
        <el-table-column prop="item" label="项目" min-width="300" />
        <el-table-column prop="amount" label="金额" width="180">
          <template #default="{ row }">
            <el-input-number
              v-model="costDetail[row.key]"
              :min="0"
              :step="0.01"
              controls-position="right"
              class="full-width"
              @change="calculateTotals"
            />
          </template>
        </el-table-column>
      </el-table>
      
      <div class="subtotal-row">
        <span>（二）其他业务成本合计 = {{ formatNumber(costDetail.otherBusinessCostTotal) }}</span>
      </div>
      
      <div class="total-row">
        <span>一、营业成本合计 = {{ formatNumber(costDetail.totalOperatingCost) }}</span>
      </div>
    </el-form>
    
    <el-form :model="costDetail" label-width="auto" class="form-section">
      <h3 class="section-title">二、营业外支出</h3>
      
      <el-table :data="nonOperatingExpenseData" border size="small">
        <el-table-column prop="rowNo" label="行次" width="60" />
        <el-table-column prop="item" label="项目" min-width="300" />
        <el-table-column prop="amount" label="金额" width="180">
          <template #default="{ row }">
            <el-input-number
              v-model="costDetail[row.key]"
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
        <span>二、营业外支出合计 = {{ formatNumber(costDetail.totalNonOperatingExpense) }}</span>
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
import { reactive, onMounted } from 'vue'
import { useTaxStore } from '@/store/tax'
import { ElMessage } from 'element-plus'

const taxStore = useTaxStore()
const costDetail = reactive(taxStore.costDetail)

const mainBusinessCostData = [
  { rowNo: '3', item: '1.销售商品成本', key: 'salesCost' },
  { rowNo: '4', item: '2.提供劳务成本', key: 'serviceCost' },
  { rowNo: '5', item: '3.建造合同成本', key: 'constructionCost' },
  { rowNo: '6', item: '4.让渡资产使用权成本', key: 'assetUsageCost' },
  { rowNo: '7', item: '5.其他', key: 'mainBusinessOtherCost' }
]

const otherBusinessCostData = [
  { rowNo: '9', item: '1.销售材料成本', key: 'materialSalesCost' },
  { rowNo: '10', item: '2.出租固定资产成本', key: 'fixedAssetRentCost' },
  { rowNo: '11', item: '3.出租无形资产成本', key: 'intangibleAssetRentCost' },
  { rowNo: '12', item: '4.包装物出租成本', key: 'packagingRentCost' },
  { rowNo: '13', item: '5.其他', key: 'otherBusinessOtherCost' }
]

const nonOperatingExpenseData = [
  { rowNo: '15', item: '（一）非流动资产处置损失', key: 'nonCurrentAssetDisposalLoss' },
  { rowNo: '16', item: '（二）非货币性资产交换损失', key: 'nonMonetaryExchangeLoss' },
  { rowNo: '17', item: '（三）债务重组损失', key: 'debtRestructuringLoss' },
  { rowNo: '18', item: '（四）非常损失', key: 'extraordinaryLoss' },
  { rowNo: '19', item: '（五）捐赠支出', key: 'donationExpense' },
  { rowNo: '20', item: '（六）赞助支出', key: 'sponsorshipExpense' },
  { rowNo: '21', item: '（七）罚没支出', key: 'penaltyExpense' },
  { rowNo: '22', item: '（八）坏账损失', key: 'badDebtExpense' },
  { rowNo: '23', item: '（九）无法收回的债券股权投资损失', key: 'unrecoverableBondLoss' },
  { rowNo: '24', item: '（十）其他', key: 'nonOperatingOtherExpense' }
]

const formatNumber = (value) => {
  if (value === null || value === undefined) return '0.00'
  const num = Number(value)
  return isNaN(num) ? '0.00' : num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const calculateTotals = () => {
  costDetail.mainBusinessCostTotal =
    costDetail.salesCost + costDetail.serviceCost +
    costDetail.constructionCost + costDetail.assetUsageCost +
    costDetail.mainBusinessOtherCost

  costDetail.otherBusinessCostTotal =
    costDetail.materialSalesCost + costDetail.fixedAssetRentCost +
    costDetail.intangibleAssetRentCost + costDetail.packagingRentCost +
    costDetail.otherBusinessOtherCost

  costDetail.totalOperatingCost =
    costDetail.mainBusinessCostTotal + costDetail.otherBusinessCostTotal

  costDetail.totalNonOperatingExpense =
    costDetail.nonCurrentAssetDisposalLoss + costDetail.nonMonetaryExchangeLoss +
    costDetail.debtRestructuringLoss + costDetail.extraordinaryLoss +
    costDetail.donationExpense + costDetail.sponsorshipExpense +
    costDetail.penaltyExpense + costDetail.badDebtExpense +
    costDetail.unrecoverableBondLoss + costDetail.nonOperatingOtherExpense
}

const handleCalculate = () => {
  calculateTotals()
  ElMessage.success('计算完成')
}

const handleSave = () => {
  calculateTotals()
  taxStore.saveToLocalStorage()
  ElMessage.success('数据保存成功')
}

const handleReset = () => {
  Object.assign(costDetail, {
    salesCost: 0, serviceCost: 0, constructionCost: 0, assetUsageCost: 0,
    mainBusinessOtherCost: 0, materialSalesCost: 0, fixedAssetRentCost: 0,
    intangibleAssetRentCost: 0, packagingRentCost: 0, otherBusinessOtherCost: 0,
    mainBusinessCostTotal: 0, otherBusinessCostTotal: 0, totalOperatingCost: 0,
    nonCurrentAssetDisposalLoss: 0, nonMonetaryExchangeLoss: 0, debtRestructuringLoss: 0,
    extraordinaryLoss: 0, donationExpense: 0, sponsorshipExpense: 0, penaltyExpense: 0,
    badDebtExpense: 0, unrecoverableBondLoss: 0, nonOperatingOtherExpense: 0,
    totalNonOperatingExpense: 0
  })
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

.total-row {
  padding: 12px 16px;
  margin-top: 12px;
  background: #ecf5ff;
  border-radius: 4px;
  font-weight: bold;
  color: #409eff;
}

.mt-3 {
  margin-top: 12px;
}

.form-actions {
  text-align: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}
</style>