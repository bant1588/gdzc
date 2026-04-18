<template>
  <div class="form-container">
    <h2 class="form-title">A000000 企业所得税年度纳税申报基础信息表</h2>
    
    <el-form :model="basicInfo" label-width="200px" class="form-section">
      <h3 class="section-title">基本经营情况（必填项目）</h3>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="101 纳税申报企业类型">
            <el-select v-model="basicInfo.enterpriseType" class="full-width">
              <el-option value="100" label="100 非跨地区经营企业" />
              <el-option value="210" label="210 跨地区经营企业总机构" />
              <el-option value="220" label="220 总机构（跨省）——不适用" />
              <el-option value="230" label="230 总机构（省内）" />
              <el-option value="311" label="311 跨地区经营企业分支机构" />
              <el-option value="312" label="312 分支机构（不就地缴纳）" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="102 分支机构就地纳税比例(%)">
            <el-input-number v-model="basicInfo.branchTaxRatio" :min="0" :max="100" :step="0.01" class="full-width" />
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="103 资产总额（万元）">
            <el-input-number v-model="basicInfo.totalAssets" :min="0" :step="0.01" class="full-width" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="104 从业人数（人）">
            <el-input-number v-model="basicInfo.employeeCount" :min="0" :step="0.01" class="full-width" />
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="105 所属国民经济行业">
            <el-input v-model="basicInfo.industryCode" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="106 从事国家限制或禁止行业">
            <el-select v-model="basicInfo.restrictedIndustry" class="full-width">
              <el-option value="否" label="否" />
              <el-option value="是" label="是" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="107 适用会计准则或会计制度">
            <el-select v-model="basicInfo.accountingStandard" class="full-width">
              <el-option value="企业会计准则" label="企业会计准则" />
              <el-option value="小企业会计准则" label="小企业会计准则" />
              <el-option value="企业会计制度" label="企业会计制度" />
              <el-option value="其他" label="其他" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="108 采用一般企业财务报表格式">
            <el-select v-model="basicInfo.financialReportFormat" class="full-width">
              <el-option value="是" label="是" />
              <el-option value="否" label="否" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="109 小型微利企业">
            <el-select v-model="basicInfo.smallMicroEnterprise" class="full-width">
              <el-option value="否" label="否" />
              <el-option value="是" label="是" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="110 上市公司">
            <el-select v-model="basicInfo.listedCompany" class="full-width">
              <el-option value="否" label="否" />
              <el-option value="是（境内）" label="是（境内）" />
              <el-option value="是（境外）" label="是（境外）" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    
    <el-form :model="basicInfo" label-width="200px" class="form-section">
      <h3 class="section-title">有关涉税事项情况</h3>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="201 从事股权投资业务">
            <el-select v-model="basicInfo.equityInvestment" class="full-width">
              <el-option value="否" label="否" />
              <el-option value="是" label="是" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="202 存在境外关联交易">
            <el-select v-model="basicInfo.overseasRelatedTransaction" class="full-width">
              <el-option value="否" label="否" />
              <el-option value="是" label="是" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="203 境外所得信息">
            <el-select v-model="basicInfo.overseasIncome" class="full-width">
              <el-option value="否" label="否" />
              <el-option value="是" label="是" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="204 合并、分立、重组事项">
            <el-select v-model="basicInfo.restructuring" class="full-width">
              <el-option value="否" label="否" />
              <el-option value="是" label="是" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    
    <div class="form-section">
      <h3 class="section-title">企业主要股东及分红情况</h3>
      
      <el-table :data="basicInfo.shareholders" border class="shareholder-table">
        <el-table-column prop="name" label="股东名称">
          <template #default="{ row, $index }">
            <el-input v-model="row.name" />
          </template>
        </el-table-column>
        <el-table-column prop="idType" label="证件类型" width="120">
          <template #default="{ row }">
            <el-select v-model="row.idType">
              <el-option value="身份证" label="身份证" />
              <el-option value="护照" label="护照" />
              <el-option value="营业执照" label="营业执照" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="idNumber" label="证件号码" width="180">
          <template #default="{ row }">
            <el-input v-model="row.idNumber" />
          </template>
        </el-table-column>
        <el-table-column prop="investmentRatio" label="投资比例(%)" width="120">
          <template #default="{ row }">
            <el-input-number v-model="row.investmentRatio" :min="0" :max="100" :step="0.01" />
          </template>
        </el-table-column>
        <el-table-column prop="dividendAmount" label="分红金额" width="150">
          <template #default="{ row }">
            <el-input-number v-model="row.dividendAmount" :min="0" :step="0.01" />
          </template>
        </el-table-column>
        <el-table-column prop="nationality" label="国籍/注册地">
          <template #default="{ row }">
            <el-input v-model="row.nationality" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80" fixed="right">
          <template #default="{ $index }">
            <el-button type="danger" @click="removeShareholder($index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <el-button type="primary" class="mt-3" @click="addShareholder">添加股东</el-button>
    </div>
    
    <div class="form-actions">
      <el-button type="primary" @click="handleSave">保存</el-button>
      <el-button @click="handleReset">重置</el-button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useTaxStore } from '@/store/tax'
import { ElMessage } from 'element-plus'

const taxStore = useTaxStore()
const basicInfo = reactive(taxStore.basicInfo)

const addShareholder = () => {
  basicInfo.shareholders.push({
    name: '',
    idType: '身份证',
    idNumber: '',
    investmentRatio: 0,
    dividendAmount: 0,
    nationality: ''
  })
}

const removeShareholder = (index) => {
  basicInfo.shareholders.splice(index, 1)
}

const handleSave = () => {
  taxStore.saveToLocalStorage()
  ElMessage.success('基础信息保存成功')
}

const handleReset = () => {
  Object.assign(basicInfo, {
    enterpriseType: '100',
    branchTaxRatio: 0,
    totalAssets: 0,
    employeeCount: 0,
    industryCode: '',
    restrictedIndustry: '否',
    accountingStandard: '企业会计准则',
    financialReportFormat: '是',
    smallMicroEnterprise: '否',
    listedCompany: '否',
    equityInvestment: '否',
    overseasRelatedTransaction: '否',
    overseasIncome: '否',
    restructuring: '否',
    shareholders: []
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
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #ebeef5;
  }
}

.full-width {
  width: 100%;
}

.shareholder-table {
  margin-top: 16px;
}

.form-actions {
  text-align: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

.mt-3 {
  margin-top: 12px;
}
</style>