export default function createPaginationProps(current=1, total, showQuickJumper = true,pageSize=20) {
    return {
        current,  //当前页数
        showQuickJumper, //是否显示快速跳转工具
        total, // 数据总数
        pageSize, // 每页条数 默认20
        showTotal: (() => {
            return `共 ${total} 条`;
        }),
    }
}