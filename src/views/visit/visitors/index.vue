<template>
	<div class="app-container">
		<el-input
			placeholder="请输入内容"
			style="width: 200px; margin-right: 15px"
			size="small"
			v-model="searchMsg"
		></el-input>

		<el-button
			type="primary"
			icon="el-icon-search"
			size="small"
			@click="searchInfo()"
			>搜索</el-button
		>
		<el-button
			type="primary"
			icon="el-icon-refresh"
			size="small"
			@click="searchMsg = ''"
			>重置</el-button
		>

		<download-excel
			class="export-excel-wrapper"
			:data="json_data"
			:fields="json_fields"
			name="访客信息表.xls"
			style="display: inline"
			:before-generate="exportExcel"
		>
			<el-button type="warning" round size="small">导出</el-button>
			<!-- 上面可以自定义自己的样式，还可以引用其他组件button -->
			<!-- <el-button type="primary" size="small">导出EXCEL</el-button> -->
		</download-excel>
		<div>
			<el-button
				type="danger"
				style="margin-top: 10px"
				size="small"
				@click="showHint()"
				>批量删除</el-button
			>
		</div>
		<el-table
			:data="tableData"
			border
			style="width: 100%; margin-top: 20px"
			ref="multipleTable"
			@selection-change="handleSelectionChange"
		>
			<!-- <el-table-column
				header-align="center"
				align="center"
				type="index"
				prop="prop"
				label="label"
			>
			</el-table-column> -->
			<el-table-column type="selection" width="55" align="center">
			</el-table-column>
			<el-table-column prop="record.recordId" label="访问记录Id" width="200">
			</el-table-column>
			<el-table-column prop="assistantIds" label="访客Id" width="250">
				<template slot-scope="{ row, $index }">
					<!-- <div>{{ row.assistantIds }}</div> -->
					<div
						v-for="(val, key) in row.assistantIds"
						style="margin-bottom: 11px"
					>
						{{ val }}
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="assistantCardNums" label="访客卡号" width="160">
				<template slot-scope="{ row, $index }">
					<!-- <div>{{ row.assistantIds }}</div> -->
					<div
						v-for="(val, key) in row.assistantCardNums"
						style="margin-bottom: 11px"
					>
						{{ val }}
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="names" label="访客姓名" width="100px">
				<template slot-scope="{ row, $index }">
					<!-- <div>{{ row.assistantIds }}</div> -->
					<div v-for="(val, key) in row.names" style="margin-bottom: 11px">
						{{ val }}
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="phones" label="电话">
				<template slot-scope="{ row, $index }">
					<!-- <div>{{ row.assistantIds }}</div> -->

					<div v-for="(val, key) in row.phones" style="margin-bottom: 11px">
						{{ val }}
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="record.flag" label="审批状态"> </el-table-column>
			<el-table-column prop="record.reason" label="拜访理由"> </el-table-column>
			<el-table-column prop="record.date" label="拜访日期"> </el-table-column>
			<el-table-column prop="record.time" label="拜访时间" width="50">
			</el-table-column>
			<el-table-column label="审核" width="140px" fixed="right">
				<template slot-scope="{ row, $index }">
					<el-radio-group
						:value="row.record.isAccess"
						v-if="
							row.record.flag === '通过' ||
							row.record.flag === '拒绝' ||
							row.record.flag === '待审批'
						"
					>
						<el-radio
							:label="true"
							border
							style="margin-left: 38px; margin-top: 10px"
							@change="changeAccess(true, row)"
							>通过</el-radio
						>
						<el-radio
							class="rejectBtn"
							:label="false"
							border
							style="margin: 10px 0 10px 8px"
							@change="changeAccess(false, row)"
							>拒绝</el-radio
						>
					</el-radio-group>
					<el-tag type="info" v-if="row.record.flag === '过期'">过期</el-tag>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination
			background
			style="text-align: center; margin-top: 20px"
			:current-page="page"
			:page-sizes="[3, 5, 10]"
			:page-size="limit"
			layout="sizes, prev, pager, next, jumper,->,total"
			:total="total"
			@current-change="getTrademarkList"
			@size-change="handleSizeChange"
		>
		</el-pagination>
	</div>
</template>

