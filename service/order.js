const db = require('../config/db')         // 引入配置文件
const Sequelize = db.sequelize;
const Order = Sequelize.import("../model/order.js"); 
Order.sync({ force: false });    // 自动创建表 (加force:true, 会先删掉表后再建表)

class OrderService {
    /*
    * 新增商品
    */
    static async addOrder(data) {
        return await Order.create(data)
    }

    /*
    *  查询商品
    */
    static async getOrder(id) {
        return await Order.findOne({
            where: { id }
        })
    }

    /*
    *  查询列表
    */
    static async getList(data) {
        if (data) {
            const { pageIndex, pageSize } = data;
            const list = await Order.findAndCountAll({
                limit: parseInt(pageSize),
                offset: parseInt(pageIndex - 1) * parseInt(pageSize),
                order: [
                    ['updatedAt', 'DESC']
                ]
            });
            return {
                list: list.rows,
                pageIndex: parseInt(pageIndex),
                pageSize: 10,
                total: list.count,
                totalPage: Math.ceil(list.count / pageSize),
            };
        } else {
            const list = await Order.findAll({
                order: [
                    ['updatedAt', 'DESC']
                ]
            });
            return {
                list
            };
        }
    }
    /*
        *  删除
    */
    static async delete(id) {
        return await Order.destroy({
            where: { id }
        })
    }
}

module.exports = OrderService;