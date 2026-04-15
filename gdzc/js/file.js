// 导出 JSON 备份
function exportData() {
const data = JSON.stringify(assetList, null, 2);
const blob = new Blob([data], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = `固定资产_${new Date().toISOString().slice(0,10)}.json`;
a.click();
URL.revokeObjectURL(url);
}

// 导入 JSON 数据
function importData(e) {
const file = e.target.files[0];
if (!file) return;
const reader = new FileReader();
reader.onload = ev => {
try {
const data = JSON.parse(ev.target.result);
if (Array.isArray(data)) {
assetList = data;
saveToLocal();
alert('导入成功！');
}
} catch (e) {
alert('文件格式错误，请选择正确的JSON文件！');
}
};
reader.readAsText(file);
}

// 导出 Excel 明细表（含所有资产信息+折旧数据+状态）
function exportExcel() {
const sheet = assetList.map(item => {
const c = calcDepreciation(item);
const disposeRecord = item.disposeRecord || {};
return {
'资产名称': item.name,
'资产编号': item.code || '',
'类别': item.type || '',
'购入日期': item.buyDate,
'原值（元）': item.original,
'使用年限（年）': item.useYears,
'残值率（%）': item.residualRate,
'折旧方法': item.method === 'double' ? '双倍余额递减法' : '平均年限法',
'月折旧额（元）': c.monthly.toFixed(2),
'累计折旧（元）': c.accumulated.toFixed(2),
'当前净值（元）': c.net.toFixed(2),
'资产状态': getStatusText(item.status),
'处置方式': item.status === 'disposed' ? getDisposeTypeName(disposeRecord.type) : '无',
'处置日期': item.status === 'disposed' ? disposeRecord.date : '无',
'处置金额（元）': item.status === 'disposed' ? disposeRecord.amount.toFixed(2) : '0.00',
'备注': item.remark || ''
};
});

const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(sheet);
XLSX.utils.book_append_sheet(wb, ws, '固定资产折旧表');
XLSX.writeFile(wb, `固定资产折旧表_${new Date().toISOString().slice(0,10)}.xlsx`);
}