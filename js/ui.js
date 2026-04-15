// 渲染主资产列表
function renderList() {
renderFilteredList(assetList);
}

// 渲染筛选后的列表
function renderFilteredList(list) {
const body = document.getElementById('listBody');
body.innerHTML = '';

if (list.length === 0) {
body.innerHTML = '<tr><td colspan="11" class="text-center">暂无资产数据</td></tr>';
return;
}

list.forEach(item => {
const { monthly, accumulated, net } = calcDepreciation(item);
const statusText = getStatusText(item.status);
const statusClass = item.status === 'using' ? 'text-success' : (item.status === 'scrapped' ? 'text-danger' : 'text-warning');

tr = document.createElement('tr');
tr.innerHTML = `
<td>${item.name}</td>
<td>${item.code || '-'}</td>
<td>${item.type || '-'}</td>
<td>${item.buyDate}</td>
<td>${item.original.toFixed(2)}</td>
<td>${item.useYears}</td>
<td>${item.method === 'double' ? '双倍余额' : '平均年限'}</td>
<td>${monthly.toFixed(2)}</td>
<td>${net.toFixed(2)}</td>
<td class="${statusClass}">${statusText}</td>
<td>
<button class="btn btn-sm btn-primary me-1" onclick="editAsset('${item.id}')">编辑</button>
<button class="btn btn-sm btn-info me-1" onclick="showDetail('${item.id}')">明细</button>
${item.status === 'using' ? `
<button class="btn btn-sm btn-danger me-1" onclick="scrapAsset('${item.id}')">报废</button>
<button class="btn btn-sm btn-warning" onclick="showDisposePanel('${item.id}')">处置</button>
` : item.status === 'disposed' ? `
<button class="btn btn-sm btn-secondary" onclick="showDisposeDetail('${item.id}')">处置记录</button>
` : ''}
<button class="btn btn-sm btn-danger" onclick="delAsset('${item.id}')">删除</button>
</td>
`;
body.appendChild(tr);
});
}

// 渲染折旧明细
function showDetail(id) {
const item = assetList.find(i => i.id === id);
if (!item) return;
const card = document.getElementById('detailCard');
card.style.display = 'block';
document.getElementById('detailTitle').innerText = `${item.name} - 折旧明细`;
const detail = generateDetail(item);

let html = `
<div class="mb-3">
<span class="me-3">原值：${item.original.toFixed(2)}元</span>
<span class="me-3">使用年限：${item.useYears}年</span>
<span class="me-3">折旧方法：${item.method === 'double' ? '双倍余额递减法' : '平均年限法'}</span>
<span>当前净值：${calcDepreciation(item).net.toFixed(2)}元</span>
</div>
<table class="table table-sm">
<thead><tr><th>期间</th><th>月折旧</th><th>累计折旧</th><th>净值</th></tr></thead>
<tbody>
`;
detail.forEach(d => {
html += `<tr>
<td>${d.date}</td>
<td>${d.monthly}</td>
<td>${d.accumulated}</td>
<td>${d.net}</td>
</tr>`;
});
html += '</tbody></table>';
document.getElementById('detailContent').innerHTML = html;
}

function hideDetail() {
document.getElementById('detailCard').style.display = 'none';
}

// -------------- 新增：渲染分类汇总 --------------
function renderSummary() {
const { category, status } = getAssetSummary();
const content = document.getElementById('summaryContent');

// 分类汇总HTML
let categoryHtml = `<h6>按类别汇总</h6><table class="table table-sm mt-2 mb-4">
<thead><tr><th>资产类别</th><th>资产数量</th><th>原值合计（元）</th><th>净值合计（元）</th></tr></thead>
<tbody>`;

for (const [type, data] of Object.entries(category)) {
categoryHtml += `<tr>
<td>${type}</td>
<td>${data.count}</td>
<td>${data.originalTotal.toFixed(2)}</td>
<td>${data.netTotal.toFixed(2)}</td>
</tr>`;
}
categoryHtml += '</tbody></table>';

// 状态汇总HTML
let statusHtml = `<h6>按状态汇总</h6><table class="table table-sm mt-2">
<thead><tr><th>资产状态</th><th>数量</th></tr></thead>
<tbody>
<tr><td>在用</td><td>${status.using}</td></tr>
<tr><td>已报废</td><td>${status.scrapped}</td></tr>
<tr><td>已处置</td><td>${status.disposed}</td></tr>
<tr><td><strong>合计</strong></td><td><strong>${status.using + status.scrapped + status.disposed}</strong></td></tr>
</tbody></table>`;

content.innerHTML = categoryHtml + statusHtml;
}

// -------------- 新增：固定资产清单（按类别分组展示） --------------
function showAssetList() {
const listByCategory = getAssetListByCategory();
const card = document.getElementById('assetListCard');
const content = document.getElementById('assetListContent');
card.classList.remove('hide');
document.getElementById('assetTableCard').classList.add('hide');
document.getElementById('summaryCard').classList.add('hide');
document.getElementById('filterPanel').classList.add('hide');

let html = `<div class="print-only mb-3 text-center"><h4>固定资产清单</h4><p>生成时间：${new Date().toLocaleString()}</p></div>`;

for (const [type, assets] of Object.entries(listByCategory)) {
html += `
<div class="mb-4">
<h5>${type}（共${assets.length}项）</h5>
<table class="table table-sm table-bordered">
<thead>
<tr>
<th>序号</th>
<th>资产名称</th>
<th>资产编号</th>
<th>购入日期</th>
<th>原值（元）</th>
<th>净值（元）</th>
<th>状态</th>
</tr>
</thead>
<tbody>
`;
assets.forEach((item, index) => {
html += `<tr>
<td>${index + 1}</td>
<td>${item.name}</td>
<td>${item.code || '-'}</td>
<td>${item.buyDate}</td>
<td>${item.original.toFixed(2)}</td>
<td>${item.net}</td>
<td>${item.statusText}</td>
</tr>`;
});
html += `</tbody></table></div>`;
}

// 清单合计
const totalOriginal = assetList.reduce((sum, item) => sum + item.original, 0);
const totalNet = assetList.reduce((sum, item) => sum + calcDepreciation(item).net, 0);
html += `
<div class="mt-4 border-top pt-3">
<table class="table table-sm table-bordered">
<tbody>
<tr>
<td><strong>资产总计</strong></td>
<td><strong>${assetList.length}项</strong></td>
<td><strong>原值合计：${totalOriginal.toFixed(2)}元</strong></td>
<td><strong>净值合计：${totalNet.toFixed(2)}元</strong></td>
</tr>
</tbody>
</table>
</div>
`;

content.innerHTML = html;
}

function hideAssetList() {
document.getElementById('assetListCard').classList.add('hide');
document.getElementById('assetTableCard').classList.remove('hide');
document.getElementById('summaryCard').classList.remove('hide');
document.getElementById('filterPanel').classList.remove('hide');
}

// 初始化渲染
renderList();
renderSummary();