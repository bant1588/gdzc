// 平均年限法
function calcAverage(item) {
const original = item.original;
const useYears = item.useYears;
const residualRate = item.residualRate;
const buyDate = new Date(item.buyDate);
const now = new Date();

const residual = original * residualRate / 100;
const totalMonth = useYears * 12;
const monthly = totalMonth > 0 ? (original - residual) / totalMonth : 0;

let usedMonths = (now.getFullYear() - buyDate.getFullYear()) * 12 +
(now.getMonth() - buyDate.getMonth());
usedMonths = Math.max(0, usedMonths);
const realUsed = Math.min(usedMonths, totalMonth);
const accumulated = monthly * realUsed;
const net = Math.max(original - accumulated, residual);

return { monthly, accumulated, net, residual, totalMonth, usedMonths };
}

// 双倍余额递减法
function calcDouble(item) {
const original = item.original;
const useYears = item.useYears;
const residualRate = item.residualRate;
const buyDate = new Date(item.buyDate);
const now = new Date();

const residual = original * residualRate / 100;
const totalMonth = useYears * 12;
const rate = 2 / useYears;
let usedMonths = (now.getFullYear() - buyDate.getFullYear()) * 12 +
(now.getMonth() - buyDate.getMonth());
usedMonths = Math.max(0, usedMonths);

let acc = 0;
let last = original;
const realUsed = Math.min(usedMonths, totalMonth);

for (let i = 0; i < realUsed; i++) {
const monthDep = last * rate / 12;
if (last - monthDep < residual) {
acc += last - residual;
last = residual;
break;
}
acc += monthDep;
last -= monthDep;
}

const monthly = acc / (realUsed || 1);
const net = Math.max(original - acc, residual);
return { monthly, accumulated: acc, net, residual, totalMonth, usedMonths };
}

// 统一对外：根据资产选择的方法计算折旧
function calcDepreciation(item) {
if (item.method === 'double') return calcDouble(item);
return calcAverage(item);
}

// 生成折旧明细（按月）
function generateDetail(item) {
const list = [];
const original = item.original;
const buy = new Date(item.buyDate);
const totalMonth = item.useYears * 12;

for (let m = 0; m < totalMonth; m++) {
const d = new Date(buy);
d.setMonth(d.getMonth() + m);
const dateStr = d.toISOString().slice(0, 7);

const temp = { ...item, buyDate: d.toISOString().slice(0, 10) };
const { monthly, accumulated, net } = calcDepreciation(temp);
list.push({
date: dateStr,
monthly: monthly.toFixed(2),
accumulated: accumulated.toFixed(2),
net: net.toFixed(2)
});
}
return list;
}