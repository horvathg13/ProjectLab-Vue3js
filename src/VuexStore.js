import { createStore } from "vuex";

export const store = createStore({
    state:{
      username: null,
      userData: {},
      userRole:{},
      userID: null,
      selectedRows:[],
      unreadMessages:{},
      notifications:[],
      

    },
    mutations:{
        getNotifications(state,data){
            state.notifications = data
        },
        getUnreadMessages(state,data){
            state.unreadMessages = data
        },
        
        setUserData(state, data) {
            state.userData = data
            state.username = data.name
            state.userID = data.id
        },
  
        deleteUserData(state){
            state.userData = {}
            state.username = ""
            state.userID = {}
        },
  
        deleteUsername(state){
            state.username=""
        },
  
        setuserRole(state,userRole){
            state.userRole=userRole
        },
        deleteUserRole(state,userRole){
            state.userRole=""
        },
  
        setUserID(state,data){
            state.userID = data.id
        },
  
        setSelectedRows(state,selectedRows){
            state.selectedRows = selectedRows
        },
    },
})