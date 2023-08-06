/**
 *   全局过滤器
 * user.name=ex-zhuowenbiao001
user.email=ex-zhuowenbiao001@pingan.com.cn
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDeHfjdxKpwWtH6a2eGMvpflC02uT3cH/msY4j454szqs7WmYU2BwzNFp6rNfIIvOoWuj3skIiuRq1RB2wgyQ5X4qpPIsvQqGJpo4rnKZtojQLExrCxtR5QwvdRY16d+dI/hmCa+fO3Aim+/vlzFDSlgQsSkPNv2NyZoMwt5JViWe4d/gaPPD+Rjz28ukRCr5HcGGgktevOF7QThn36x5BPB8McFU2aYCrpDSsa179CiVNvXp0WdFRC0x7mP7oNgj+xP+dks6qeLjyxyL511t7yNPASgWhd5wgQUa0MZ6TkryjAavcFaZHDgQOJIbCyA1wHQDou1OLULuYa7o+86ZnT ex-zhuowenbiao001@pingan.com.cn

 */

import { filterBusiType, formatDate } from '../util/utils'

// 过滤器列表
let filterList = {
  filterTime(time) {
    if (!time) return
    time = time.split('T')[0]
    time = time.split(' ')[0]
    return time
  },
  filterBusiType,
  formatDate
}
export const filterInit = vue => {
  // 全局过滤器初始化
  Object.keys(filterList).forEach(v => {
    vue.filter(v, filterList[v])
  })
}
