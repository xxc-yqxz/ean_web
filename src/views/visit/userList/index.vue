<template>
	<div class="app-container">
		<span class="time_text">规定时间段搜索：</span>
		<el-date-picker
			v-model="value1"
			size="small"
			type="datetimerange"
			range-separator="至"
			start-placeholder="开始日期"
			end-placeholder="结束日期"
			align="center"
			class="time_select"
		>
		</el-date-picker>
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
		<el-button type="warning" round size="small">导出</el-button>
		<div>
			<el-button
				type="danger"
				style="margin: 20px 0"
				size="small"
				@click="showHint()"
				>批量删除</el-button
			>
		</div>
		<el-table
			ref="multipleTable"
			:data="tableData"
			tooltip-effect="dark"
			style="width: 100%"
			border
			@selection-change="handleSelectionChange"
		>
			<el-table-column type="selection" width="55" align="center">
			</el-table-column>
			<el-table-column prop="account.accountId" label="用户Id">
			</el-table-column>
			<el-table-column prop="account.name" label="用户名" width="120">
			</el-table-column>
			<el-table-column prop="account.phone" label="电话" width="250">
			</el-table-column>
			<el-table-column
				prop="account.picUpAddress"
				label="正面身份证"
				width="120"
			>
			</el-table-column>
			<el-table-column prop="account.picBackAddress" label="反面身份证">
			</el-table-column>
			<el-table-column prop="account.registerTime" label="注册时间">
			</el-table-column>
			<el-table-column prop="account.isRealName" label="是否实名">
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="{ row, $index }">
					<el-button
						size="mini"
						icon="el-icon-edit-outline"
						@click="showUpdateDialog(row)"
					></el-button>
					<el-popover placement="top" width="100" v-model="row.visible">
						<p>确定此条用户信息吗？</p>
						<div style="text-align: right; margin: 0">
							<el-button size="mini" type="text" @click="row.visible = false"
								>取消</el-button
							>
							<el-button type="primary" size="mini" @click="deleteMany(row)"
								>确定</el-button
							>
						</div>
						<el-button
							size="mini"
							slot="reference"
							type="danger"
							icon="el-icon-delete"
						></el-button>
					</el-popover>
				</template>
			</el-table-column>
		</el-table>
		<el-dialog
			title="用户信息"
			:visible.sync="dialogTableVisible"
			width="600px"
			destroy-on-close
		>
			<el-form
				style="width: 100%; margin-left: 50px"
				:model="tmForm"
				:rules="rules"
				ref="tmForm"
			>
				<el-form-item label="用户名" prop="name">
					<el-input
						autocomplete="off"
						v-model="tmForm.name"
						size="small"
						style="width: 200px"
					></el-input>
				</el-form-item>
				<el-form-item label="电话" prop="phone">
					<el-input
						autocomplete="off"
						v-model="tmForm.phone"
						size="small"
						style="width: 200px; margin-left: 15px"
					></el-input>
				</el-form-item>
				<el-form-item label="是否实名">
					<el-switch v-model="isProp"></el-switch>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogTableVisible = false">取 消</el-button>
				<el-button type="primary" @click="updateUserInfo">确 定</el-button>
			</div>
		</el-dialog>
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
export default {
	name: "Index",
	components: {},
	data() {
		return {
			page: 1,
			limit: 3,
			total: 0,
			value1: [,],
			dialogTableVisible: false,
			multipleSelection: [],
			tmForm: {
				name: "",
				phone: "",
				isRealName: "",
			},
			tableData: [],
			rules: {
				// 每个要验证的字段规则都是一个数组
				// 数组里面是对象，每一个对象就代表是验证的一个规则
				// 每个规则对象里面包含三个东西，1、规则 2、错误提示信息 3、触发时机（验证时机）
				// 触发时机：一共有三个，失去焦点的时候blur 内容改变的时候change 整体验证的时候
				name: [
					{ required: true, message: "请输入用户名", trigger: "blur" },
					{
						min: 2,
						max: 10,
						message: "长度在 3 到 5 个字符",
						trigger: "change",
					},
				],
				phone: [
					{ required: true, message: "请输入手机号", trigger: "blur" },
					{
						min: 11,
						max: 11,
						message: "请输入正确的手机号",
						trigger: "change",
					},
				],
			},
			searchMsg: "",
			isProp: false,
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
				const result = await this.$API.getOrSearchUserInfo({
					page: this.page,
					limit: this.limit,
				});
				console.log(this.limit, this.page);
				console.log(result.accounts.length);
				// if (result) {
				// }
				this.total = result.total_num;
				this.tableData = result.accounts;
			} catch (error) {}
		},
		// 这个是切换分页的回调
		// handleCurrentChange(page) {
		// 	this.page = page;
		// 	this.getTrademarkList();
		// },

		// 这个是切换每页数量的回调,这个回调不能省略
		handleSizeChange(size) {
			this.limit = size;
			this.getTrademarkList();
		},
		showUpdateDialog(row) {
			this.dialogTableVisible = true;
			console.log(row);
			this.tmForm = {
				...row.account, // 最简单的浅拷贝
			};
		},
		async deleteMany(row = "") {
			if (row === "") {
				console.log(111);
				const result = await this.$API.UserDelete(this.multipleSelection);
				this.getTrademarkList();
			} else {
				let deleteId = [];
				deleteId.push(row.account.accountId);
				try {
					const result = await this.$API.UserDelete(deleteId);
					this.$message({
						message: "删除成功!",
						type: "success",
						duration: 1000,
					});
					this.dialogTableVisible = false;
					this.getTrademarkList();
				} catch (error) {}
			}
		},
		updateUserInfo() {
			this.$refs.tmForm.validate((valid) => {
				if (valid) {
					dialogTableVisible = false;
				} else {
					console.log("error submit!!");
					return false;
				}
			});
		},
		handleSelectionChange(val) {
			// this.multipleSelection = val;
			// console.log(val);
			this.multipleSelection = [];
			val.forEach((item, index) => {
				this.multipleSelection.push(item.account.accountId);
			});
			console.log(this.multipleSelection);
		},
		showHint() {
			if (this.multipleSelection.length === 0) {
				this.$message({
					message: "未选择数据",
					type: "warning",
					duration: 1000,
				});
			} else {
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
			}
		},
		async searchInfo() {
			let searchMsg = {
				page: this.page,
				limit: this.limit,
				key: this.searchMsg,
			};
			const result = await this.$API.getOrSearchUserInfo(searchMsg);
			console.log(searchMsg);
			console.log(result);
			this.total = result.total_num;
			this.tableData = result.accounts;
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