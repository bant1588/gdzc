let assetList = JSON.parse(localStorage.getItem('assets')) || [];

// 保存到本地存储
function saveToLocal() {
localStorage.setItem('assets', JSON.stringify(assetList));
renderList();
renderSummary(); // 新增：渲染分类汇总
}

// 清空所有数据
function clearAll() {
if (!confirm('确定清空所有数据？清空后无法恢复！')) return;
assetList = [];
saveToLocal();
}

// 删除资产
function delAsset(id) {
if (!confirm('确定删除该资产？删除后相关折旧、处置记录也会删除！')) return;
assetList = assetList.filter(item => item.id !== id);
saveToLocal();
}

// 显示新增面板
function showAdd() {
document.getElementById('addPanel').style.display = 'block';
document.getElementById('panelTitle').innerText = '新增固定资产';
document.getElementById('editId').value = '';
// 重置表单
document.getElementById('name').value = '';
document.getElementById('code').value = '';
document.getElementById('type').value = '';
document.getElementById('buyDate').value = '';
document.getElementById('original').value = '';
document.getElementById('useYears').value = '';
document.getElementById('residualRate').value = '5';
document.getElementById('method').value = 'average';
document.getElementById('status').value = 'using'; // 默认在用
document.getElementById('remark').value = '';
}

// 编辑资产
function editAsset(id) {
const item = assetList.find(i => i.id === id);
if (!item) return;
document.getElementById('addPanel').style.display = 'block';
document.getElementById('panelTitle').innerText = '编辑固定资产';
document.getElementById('editId').value = item.id;
// 填充表单
document.getElementById('name').value = item.name;
document.getElementById('code').value = item.code || '';
document.getElementById('type').value = item.type || '';
document.getElementById('buyDate').value = item.buyDate;
document.getElementById('original').value = item.original;
document.getElementById('useYears').value = item.useYears;
document.getElementById('residualRate').value = item.residualRate || 5;
document.getElementById('method').value = item.method || 'average';
document.getElementById('status').value = item.status || 'using';
document.getElementById('remark').value = item.remark || '';
}

// 保存资产（新增/编辑）
function saveAsset() {
const editId = document.getElementById('editId').value;
const name = document.getElementById('name').value.trim();
const code = document.getElementById('code').value.trim();
const type = document.getElementById('type').value.trim();
const buyDate = document.getElementById('buyDate').value;
const original = Number(document.getElementById('original').value) || 0;
const useYears = Number(document.getElementById('useYears').value) || 0;
const residualRate = Number(document.getElementById('residualRate').value) || 0;
const method = document.getElementById('method').value;
const status = document.getElementById('status').value;
const remark = document.getElementById('remark').value.trim();

// 校验必填项
if (!name || !buyDate || !original || !useYears) {
alert('请填写必填项（名称、购入日期、原值、使用年限）');
return;
}

const data = {
name, code, type, buyDate, original, useYears, residualRate, method, status, remark
};

// 编辑模式：更新现有资产
if (editId) {
const index = assetList.findIndex(i => i.id === editId);
if (index !== -1) {
// 保留处置记录（如果有）
if (assetList[index].disposeRecord) {
data.disposeRecord = assetList[index].disposeRecord;
}
assetList[index] = { ...assetList[index], ...data };
}
} else {
// 新增模式：添加新资产
data.id = Date.now().toString();
data.disposeRecord = null; // 初始无处置记录
assetList.push(data);
}

saveToLocal();
document.getElementById('addPanel').style.display = 'none';
}

// -------------- 新增：报废管理 --------------
function scrapAsset(id) {
const item = assetList.find(i => i.id === id);
if (!item) return;
if (item.status === 'scrapped') {
alert('该资产已处于报废状态！');
return;
}
if (!confirm(`确定将【${item.name}】标记为报废？`)) return;

// 更新资产状态为报废
const index = assetList.findIndex(i => i.id === id);
assetList[index] = {
...assetList[index],
status: 'scrapped',
remark: (item.remark || '') + `，${new Date().toISOString().slice(0,10)} 标记为报废`
};
saveToLocal();
}

// -------------- 新增：固定资产处置 --------------
function showDisposePanel(id) {
const item = assetList.find(i => i.id === id);
if (!item) return;
if (item.status === 'disposed') {
alert('该资产已完成处置！');
return;
}

document.getElementById('disposePanel').style.display = 'block';
document.getElementById('disposeId').value = id;
document.getElementById('disposeName').value = item.name;
// 重置处置表单
document.getElementById('disposeDate').value = new Date().toISOString().slice(0,10);
document.getElementById('disposeType').value = '';
document.getElementById('disposeAmount').value = 0;
document.getElementById('disposeDesc').value = '';
}

function hideDisposePanel() {
document.getElementById('disposePanel').style.display = 'none';
}

