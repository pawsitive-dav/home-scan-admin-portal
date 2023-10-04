export const state = () => ({
  refreshToken: false,
  accountId: null,
  avatarPath: null,
  firstName: null,
  lastName: null,
  codeName: null,
  role: null,
})

export const mutations = {
  setRefreshToken(state) {
    state.refreshToken = true
  },
  setMemberInfo(state, data) {
    state.accountId = data.accountId
    state.avatarPath = data.avatarPath
    state.firstName = data.firstName
    state.lastName = data.lastName
    state.codeName = data.codeName
    state.role = data.role
  },
  setLogout(state) {
    state.refreshToken = false
    state.accountId = null
    state.avatarPath = null
    state.firstName = null
    state.lastName = null
    state.codeName = null
    state.role = null
  },
}

export const actions = {
  setRefreshToken({ commit }) {
    commit('setRefreshToken')
  },

  setMemberInfo({ commit }, data) {
    commit('setMemberInfo', { ...data })
  },

  async getAccessToken({ commit }) {
    const refreshToken = localStorage.getItem('_cp_scpoe')
    const decodeToken = atob(refreshToken)

    return await this.$axios
      .post(`${process.env.AUTH_ENDPOINT}/v1/auth/verify/token`, null, {
        headers: {
          Authorization: `Bearer ${decodeToken}`,
        },
      })
      .then(({ data }) => {
        if (data && data.data) {
          const accessToken = data.data.accessToken
          return accessToken
        }
        return null
      })
      .catch((error) => {
        if (error) return false
      })
  },

  setLogout({ commit }) {
    commit('setLogout')
  },
}
