
// 0(上传中), 1 (上传成功), 2 (已上传)

export const UPLOAD_STATUS_SCZ = 0 // 上传中
export const UPLOAD_STATUS_SCCG = 1 // 上传成功
export const UPLOAD_STATUS_YSC = 2 // 已上传

export const UPLOAD_STATUS = [
  { label: '上传中', value: UPLOAD_STATUS_SCZ },
  { label: '上传成功', value: UPLOAD_STATUS_SCCG },
  { label: '已上传', value: UPLOAD_STATUS_YSC },
]
