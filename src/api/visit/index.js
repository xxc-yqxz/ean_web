import request from '@/utils/request'

export default {
    getOrSearchUserInfo(searchInfo) {
        return request.post(`/api/admin/user_info`, searchInfo)
    },

    UserChange(info) {
        return request.post(`/api/admin/user_change`, info)
    },

    UserDelete(userIds) {
        return request.post(`/api/admin/user_delete`, userIds)
    },
    getOrSearchRecordInfo(searchInfo) {
        return request.post(`/api/admin/record_info`, searchInfo)
    },
    recordDelete(recordIds) {
        return request.post(`/api/admin/record_delete`, recordIds)
    },
    changeApproval(info) {
        return request.post(`/api/admin/approval`, info)
    },
}
