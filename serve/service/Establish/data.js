const express = require('express')
const app = express()
const Mock = require('mockjs')

app.post('/fn/qc/foster/qcFosterPlanList', function (req, res) {
  const data = {
    code: 0,
    data: {
      list: [
        {
          planId: 1,
          proId: 83,
          annual: '2022',
          projectId: 'Y22035',
          projectName: '耀你不一样（科技条线）2022',
          projectType: '28002',
          projectTypeDesc: '耀你不一样(条线)',
          lineGroupId: '85',
          organId: null,
          lineName: '科技条线',
          organName: '',
          outline:
            '4545454545454545554545江山帝景发射基地【】阿斯顿福建省【附件爱上【大姐夫爱哦的金佛我阿斯加德覅警示牌递交发票是低级房破我阿斯加德覅偶加上低价佛阿斯加德佛我加上低叫法升级  破is大姐夫皮哦啊时代峻峰怕水电费\n斯蒂芬紧迫阿斯加封皮a\n\n是递减法是哦大姐夫拍世纪东方\n\n时代峻峰IPA时代峻峰 \n\n时代峰峻怕死的假发票ad\n\n是点击佛安排的就\n\n使劲地扶贫就按审批单据\n\n受打击非怕死的假发票桥儿头\n\n时代峻峰扒鸡大泼妇\n\n微胖界热平稳阿萨德饭啊\nsadf\nsad\na\n手动阀\n\n ',
          planFileUrl:
            'htttt://e66c01ed-bucket.pabosuat.sdb.com.cn/UDMP-ca56170ba4e172626cbd21fa5bb9e93dd3f4f0451e-e66c01ed-20220617102616-00000001/1?attname=RobeeStudio_V2022.1.1.1.zip&e=1663989917&token=Vm99oMQ9DtGUu5mdwRHDpLqYi2JTGuna8r7KGL2o:6Dmj6Ehoc-z_b_sGYgGevDneLqk=',
          planFileUdmpId: 'UDMP-ca56170ba4e172626cbd21fa5bb9e93dd3f4f0451e-e66c01ed-20220617102616-00000001',
          planFileName: 'RobeeStudio_V2022.1.1.1.zip',
          status: '1',
          statusDesc: '已提交',
          projectBlg: '科技条线',
          createdBy: 'CHENHAOWEN395',
          orgId: 'S000002922',
          orgName: '平安银行',
          updatedBy: 'WANGZIWEN182',
          advisers: 'SHIBOXIN392|AMYCHOI',
          createdTime: '2022-06-09T08:10:22.000+0000',
          updatedTime: '2022-09-13T02:18:58.000+0000',
          startDate: '2022-06-01',
          endDate: '2023-07-01',
          adviserList: null,
          fileList: null,
          parentOrgIds: null,
          updatedName: '平安文'
        },
      ],
      total: 25,
      page: 0,
      size: 0
    }
  }
  res.send(data)
})

// 潜才培养方案详情
app.post('/fn/qc/foster/fosterPlanDetail', function (req, res) {
  const data = {
    code: 0,
    data: {
      planId: 1,
      proId: 83,
      annual: '2022',
      projectId: 'Y22035',
      projectName: '耀你不一样（科技条线）2022',
      projectType: '28002',
      projectTypeDesc: '耀你不一样(条线)',
      lineGroupId: '85',
      organId: null,
      lineName: '科技条线',
      organName: '',
      outline:
        '4545454545454545554545江山帝景发射基地【】阿斯顿福建省【附件爱上【大姐夫爱哦的金佛我阿斯加德覅警示牌递交发票是低级房破我阿斯加德覅偶加上低价佛阿斯加德佛我加上低叫法升级  破is大姐夫皮哦啊时代峻峰怕水电费\n斯蒂芬紧迫阿斯加封皮a\n\n是递减法是哦大姐夫拍世纪东方\n\n时代峻峰IPA时代峻峰 \n\n时代峰峻怕死的假发票ad\n\n是点击佛安排的就\n\n使劲地扶贫就按审批单据\n\n受打击非怕死的假发票桥儿头\n\n时代峻峰扒鸡大泼妇\n\n微胖界热平稳阿萨德饭啊\nsadf\nsad\na\n手动阀\n\n ',
      planFileUrl: null,
      planFileUdmpId: 'UDMP-ca56170ba4e172626cbd21fa5bb9e93dd3f4f0451e-e66c01ed-20220617102616-00000001',
      planFileName: 'RobeeStudio_V2022.1.1.1.zip',
      status: '1',
      statusDesc: null,
      projectBlg: '科技条线',
      createdBy: 'CHENHAOWEN395',
      orgId: 'S000002922',
      orgName: '平安银行',
      updatedBy: 'WANGZIWEN182',
      advisers: null,
      createdTime: '2022-06-09T08:10:22.000+0000',
      updatedTime: '2022-09-13T02:18:58.000+0000',
      startDate: '2022-06-01',
      endDate: '2023-07-01',
      adviserList: [
        {
            createdBy: null,
            updatedBy: null,
            createdDate: null,
            updatedDate: null,
            id: null,
            umId: 'SHIBOXIN392',
            empName: '徐瑞鸾',
            empno: null,
            blgOrgId: null,
            blgOrgName: null,
            blgStripLine: null,
            dateHire: null,
            postDesc: null,
            allPrnNodeOrg: null,
            leaved: null,
            dateLeave: null
          },
          {
            createdBy: null,
            updatedBy: null,
            createdDate: null,
            updatedDate: null,
            id: null,
            umId: 'AMYCHOI',
            empName: '平安丽凤',
            empno: null,
            blgOrgId: null,
            blgOrgName: null,
            blgStripLine: null,
            dateHire: null,
            postDesc: null,
            allPrnNodeOrg: null,
            leaved: null,
            dateLeave: null
          }
        ],
        fileList: [
          {
            id: 2701471,
            udmpId: 'UDMP-ca56170ba4e172626cbd21fa5bb9e93dd3f4f0451e-e66c01ed-20220617102616-00000001',
            fileName: 'RobeeStudio_V2022.1.1.1.zip',
            fileUrl:
              'htttt://e66c01ed-bucket.pabosuat.sdb.com.cn/UDMP-ca56170ba4e172626cbd21fa5bb9e93dd3f4f0451e-e66c01ed-20220617102616-00000001/1?attname=RobeeStudio_V2022.1.1.1.zip&e=1663990100&token=Vm99oMQ9DtGUu5mdwRHDpLqYi2JTGuna8r7KGL2o:A71pS85HwRD4mFeHgpT2kcdz94I=',
            module: 'fosterPlan',
            submodule: 'plan_file',
            busiId: '1',
            sortNum: 0,
            sizes: 0,
            fileDuration: 0,
            fileType: null,
            durationUpdateFlag: 'N',
            fileAlias: null,
            filePlayBar: null,
  