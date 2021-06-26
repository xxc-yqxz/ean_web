import request from '@/utils/request'

export default {
    getOrSearchUserInfo(searchInfo) {
        return request.post(`/api/admin/user_info`, searchInfo)
    },

    UserChange() {
        return request.post(`/api/admin/user_change`, info)
    },

    UserDelete(userIds) {
        return request.post(`/api/admin/user_delete`, userIds)
    }
}
