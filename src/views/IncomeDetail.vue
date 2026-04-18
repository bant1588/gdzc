<template>
  <div class="form-container">
    <h2 class="form-title">A101010 一般企业收入明细表</h2>
    
    <el-form :model="incomeDetail" label-width="auto" class="form-section">
      <h3 class="section-title">一、营业收入</h3>
      
      <el-table :data="mainBusinessData" border size="small">
        <el-table-column prop="rowNo" label="行次" width="60" />
        <el-table-column prop="item" label="项目" min-width="300" />
        <el-table-column prop="amount" label="金额" width="180">
          <template #default="{ row }">
            <el-input-number
              v-model="incomeDetail[row.key]"
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
        <span>（一）主营业务收入合计 = {{ formatNumber(incomeDetail.mainBusinessIncomeTotal) }}</span>
      </div>
      
      <el-table :data="otherBusinessData" border size="small" class="mt-3">
        <el-table-column prop="rowNo" label="行次" width="60" />
        <el-table-column prop="item" label="项目" min-width="300" />
        <el-table-column prop="amount" label="金额" width="180">
          <template #default="{ row }">
            <el-input-number
              v-model="incomeDetail[row.key]"
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
        <span>（二）其他业务收入合计 = {{ formatNumber(incomeDetail.otherBusinessIncomeTotal) }}</span>
      </div>
      
      <div class="total-row">
        <span>一、营业收入合计 = {{ formatNumber(incomeDetail.totalOperatingIncome) }}</span>
      </div>
    </el-form>
    
    <el-form :model="incomeDetail" label-width="auto" class="form-section">
      <h3 class="section-title">二、营业外收入</h3>
      
      <el-table :data="nonOperatingData" border size="small">
        <el-table-column prop="rowNo" label="行次" width="60" />
        <el-table-column prop="item" label="项目" min-width="300" />
        <el-table-column prop="amount" label="金额" width="180">
          <template #default="{ row }">
            <el-input-number
              v-model="incomeDetail[row.key]"
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
        <span>二、营业外收入合计 = {{ formatNumber(incomeDetail.totalNonOperatingIncome) }}</span>
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
const incomeDetail = reactive(taxStore.incomeDetail)

const mainBusinessData = [
  { rowNo: '3', item: '1.销售商品收入', key: 'salesIncome' },
  { rowNo: '4', item: '2.提供劳务收入', key: 'serviceIncome' },
  { rowNo: '5', item: '3.建造合同收入', key: 'constructionIncome' },
  { rowNo: '6', item: '4.让渡资产使用权收入', key: 'assetUsageIncome' },
  { rowNo: '7', item: '5.其他', key: 'mainBusinessOtherIncome' }
]

const otherBusinessData = [
  { rowNo: '9', item: '1.销售材料收入', key: 'materialSalesIncome' },
  { rowNo: '10', item: '2.出租固定资产收入', key: 'fixedAssetRentIncome' },
  { rowNo: '11', item: '3.出租无形资产收入', key: 'intangibleAssetRentIncome' },
  { rowNo: '12', item: '4.出租包装物和商品收入', key: 'packagingRentIncome' },
  { rowNo: '13', item: '5.其他', key: 'otherBusinessOtherIncome' }
]

const nonOperatingData = [
  { rowNo: '15', item: '（一）非流动资产处置利得', key: 'nonCurrentAssetDisposalGain' },
  { rowNo: '16', item: '（二）非货币性资产交换利得', key: 'nonMonetaryExchangeGain' },
  { rowNo: '17', item: '（三）债务重组利得', key: 'debtRestructuringGain' },
  { rowNo: '18', item: '（四）政府补助利得', key: 'governmentSubsidyGain' },
  { rowNo: '19', item: '（五）盘盈利得', key: 'inventoryProfit' },
  { rowNo: '20', item: '（六）捐赠利得', key: 'donationGain' },
  { rowNo: '21', item: '（七）其他', key: 'nonOperatingOtherIncome' }
]

const formatNumber = (value) => {
  if (value === null || value === undefined) return '0.00'
  const num = Number(value)
  return isNaN(num) ? '0.00' : num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const calculateTotals = () => {
  incomeDetail.mainBusinessIncomeTotal =
    incomeDetail.salesIncome + incomeDetail.serviceIncome +
    incomeDetail.constructionIncome + incomeDetail.assetUsageIncome +
    incomeDetail.mainBusinessOtherIncome

  incomeDetail.otherBusinessIncomeTotal =
    incomeDetail.materialSalesIncome + incomeDetail.fixedAssetRentIncome +
    incomeDetail.intangibleAssetRentIncome + incomeDetail.packagingRentIncome +
    incomeDetail.otherBusinessOtherIncome

  incomeDetail.totalOperatingIncome =
    incomeDetail.mainBusinessIncomeTotal + incomeDetail.otherBusinessIncomeTotal

  incomeDetail.totalNonOperatingIncome =
    incomeDetail.nonCurrentAssetDisposalGain + incomeDetail.nonMonetaryExchangeGain +
    incomeDetail.debtRestructuringGain + incomeDetail.governmentSubsidyGain +
    incomeDetail.inventoryProfit + incomeDetail.donationGain +
    incomeDetail.nonOperatingOtherIncome
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
  Object.assign(incomeDetail, {
    salesIncome: 0, serviceIncome: 0, constructionIncome: 0, assetUsageIncome: 0,
    mainBusinessOtherIncome: 0, materialSalesIncome: 0, fixedAssetRentIncome: 0,
    intangibleAssetRentIncome: 0, packagingRentIncome: 0, otherBusinessOtherIncome: 0,
    mainBusinessIncomeTotal: 0, otherBusinessIncomeTotal: 0, totalOperatingIncome: 0,
    nonCurrentAssetDisposalGain: 0, nonMonetaryExchangeGain: 0, debtRestructuringGain: 0,
    governmentSubsidyGain: 0, inventoryProfit: 0, donationGain: 0, nonOperatingOtherIncome: 0,
    totalNonOperatingIncome: 0
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