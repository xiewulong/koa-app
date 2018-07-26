/*!
 * User
 * xiewulong <xiewulong@vip.qq.com>
 * create: 2018/07/25
 * since: 0.0.1
 */
'use strict';

const ActiveRequestBase = require('./active_request_base');

module.exports.default = module.exports = class User extends ActiveRequestBase {

  constructor(attributes = {}, options = {}) {
    super(attributes, options);
  }

  /**
   * 缓存描述
   *
   * @since 0.0.1
   * @return {none}
   */
  caches() {
    // this.cache('key', 'value');
    // this.has_many('users', () => await User.list());
    // this.has_one('user', () => await User.find(1));
    // ...
  }

  /**
   * 定义属性(字段)配置
   * 保留字: _attributes, _attributes_changed, _attributes_stored, _caches, _primary_key, add_error, api, assign_attributes, attribute, attributes, belongs_to, cache, caches, clear_errors, error_messages, errors, extract_attributes, has_many, has_one, is_changed, is_new_record, is_valid, store_attributes
   * 属性(字段)名如果和保留字冲突, 请适当调整, 以避免覆盖model定义好的方法
   *
   * @since 0.0.1
   * @param {boolean} absence 校验必须为空
   * @param {string} default 默认值
   * @param {boolean} confirmation 校验两个文本字段的值是否完全相同
   * @param {array} exclusion 校验是否不在指定的集合中
   * @param {object} format 格式化定义
   * @param {string|function} format.assign 格式化赋属性值, 优先级高于in
   * @param {string|function} format.extract 格式化提取属性值, 优先级高于out
   * @param {string|function} format.in 格式化赋属性值, assign的别名, 优先级低于assign
   * @param {string|function} format.out 格式化提取属性值, extract的别名, 优先级低于extract
   * @param {function} if 判断是否需要校验
   * @param {array} inclusion 校验是否在指定的集合中
   * @param {boolean|object} length 长度校验
   * @param {integer} length.is 校验长度必须等于指定值
   * @param {integer} length.maximum 校验长度不能比指定的长度长
   * @param {integer} length.minimum 校验长度不能比指定的长度短
   * @param {regex} match 校验是否匹配指定的正则表达式
   * @param {boolean|object} numericality 校验是否只包含数字
   * @param {number} numericality.equal_to 校验必须等于指定的值
   * @param {number} numericality.greater_than 校验必须比指定的值大
   * @param {number} numericality.greater_than_or_equal_to 校验必须大于或等于指定的值
   * @param {number} numericality.less_than 校验必须比指定的值小
   * @param {number} numericality.less_than_or_equal_to 校验必须小于或等于指定的值
   * @param {boolean} numericality.only_integer 校验是否只接受整数, 默认false
   * @param {number} numericality.other_than 校验必须与指定的值不同
   * @param {boolean} numericality.odd 校验必须是奇数, 默认false
   * @param {boolean} numericality.even 校验必须是偶数, 默认false
   * @param {array} on 触发校验事件列表
   * @param {string} original_name 原始属性名
   * @param {boolean} presence 校验必须为非空
   * @param {boolean} primary_key 是否为主键
   * @param {regex} unmatch 校验是否不匹配指定的正则表达式
   * @param {string|function} validator 自定义验证
   * @param {array} validators 验证器
   * @return {object}
   */
  get attributes() {
    return {
      id: {original_name: 'user_id', primary_key: true}, // ID
      username: {original_name: 'userName', presence: true}, // 用户名
      password: {original_name: 'password_hash', presence: true}, // 密码
    };
  }

  /**
   * 用户登录
   *
   * @since 0.0.1
   * @param {object} [attributes={}] 属性值
   * @return {promise}
   */
  login(attributes = {}) {
    this.clear_errors()
        .assign_attributes(attributes)
        ;

    let params = this.extract_attributes([], true, 'login');
    let data = this.extract_attributes(['username', 'password'], true, 'login');

    this.is_valid && this.assign_attributes({id: 1});

    return this;
  }

  /**
   * 根据ID查询单条记录
   *
   * @since 0.0.1
   * @param {integer} id 用户ID
   * @return {promise}
   */
  static find(id) {
    return {
      id: 1,
      username: 'Koa'
    };
  }

};