// 保存处置记录
function saveDispose() {
const id = document.getElementById('disposeId').value;
const disposeDate = document.getElementById('disposeDate').value;
const disposeType = document.getElementById('disposeType').value;
const disposeAmount = Number(document.getElementById('disposeAmount').value) || 0;
const disposeDesc = document.getElementById('disposeDesc').value.trim();

if (!disposeDate || !disposeType) {
alert('请填写处置日期和处置方式！');
return;
}

// 生成处置记录
const disposeRecord = {
date: disposeDate,
type: disposeType,
amount: disposeAmount,
desc: disposeDesc,
createTime: new Date().toISOString()
};

// 更新资产状态和处置记录
const index = assetList.findIndex(i => i.id === id);
assetList[index] = {
...assetList[index],
status: 'disposed',
disposeRecord: disposeRecord,
remark: (assetList[index].remark || '') + `，${disposeDate} 完成处置（方式：${getDisposeTypeName(disposeType)}）`
};

saveToLocal();
hideDisposePanel();
alert('处置记录保存成功！');
}

// 转换处置方式为中文
function getDisposeTypeName(type) {
const map = {
sale: '出售',
discard: '报废处置',
donate: '捐赠',
other: '其他'
};
return map[type] || type;
}

// 查看处置记录
function showDisposeDetail(id) {
const item = assetList.find(i => i.id === id);
if (!item || !item.disposeRecord) {
alert('该资产无处置记录！');
return;
}

const detailCard = document.getElementById('disposeDetailCard');
detailCard.style.display = 'block';
const record = item.disposeRecord;

let html = `
<h6>资产名称：${item.name}（编号：${item.code || '无'}）</h6>
<table class="table table-sm mt-3">
<thead>
<tr><th>处置日期</th><th>处置方式</th><th>处置金额（元）</th><th>处置说明</th></tr>
</thead>
<tbody>
<tr>
<td>${record.date}</td>
<td>${getDisposeTypeName(record.type)}</td>
<td>${record.amount.toFixed(2)}</td>
<td>${record.desc || '无'}</td>
</tr>
</tbody>
</table>
`;
document.getElementById('disposeDetailContent').innerHTML = html;
}

function hideDisposeDetail() {
document.getElementById('disposeDetailCard').style.display = 'none';
}

// -------------- 新增：分类汇总 --------------
function getAssetSummary() {
// 按类别分组汇总
const summary = {};
assetList.forEach(item => {
const type = item.type || '未分类';
if (!summary[type]) {
summary[type] = {
count: 0, // 资产数量
originalTotal: 0, // 原值合计
netTotal: 0 // 净值合计
};
}
summary[type].count++;
summary[type].originalTotal += item.original;
const { net } = calcDepreciation(item);
summary[type].netTotal += net;
});

// 按状态分组汇总
const statusSummary = {
using: 0,
scrapped: 0,
disposed: 0
};
assetList.forEach(item => {
statusSummary[item.status || 'using']++;
});

return { category: summary, status: statusSummary };
}

// -------------- 新增：多条件筛选 --------------
function filterAssets() {
const name = document.getElementById('filterName').value.trim().toLowerCase();
const type = document.getElementById('filterType').value.trim().toLowerCase();
const status = document.getElementById('filterStatus').value;
const method = document.getElementById('filterMethod').value;

// 筛选逻辑
const filtered = assetList.filter(item => {
// 名称筛选
const matchName = name ? item.name.toLowerCase().includes(name) : true;
// 类别筛选
const matchType = type ? (item.type || '').toLowerCase().includes(type) : true;
// 状态筛选
const matchStatus = status === 'all' ? true : item.status === status;
// 折旧方法筛选
const matchMethod = method === 'all' ? true : item.method === method;

return matchName && matchType && matchStatus && matchMethod;
});

// 渲染筛选后的列表
renderFilteredList(filtered);
}

// 重置筛选
function resetFilter() {
document.getElementById('filterName').value = '';
document.getElementById('filterType').value = '';
document.getElementById('filterStatus').value = 'all';
document.getElementById('filterMethod').value = 'all';
renderList(); // 重置为全部列表
}

// -------------- 新增：固定资产清单（按类别分组） --------------
function getAssetListByCategory() {
const list = {};
assetList.forEach(item => {
const type = item.type || '未分类';
if (!list[type]) {
list[type] = [];
}
const { monthly, accumulated, net } = calcDepreciation(item);
list[type].push({
...item,
monthly: monthly.toFixed(2),
accumulated: accumulated.toFixed(2),
net: net.toFixed(2),
statusText: getStatusText(item.status)
});
});
return list;
}

// 转换状态为中文
function getStatusText(status) {
const map = {
using: '在用',
scrapped: '已报废',
disposed: '已处置'
};
return map[status || 'using'];
}