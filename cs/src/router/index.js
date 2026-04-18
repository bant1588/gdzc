import { createRouter, createWebHistory } from 'vue-router'
import BasicInfo from '@/views/BasicInfo.vue'
import MainForm from '@/views/MainForm.vue'
import IncomeDetail from '@/views/IncomeDetail.vue'
import CostDetail from '@/views/CostDetail.vue'
import PeriodCost from '@/views/PeriodCost.vue'
import TaxAdjustment from '@/views/TaxAdjustment.vue'
import TaxIncentive from '@/views/TaxIncentive.vue'
import Preview from '@/views/Preview.vue'

const routes = [
  { path: '/', redirect: '/basic-info' },
  { path: '/basic-info', name: 'BasicInfo', component: BasicInfo },
  { path: '/main-form', name: 'MainForm', component: MainForm },
  { path: '/income-detail', name: 'IncomeDetail', component: IncomeDetail },
  { path: '/cost-detail', name: 'CostDetail', component: CostDetail },
  { path: '/period-cost', name: 'PeriodCost', component: PeriodCost },
  { path: '/tax-adjustment', name: 'TaxAdjustment', component: TaxAdjustment },
  { path: '/tax-incentive', name: 'TaxIncentive', component: TaxIncentive },
  { path: '/preview', name: 'Preview', component: Preview }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router