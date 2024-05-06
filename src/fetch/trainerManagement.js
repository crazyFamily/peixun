import { httpServe, dataHeaders } from '@/util/utils'

// 培训师直播记录列表
export const fetchLiveRecordListByTrainers = (params) => httpServe('/fn/trainer/eval/liveRecordListByTrainers', { data: { ...params.data, tip: 'Y' } })

// 导出培训师直播记录
export const fetchExportLiveRecordListByTrainers = (params) =>
httpServe(
  '/fn/trainer/eval/liveRecordListByTrainers',
  { data: { ...params.data, tip: 'N' } },
  {
    headers: { responseType: 'blob' }
  }
  )
  
// 获取授课领域
export const fetchListDictsForSelector = (params) => httpServe('/fn/commons/dict/listDictsForSelector', params)


// 全量微课记录
export const fetchMicrocoursesList = ({ data }) => httpServe('/fn/trainer/eval/microcoursesList', { data: {...data, tip: 'Y'}})
// 导出全量微课记录
export const fetchExportMicrocoursesList = ({ data }) =>
  httpServe(
    '/fn/trainer/eval/microcoursesList',
    { data: { ...data, tip: 'N' } },
    {
      headers: { responseType: 'blob' }
    }
  )