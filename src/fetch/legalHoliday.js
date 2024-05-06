import { httpServe, dataHeaders } from '@/util/utils'

// 查询法定节假日
export const fetchGetHoliday = params =>
  httpServe('/fn/trainer/eval/listHoliadyDays', {
    data: { ...params.data, tip: 'Y' }
  })

// 删除法定节假日
export const fetchDeleteHoliday = params =>
  httpServe('/fn/trainer/eval/deleteHoliadyDays', params)

// 修改法定节假日
export const fetchUpdateHoliadyDays = params =>
  httpServe('/fn/trainer/eval/updateHoliadyDays', params)

// 导出法定节假日
export const fetchExportHoliday = params =>
  httpServe(
    '/fn/trainer/eval/listHoliadyDays',
    { data: { ...params.data, tip: 'N' } },
    { headers: { responseType: 'blob' } }
  )

// 导入法定节假日
export const fetchImportHoliday = params =>
  httpServe('/common/trainer/batchImportHolidays', params, dataHeaders)