<script>
import JsonExcel from "vue-json-excel";
export default {
	name: "Index",
	components: {
		downloadExcel: JsonExcel,
	},
	data() {
		return {
			page: 1,
			limit: 5,
			total: 0,
			value1: [,],
			multipleSelection: [],
			tableData: [],
			dialogTableVisible: false,
			searchMsg: "",
			json_fields: {
				访问记录id: "record.recordId",
				访问人数: "record.peopleNum",
				访问原因: "record.reason",
				审核状态: "record.flag",
				访问时间: "record.time",
				访问日期: "record.date",
				访问人员: {
					field: "names",
					callback: (value) => {
						let result = "";
						value.forEach((item, index) => {
							result += item + "---";
						});
						return result.slice(0, -3);
					},
				},
				访问人员Id: {
					field: "assistantIds",
					callback: (value) => {
						let result = "";
						value.forEach((item, index) => {
							result += item + "---";
						});
						return result.slice(0, -3);
					},
				},
				访问人员电话: {
					field: "phones",
					callback: (value) => {
						let result = "";
						value.forEach((item, index) => {
							result += item + "---";
						});
						return result.slice(0, -3);
					},
				},
			},
			json_data: [],
		};
	},
	created() {},
	mounted() {
		this.getTrademarkList();
	},
	methods: {
		async getTrademarkList(page = 1) {
			this.page = page;
			try {
				const result = await this.$API.getOrSearchRecordInfo({
					page: this.page,
					limit: this.limit,
				});
				this.total = result.total_num;
				this.tableData = this.filterData(result);
			} catch (error) {}
		},
		filterData(data) {
			let assistantDatas = [];
			let assistant = {};
			data.records.forEach((item, index) => {
				assistant = {};
				let assistantIds = [];
				let assistantCardNums = [];
				let names = [];
				let phones = [];
				item.assistantList.forEach((item2, index) => {
					assistantIds.push(item2.assistantId);
					assistantCardNums.push(item2.idCardNum);
					names.push(item2.name);
					phones.push(item2.phone);
				});
				assistant.assistantIds = assistantIds;
				assistant.assistantCardNums = assistantCardNums;
				assistant.names = names;
				assistant.phones = phones;
				if (item.record.flag === 1) {
					item.record.flag = "通过";
					item.record.isAccess = true;
				} else if (item.record.flag === 2) {
					item.record.flag = "拒绝";
					item.record.isAccess = false;
				} else if (item.record.flag === 3) {
					item.record.flag = "过期";
				} else if (item.record.flag === 4) {
					item.record.flag = "待审批";
					item.record.isAccess = "";
				}
				assistant.record = item.record;
				assistantDatas.push(assistant);
			});
			return assistantDatas;
		},
		async changeAccess(val, row) {
			let flag = 2;
			console.log(val, row);
			if (val === true) {
				flag = 1;
			}
			let result = await this.$API.changeApproval({
				id: row.record.recordId,
				flag,
			});
			this.getTrademarkList(this.page);
		},
		handleSizeChange(size) {
			this.limit = size;
			this.getTrademarkList();
		},
		handleSelectionChange(val) {
			// this.multipleSelection = val;
			// console.log(val);
			this.multipleSelection = [];
			val.forEach((item, index) => {
				this.multipleSelection.push(item.record.recordId);
			});
			console.log(this.multipleSelection);
		},
		showHint() {
			this.$confirm("确定删除选中数据?", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning",
			})
				.then(() => {
					this.deleteMany();
					this.$message({
						type: "success",
						message: "删除成功!",
					});
				})
				.catch(() => {
					this.$message({
						type: "info",
						message: "已取消删除",
					});
				});
		},
		async deleteMany(row = "") {
			console.log(this.multipleSelection, 222);
			const result = await this.$API.recordDelete(this.multipleSelection);
			this.getTrademarkList(
				this.tableData.length > this.multipleSelection.length
					? this.page
					: this.page - 1
			);
		},
		async searchInfo() {
			let searchMsg = {
				page: this.page,
				limit: this.limit,
				key: this.searchMsg,
			};
			const result = await this.$API.getOrSearchRecordInfo(searchMsg);
			console.log(searchMsg);
			console.log(result);
			this.total = result.total_num;
			this.tableData = this.filterData(result);
		},
		async exportExcel() {
			const result = await this.$API.getOrSearchRecordInfo({
				page: 1,
				limit: this.total,
			});
			this.json_data = this.filterData(result);
		},
	},
};
</script>

<style scoped>
.time_text {
	padding: 0 20px;
	font-size: 15px;
}
.time_select {
	margin-right: 100px;
}
.app_container {
	margin-top: 20px;
}
</style>
<style>
.rejectBtn.is-checked {
	border: 1px solid #ef475d !important;
}
.rejectBtn .el-radio__inner:hover {
	border: 1px solid #ef475d;
}
.rejectBtn .el-radio__input.is-checked + .el-radio__label {
	color: #ef475d !important;
}
.rejectBtn .el-radio__input.is-checked .el-radio__inner {
	background: #ef475d !important;
	border-color: #ef475d !important;
}
</style>