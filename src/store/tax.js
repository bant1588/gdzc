import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTaxStore = defineStore('tax', () => {
  const basicInfo = ref({
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

  const mainForm = ref({
    operatingIncome: 0,
    operatingCost: 0,
    taxesAndSurcharges: 0,
    sellingExpenses: 0,
    managementExpenses: 0,
    rdExpenses: 0,
    financialExpenses: 0,
    otherIncome: 0,
    investmentIncome: 0,
    netHedgeIncome: 0,
    fairValueChangeIncome: 0,
    creditImpairmentLoss: 0,
    assetImpairmentLoss: 0,
    assetDisposalIncome: 0,
    operatingProfit: computed(() => {
      return mainForm.value.operatingIncome
        - mainForm.value.operatingCost
        - mainForm.value.taxesAndSurcharges
        - mainForm.value.sellingExpenses
        - mainForm.value.managementExpenses
        - mainForm.value.rdExpenses
        - mainForm.value.financialExpenses
        + mainForm.value.otherIncome
        + mainForm.value.investmentIncome
        + mainForm.value.netHedgeIncome
        + mainForm.value.fairValueChangeIncome
        + mainForm.value.creditImpairmentLoss
        + mainForm.value.assetImpairmentLoss
        + mainForm.value.assetDisposalIncome
    }),
    nonOperatingIncome: 0,
    nonOperatingExpenses: 0,
    totalProfit: computed(() => {
      return mainForm.value.operatingProfit
        + mainForm.value.nonOperatingIncome
        - mainForm.value.nonOperatingExpenses
    }),
    incomeTaxAdjustment: 0,
    incomeReduction: 0,
    lossCarryforward: 0,
    deductionFromIncome: 0,
    taxableIncome: computed(() => {
      return mainForm.value.totalProfit
        + mainForm.value.incomeTaxAdjustment
        - mainForm.value.incomeReduction
        - mainForm.value.lossCarryforward
        - mainForm.value.deductionFromIncome
    }),
    taxRate: 0.25,
    taxAmount: computed(() => {
      return mainForm.value.taxableIncome * mainForm.value.taxRate
    }),
    taxReduction: 0,
    taxCredit: 0,
    actualTaxAmount: computed(() => {
      return mainForm.value.taxAmount - mainForm.value.taxReduction - mainForm.value.taxCredit
    }),
    overseasTaxAmount: 0,
    overseasTaxCredit: 0,
    totalTaxAmount: computed(() => {
      return mainForm.value.actualTaxAmount + mainForm.value.overseasTaxAmount - mainForm.value.overseasTaxCredit
    }),
    prepaidTaxAmount: 0,
    finalTaxPayable: computed(() => {
      return mainForm.value.totalTaxAmount - mainForm.value.prepaidTaxAmount
    })
  })

  const incomeDetail = ref({
    salesIncome: 0,
    serviceIncome: 0,
    constructionIncome: 0,
    assetUsageIncome: 0,
    mainBusinessOtherIncome: 0,
    materialSalesIncome: 0,
    fixedAssetRentIncome: 0,
    intangibleAssetRentIncome: 0,
    packagingRentIncome: 0,
    otherBusinessOtherIncome: 0,
    nonCurrentAssetDisposalGain: 0,
    nonMonetaryExchangeGain: 0,
    debtRestructuringGain: 0,
    governmentSubsidyGain: 0,
    inventoryProfit: 0,
    donationGain: 0,
    nonOperatingOtherIncome: 0,
    mainBusinessIncomeTotal: computed(() => {
      return incomeDetail.value.salesIncome + incomeDetail.value.serviceIncome +
             incomeDetail.value.constructionIncome + incomeDetail.value.assetUsageIncome +
             incomeDetail.value.mainBusinessOtherIncome
    }),
    otherBusinessIncomeTotal: computed(() => {
      return incomeDetail.value.materialSalesIncome + incomeDetail.value.fixedAssetRentIncome +
             incomeDetail.value.intangibleAssetRentIncome + incomeDetail.value.packagingRentIncome +
             incomeDetail.value.otherBusinessOtherIncome
    }),
    totalOperatingIncome: computed(() => {
      return incomeDetail.value.mainBusinessIncomeTotal + incomeDetail.value.otherBusinessIncomeTotal
    }),
    totalNonOperatingIncome: computed(() => {
      return incomeDetail.value.nonCurrentAssetDisposalGain + incomeDetail.value.nonMonetaryExchangeGain +
             incomeDetail.value.debtRestructuringGain + incomeDetail.value.governmentSubsidyGain +
             incomeDetail.value.inventoryProfit + incomeDetail.value.donationGain +
             incomeDetail.value.nonOperatingOtherIncome
    })
  })

  const costDetail = ref({
    salesCost: 0,
    serviceCost: 0,
    constructionCost: 0,
    assetUsageCost: 0,
    mainBusinessOtherCost: 0,
    materialSalesCost: 0,
    fixedAssetRentCost: 0,
    intangibleAssetRentCost: 0,
    packagingRentCost: 0,
    otherBusinessOtherCost: 0,
    nonCurrentAssetDisposalLoss: 0,
    nonMonetaryExchangeLoss: 0,
    debtRestructuringLoss: 0,
    extraordinaryLoss: 0,
    donationExpense: 0,
    sponsorshipExpense: 0,
    penaltyExpense: 0,
    badDebtExpense: 0,
    unrecoverableBondLoss: 0,
    nonOperatingOtherExpense: 0,
    mainBusinessCostTotal: computed(() => {
      return costDetail.value.salesCost + costDetail.value.serviceCost +
             costDetail.value.constructionCost + costDetail.value.assetUsageCost +
             costDetail.value.mainBusinessOtherCost
    }),
    otherBusinessCostTotal: computed(() => {
      return costDetail.value.materialSalesCost + costDetail.value.fixedAssetRentCost +
             costDetail.value.intangibleAssetRentCost + costDetail.value.packagingRentCost +
             costDetail.value.otherBusinessOtherCost
    }),
    totalOperatingCost: computed(() => {
      return costDetail.value.mainBusinessCostTotal + costDetail.value.otherBusinessCostTotal
    }),
    totalNonOperatingExpense: computed(() => {
      return costDetail.value.nonCurrentAssetDisposalLoss + costDetail.value.nonMonetaryExchangeLoss +
             costDetail.value.debtRestructuringLoss + costDetail.value.extraordinaryLoss +
             costDetail.value.donationExpense + costDetail.value.sponsorshipExpense +
             costDetail.value.penaltyExpense + costDetail.value.badDebtExpense +
             costDetail.value.unrecoverableBondLoss + costDetail.value.nonOperatingOtherExpense
    })
  })

  const periodCost = ref({
    selling: {
      employeeCompensation: 0, laborFee: 0, consultingFee: 0, entertainmentFee: 0,
      advertisingFee: 0, commissionFee: 0, depreciationFee: 0, lossDamageFee: 0,
      officeFee: 0, boardFee: 0, rentFee: 0, litigationFee: 0, travelFee: 0,
      insuranceFee: 0, transportationFee: 0, repairFee: 0, packagingFee: 0,
      technologyFee: 0, researchFee: 0, taxesFee: 0, interestFee: 0,
      exchangeDiffFee: 0, cashDiscountFee: 0, otherFee: 0
    },
    management: {
      employeeCompensation: 0, laborFee: 0, consultingFee: 0, entertainmentFee: 0,
      advertisingFee: 0, commissionFee: 0, depreciationFee: 0, lossDamageFee: 0,
      officeFee: 0, boardFee: 0, rentFee: 0, litigationFee: 0, travelFee: 0,
      insuranceFee: 0, transportationFee: 0, repairFee: 0, packagingFee: 0,
      technologyFee: 0, researchFee: 0, taxesFee: 0, interestFee: 0,
      exchangeDiffFee: 0, cashDiscountFee: 0, otherFee: 0
    },
    financial: {
      employeeCompensation: 0, laborFee: 0, consultingFee: 0, entertainmentFee: 0,
      advertisingFee: 0, commissionFee: 0, depreciationFee: 0, lossDamageFee: 0,
      officeFee: 0, boardFee: 0, rentFee: 0, litigationFee: 0, travelFee: 0,
      insuranceFee: 0, transportationFee: 0, repairFee: 0, packagingFee: 0,
      technologyFee: 0, researchFee: 0, taxesFee: 0, interestFee: 0,
      exchangeDiffFee: 0, cashDiscountFee: 0, otherFee: 0
    }
  })

  const taxAdjustment = ref({
    incomeAdjustments: [],
    expenseAdjustments: [],
    assetAdjustments: []
  })

  const taxIncentive = ref({
    taxExemption: [],
    reducedIncome: [],
    additionalDeduction: [],
    investmentIncentive: []
  })

  function saveToLocalStorage() {
    const data = {
      basicInfo: basicInfo.value,
      mainForm: mainForm.value,
      incomeDetail: incomeDetail.value,
      costDetail: costDetail.value,
      periodCost: periodCost.value,
      taxAdjustment: taxAdjustment.value,
      taxIncentive: taxIncentive.value
    }
    localStorage.setItem('taxDeclarationData', JSON.stringify(data))
  }

  function loadFromLocalStorage() {
    const savedData = localStorage.getItem('taxDeclarationData')
    if (savedData) {
      const data = JSON.parse(savedData)
      Object.assign(basicInfo.value, data.basicInfo || {})
      Object.assign(mainForm.value, data.mainForm || {})
      Object.assign(incomeDetail.value, data.incomeDetail || {})
      Object.assign(costDetail.value, data.costDetail || {})
      Object.assign(periodCost.value, data.periodCost || {})
      Object.assign(taxAdjustment.value, data.taxAdjustment || {})
      Object.assign(taxIncentive.value, data.taxIncentive || {})
    }
  }

  function exportData() {
    const data = {
      basicInfo: basicInfo.value,
      mainForm: mainForm.value,
      incomeDetail: incomeDetail.value,
      costDetail: costDetail.value,
      periodCost: periodCost.value,
      taxAdjustment: taxAdjustment.value,
      taxIncentive: taxIncentive.value,
      exportDate: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `企业所得税申报数据_${new Date().toLocaleDateString()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  function importData(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)
          Object.assign(basicInfo.value, data.basicInfo || {})
          Object.assign(mainForm.value, data.mainForm || {})
          Object.assign(incomeDetail.value, data.incomeDetail || {})
          Object.assign(costDetail.value, data.costDetail || {})
          Object.assign(periodCost.value, data.periodCost || {})
          Object.assign(taxAdjustment.value, data.taxAdjustment || {})
          Object.assign(taxIncentive.value, data.taxIncentive || {})
          saveToLocalStorage()
          resolve()
        } catch (error) {
          reject(error)
        }
      }
      reader.readAsText(file)
    })
  }

  function calculatePeriodCostTotals() {
    const calculateSectionTotal = (section) => {
      return Object.values(section).reduce((sum, val) => sum + (Number(val) || 0), 0)
    }
    return {
      sellingTotal: calculateSectionTotal(periodCost.value.selling),
      managementTotal: calculateSectionTotal(periodCost.value.management),
      financialTotal: calculateSectionTotal(periodCost.value.financial)
    }
  }

  return {
    basicInfo,
    mainForm,
    incomeDetail,
    costDetail,
    periodCost,
    taxAdjustment,
    taxIncentive,
    saveToLocalStorage,
    loadFromLocalStorage,
    exportData,
    importData,
    calculatePeriodCostTotals
  }
})