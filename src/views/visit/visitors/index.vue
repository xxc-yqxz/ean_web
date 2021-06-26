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
		></el-input>

		<el-button type="primary" icon="el-icon-search" size="small"
			>搜索</el-button
		>
		<el-button type="primary" icon="el-icon-refresh" size="small"
			>重置</el-button
		>
		<el-button type="warning" round size="small">导出</el-button>
		<div>
			<el-button
				type="danger"
				style="margin: 20px 0"
				size="small"
				@click="deleteMany()"
				>批量删除</el-button
			>
		</div>
		<el-table
			ref="multipleTable"
			:data="tableData"
			tooltip-effect="dark"
			style="width: 100%"
			border
		>
			<el-table-column type="selection" width="55" align="center">
			</el-table-column>
			<el-table-column type="index" label="Id" width="55"> </el-table-column>
			<el-table-column label="时间" width="120">
				<template slot-scope="scope">{{ scope.row.date }}</template>
			</el-table-column>
			<el-table-column label="地址" width="250" prop="address">
			</el-table-column>
			<el-table-column prop="name" label="姓名" width="120"> </el-table-column>
			<el-table-column prop="startTime" label="开始时间"> </el-table-column>
			<el-table-column prop="endTime" label="结束时间"> </el-table-column>
			<el-table-column prop="phone" label="电话"> </el-table-column>
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
							<el-button type="primary" size="mini" @click="row.visible = false"
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
		>
			<el-form
				style="width: 100%; margin-left: 50px"
				:model="tmForm"
				:rules="rules"
				ref="tmForm"
			>
				<el-form-item label="姓名" inline prop="name">
					<el-input
						autocomplete="off"
						v-model="tmForm.name"
						size="small"
						style="width: 200px"
					></el-input>
				</el-form-item>
				<el-form-item label="地址" prop="address">
					<el-input
						autocomplete="off"
						v-model="tmForm.address"
						size="small"
						style="width: 300px"
					></el-input>
				</el-form-item>
				<el-form-item label="电话" prop="phone">
					<el-input
						autocomplete="off"
						v-model="tmForm.phone"
						size="small"
						style="width: 300px"
					></el-input>
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
			:page-sizes="[1, 2, 5]"
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
			tmForm: {
				name: "",
				address: "",
				phone: "",
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
				address: [{ required: true, message: "请输入地址", trigger: "blur" }],
			},
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
		},
		showUpdateDialog(row) {
			this.dialogTableVisible = true;
			this.tmForm = {
				...row, // 最简单的浅拷贝
			};
		},
		deleteMany() {
			this.$confirm("确定删除选中数据?", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning",
			})
				.then(() => {
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