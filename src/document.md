
# 项目分支

master 主分支 

dev-likun 包含所有1.0内容 上线前缺陷全部修复

dev-likun-1.1  
包含1.1优化内容,除图表（统计和监控）以外，未合并1.0的内容包括全局和局部样式处理和上线前缺陷的修复内容。

## 1.0和1.1较大的改动:
重构了资产结构化详情-角色信息表单填写
1. 样式改为自适应
2. 改用form ref给上层组件 以供完成检验 而不是1.0提交时候进行检验消息提示。
3.资产线索模板抽屉

重构了资产结构化表格-三种角色
1. 搜索参数和page和tab都保存在url下，刷新页面能够获取参数并填入，不会清空
2. 改变搜索参数，url变化
3. 进入资产结构化详情会将参数保存在history.state下，重新返回界面，参数会回填回搜索参数。具体见1.1产品逻辑。
4. 表单参数放在了外部bean下，方便统一处理，获取干净的提交数据。

其他内容见产品原型图修订

# 文件结构
### page 页面
acccountManagemtn 账号管理

assetStructureDetail 资产结构化详情页

assetStructureDetailNewPage 需要新开页的资产结构化详情页(非关联标注和自动标注)

assetStructureList 资产结构化列表

documentSearch 文书搜索（新开页）

errorPage 错误页面

externalSource 外部资源（拍卖详情页和文书详情页）

home 主界面

login 登录界面

structMonitor和syncMonitor 前任留下的图表监控

### components 组件
acccountManagemtn 账号管理

assetStructureList 资产结构化列表

assetStructureDetail 资产结构化详情页(主要)
> 以下组件根据状态呈现信息展示还是表单填写。
1. basicDetail 基本信息
2. buttonGroup 按钮组
> 根据不同的角色和数据所处的队列下有不同的按钮功能和文本。
3. checkErrorModal 检查错误对话框
4. documentDetail 文书信息
5. propertyDetail 房产信息
6. returnRemark 退回备注
7. roleDetail 角色信息
8. wrongDetail 错误信息

common 通用
1. breadcrumb 面包屑
2. index.js  函数式组件 内附注释

layout 布局
1. leftMenu 导航栏
2. topMenu 顶部菜单 
> 包含忘记密码对话框和退出登录


utils 工具类
1. common（表单过滤 处理空值 日期处理 ）
2. pagination（分页）
3. validators（自定义检验）


static 静态数据
1. axisStyle 前任的图表定义样式
2. columns 表格的通用列
3. status  常量

assets 图片和全局样式修改文件